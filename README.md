# TaskFlow - Gestión de Proyectos y Tareas

[![CI/CD](https://github.com/username/taskflow/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/username/taskflow/actions/workflows/ci-cd.yml)
[![Coverage](https://codecov.io/gh/username/taskflow/branch/main/graph/badge.svg)](https://codecov.io/gh/username/taskflow)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Una aplicación web moderna para gestión de proyectos y tareas que permite a equipos colaborar eficientemente en el desarrollo de software.


## 🚀 Características

- **Autenticación JWT** segura
- **Dashboard** con métricas y actividad reciente
- **Gestión de proyectos y tareas**
- **Interfaz responsive** con Tailwind CSS
- **API RESTful** con Express.js
- **Base de datos PostgreSQL** con Prisma ORM
- **Despliegue Docker** completo
- **CI/CD** con GitHub Actions

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL 13+
- Docker y Docker Compose
- Git

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/JPMB91/TalentOps-TaskFlow
cd TalentOps-TaskFlow
```

### 2. Configurar variables de entorno
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/.env.example frontend/.env
```

Back-end: 
```bash
DATABASE_URL="postgresql://potgresUser:password@localhost:5432/taskflowapp?schema=public"
NODE_ENV="development"
JWT_SECRET=
JWT_EXPIRES_IN="7d"
PORT=4000
```

Front-end

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configurar base de datos
```bash
# Desde el directorio backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 🚀 Desarrollo

### Ejecutar en modo desarrollo

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### URLs de desarrollo
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health

## 🐳 Despliegue con Docker

### Staging
```bash
# Usar el script de despliegue
./deploy-staging.sh

# O manualmente
cp .env.staging .env
docker-compose -f docker-compose.staging.yml build
docker-compose -f docker-compose.staging.yml up -d
```

### URLs de staging
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000  
- Base de datos: localhost:5433
- Health Check: http://localhost:4000/health

## 🧪 Testing

### Backend
```bash
cd backend
npm test              # Tests unitarios
npm run test:coverage  # Tests con cobertura
```

### Frontend
```bash
cd frontend
npm test              # Tests unitarios
npm run test:coverage  # Tests con cobertura
```

### E2E con Cypress
```bash
# Desde el directorio raíz
npm run cypress:open  # Interfaz gráfica
npm run cypress:run   # Ejecución en CI
```

## 📊 Scripts disponibles

### Backend (`backend/package.json`)
- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilación TypeScript
- `npm start` - Producción
- `npm test` - Tests Jest
- `npm run db:migrate` - Migraciones de base de datos
- `npm run db:seed` - Datos de prueba

### Frontend (`frontend/package.json`)
- `npm run dev` - Desarrollo Next.js
- `npm run build` - Build de producción
- `npm start` - Servir build de producción
- `npm test` - Tests Jest
- `npm run type-check` - Verificación TypeScript

## 🗃️ Base de datos

### Esquema principal
- **Users** - Usuarios del sistema
- **Projects** - Proyectos con owner y miembros
- **Tasks** - Tareas con estados y prioridades
- **TaskAssignments** - Asignación de tareas a usuarios

### Migraciones
```bash
cd backend
npm run db:migrate    # Ejecutar migraciones
npm run db:generate   # Generar cliente Prisma
```

## 🔐 Autenticación

### Endpoints de autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil de usuario actual

### Uso de JWT
Los tokens JWT se envían automáticamente en el header `Authorization: Bearer <token>`

## 📈 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Métricas del usuario
- `GET /api/dashboard/activity` - Actividad reciente

### Proyectos
- `GET /api/projects` - Listar proyectos del usuario
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Detalles del proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Tareas
- `GET /api/tasks/projects/:projectId/tasks` - Tareas de un proyecto
- `POST /api/tasks/projects/:projectId/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

## 🚦 CI/CD

El pipeline de GitHub Actions incluye:

1. **Quality Checks** - TypeScript, linting, security audit
2. **Testing** - Unit tests, integration tests, coverage
3. **Build** - Compilación de frontend y backend
4. **E2E Testing** - Tests de extremo a extremo

