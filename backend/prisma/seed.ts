import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Primero crear usuarios si no existen
  const user1 = await prisma.user.upsert({
    where: { email: 'admin2@example.com' },
    update: {},
    create: {
      email: 'admin3@example.com',
      name: 'Juan Pérez',
      password: '$2b$12$HAEXkh2CPkYljUJXkcILv.oytZPEWdX/odj20sBgjmW3fM6ZiXTye', 
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      email: 'maria@example.com',
      name: 'María González',
      password: '$2b$12$HAEXkh2CPkYljUJXkcILv.oytZPEWdX/odj20sBgjmW3fM6ZiXTye',
    },
  })

  // Crear proyectos
  const project1 = await prisma.project.create({
    data: {
      name: 'Sistema de Ventas',
      description: 'Plataforma e-commerce para ventas online',
      ownerId: user1.id,
      members: {
        create: [
          { userId: user1.id, role: 'OWNER' },
          { userId: user2.id, role: 'MEMBER' },
        ],
      },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'App Móvil Delivery',
      description: 'Aplicación de delivery de comida',
      ownerId: user2.id,
      members: {
        create: [
          { userId: user2.id, role: 'OWNER' },
        ],
      },
    },
  })

  console.log({ user1, user2, project1, project2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })