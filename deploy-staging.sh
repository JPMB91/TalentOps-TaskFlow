#!/bin/bash

echo "🚀 Iniciando despliegue a staging..."

# Configurar variables de entorno
if [ -f .env.staging ]; then
    cp .env.staging .env
    echo "✅ Variables de entorno configuradas"
else
    echo "⚠️  .env.staging no encontrado, usando variables existentes"
fi

# Parar servicios existentes
echo "🛑 Deteniendo servicios existentes..."
docker-compose -f docker-compose.staging.yml down

# Construir imágenes
echo "🔨 Construyendo imágenes Docker..."
docker-compose -f docker-compose.staging.yml build --no-cache

# Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose -f docker-compose.staging.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios inicien..."
sleep 15

# Ejecutar migraciones de base de datos
echo "🗄️ Ejecutando migraciones de base de datos..."
docker-compose -f docker-compose.staging.yml exec api npm run db:migrate

# Health check mejorado
echo "🔍 Verificando health de los servicios..."

# Esperar adicionalmente si es necesario
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        echo "✅ Backend saludable"
        break
    fi
    echo "⏳ Intento $attempt/$max_attempts - Esperando backend..."
    sleep 5
    attempt=$((attempt+1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Backend no responde después de $max_attempts intentos"
    exit 1
fi

# Verificar frontend (puede tomar más tiempo)
sleep 10
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend saludable"
else
    echo "⚠️  Frontend no responde inmediatamente (puede estar compilando)"
fi

echo ""
echo "✅ Despliegue a staging completado!"
echo "🌐 Frontend: http://localhost:3000"
echo "📡 API: http://localhost:4000"
echo "🗄️ Base de datos: localhost:5433"
echo ""
echo "📋 Para ver logs: docker-compose -f docker-compose.staging.yml logs -f"