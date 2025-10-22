// src/scripts/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Clear existing data (optional)
    await prisma.quizAttempt.deleteMany()
    await prisma.userProgress.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.course.deleteMany()
    await prisma.user.deleteMany()

    // Create sample courses
    const course1 = await prisma.course.create({
      data: {
        courseId: 'ST_TN_10_E',
        name: 'Class 10 Science - English Medium',
        description: 'Tamil Nadu Board - English Medium',
        category: 'School Tuitions',
        board: 'TN Board',
        medium: 'English'
      }
    })

    const course2 = await prisma.course.create({
      data: {
        courseId: 'ST_TN_10_T',
        name: 'Class 10 Science - Tamil Medium',
        description: 'Tamil Nadu Board - Tamil Medium',
        category: 'School Tuitions',
        board: 'TN Board',
        medium: 'Tamil'
      }
    })

    const course3 = await prisma.course.create({
      data: {
        courseId: 'ST_CB_10_E',
        name: 'Class 10 Science - CBSE',
        description: 'CBSE Board - English Medium',
        category: 'School Tuitions',
        board: 'CBSE',
        medium: 'English'
      }
    })

    console.log('✅ Sample courses created!')

    // Create sample lessons for Class 10 Science English
    await prisma.lesson.create({
      data: {
        courseId: 'ST_TN_10_E',
        lessonId: 'laws-of-motion',
        title: 'Laws of Motion',
        description: 'Foundation of classical mechanics - Newton\'s Laws',
        order: 1
      }
    })

    await prisma.lesson.create({
      data: {
        courseId: 'ST_TN_10_E',
        lessonId: 'light-reflection',
        title: 'Light - Reflection and Refraction',
        description: 'Properties of light and optical phenomena',
        order: 2
      }
    })

    await prisma.lesson.create({
      data: {
        courseId: 'ST_TN_10_E',
        lessonId: 'electricity',
        title: 'Electricity',
        description: 'Electrical circuits and power',
        order: 3
      }
    })

    console.log('✅ Sample lessons created!')

    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Seeding error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seed()