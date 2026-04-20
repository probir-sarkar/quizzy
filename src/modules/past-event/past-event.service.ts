import prisma from '@/lib/prisma'
import { PastEvent, EventCategory } from '@/generated/prisma/client'

export abstract class PastEventService {
  static async getByMonthDay(month?: number, day?: number): Promise<{ events: PastEvent[], month: number, day: number }> {
    // Default to today's date if not provided
    const today = new Date();
    const selectedMonth = month ?? today.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedDay = day ?? today.getDate();

    try {
      const events = await prisma.pastEvent.findMany({
        where: {
          month: selectedMonth,
          day: selectedDay,
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

      return { events, month: selectedMonth, day: selectedDay }
    } catch (error) {
      console.error('Error fetching past events:', error)
      return { events: [], month: selectedMonth, day: selectedDay }
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
