# Script de despliegue a producción
# deploy-production.sh
#!/bin/bash

set -e  # Exit on any error

echo "🚀 Iniciando despliegue a producción..."

# Variables de entorno
ENV_FILE=".env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Archivo $ENV_FILE no encontrado"
    exit 1
fi

# Cargar variables de entorno
export $(cat $ENV_FILE | xargs)

# Verificar variables críticas
required_vars=("DATABASE_URL" "JWT_SECRET" "SSL_CERT_PATH")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Variable $var no definida"
        exit 1
    fi
done

# Backup de base de datos
echo "💾 Creando backup de base de datos..."
docker exec taskflow_db pg_dump -U $DB_USER -d $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Detener servicios
echo "🛑 Deteniendo servicios actuales..."
docker-compose -f docker-compose.prod.yml down

# Limpiar imágenes no utilizadas
docker image prune -f

# Construir nuevas imágenes
echo "🏗️ Construyendo imágenes..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo "▶️ Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios inicien..."
sleep 60

# Verificar health checks
echo "🔍 Verificando health checks..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f -k https://taskflow.com/health && \
       curl -f -k https://api.taskflow.com/health; then
        echo "✅ Health checks pasaron"
        break
    fi

    echo "Intento $attempt/$max_attempts falló, reintentando..."
    sleep 10
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Health checks fallaron después de $max_attempts intentos"
    echo "🔄 Ejecutando rollback..."
    # Rollback logic here
    exit 1
fi

# Ejecutar migraciones de base de datos
echo "🗄️ Ejecutando migraciones..."
docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy

# Ejecutar tests de humo en producción
echo "🧪 Ejecutando smoke tests..."
npm run test:smoke

# Limpiar recursos
docker system prune -f

# Notificar
echo "✅ Despliegue completado exitosamente!"
echo "🌐 Frontend: https://taskflow.com"
echo "📡 API: https://api.taskflow.com"
echo "📊 Monitoring: https://grafana.taskflow.com"

# Enviar notificación
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  -d "{\"text\":\"🚀 Production deployment completed successfully!\"}"