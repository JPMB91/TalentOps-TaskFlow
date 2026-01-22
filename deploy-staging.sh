# Scripts de despliegue
# deploy-staging.sh
#!/bin/bash

echo "🚀 Iniciando despliegue a staging..."

# Clonar código
git clone https://github.com/user/taskflow.git
cd taskflow

# Configurar variables de entorno
cp .env.staging .env

# Construir y desplegar
docker-compose -f docker-compose.staging.yml down
docker-compose -f docker-compose.staging.yml build --no-cache
docker-compose -f docker-compose.staging.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios inicien..."
sleep 30

# Ejecutar migraciones
docker-compose -f docker-compose.staging.yml exec api npx prisma migrate deploy

# Ejecutar seeders si es necesario
docker-compose -f docker-compose.staging.yml exec api npx prisma db seed

# Health check
echo "🔍 Verificando health de los servicios..."
curl -f http://localhost:3000/api/health || exit 1
curl -f http://localhost:4000/health || exit 1

echo "✅ Despliegue a staging completado!"
echo "🌐 Frontend: http://localhost:3000"
echo "📡 API: http://localhost:4000"