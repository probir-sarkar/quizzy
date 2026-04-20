import prisma from '@/lib/prisma'
import { PastEvent, EventCategory } from '@/generated/prisma/client'

export abstract class PastEventService {
  static async getByMonthDay(month: number, day: number): Promise<PastEvent[]> {
    try {
      const events = await prisma.pastEvent.findMany({
        where: {
          month: month,
          day: day,
          isPublished: true
        },
        orderBy: [
          { year: 'asc' },
          { title: 'asc' }
        ],
        select: {
          id: true,
          month: true,
          day: true,
          year: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          tags: true,
          sourceUrls: true,
          eventDate: true,
          metadata: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return events
    } catch (error) {
      console.error('Error fetching past events:', error)
      return []
    }
  }

  static async getByCategory(category: EventCategory): Promise<PastEvent[]> {
    try {
      const events = await prisma.pastEvent.findMany({
        where: {
          category,
          isPublished: true
        },
        orderBy: [
          { month: 'asc' },
          { day: 'asc' },
          { year: 'asc' }
        ],
        select: {
          id: true,
          month: true,
          day: true,
          year: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          tags: true,
          sourceUrls: true,
          eventDate: true,
          metadata: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return events
    } catch (error) {
      console.error('Error fetching past events by category:', error)
      return []
    }
  }

  static async getAllCategories(): Promise<EventCategory[]> {
    try {
      const events = await prisma.pastEvent.findMany({
        where: {
          isPublished: true
        },
        select: {
          category: true
        },
        distinct: ['category']
      })

      return events.map(event => event.category)
    } catch (error) {
      console.error('Error fetching event categories:', error)
      return []
    }
  }
}
