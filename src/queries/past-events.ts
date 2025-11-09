import { unstable_cache } from 'next/cache'
import prisma from '@/lib/prisma'
import { PastEvent, EventCategory } from '@/generated/prisma/client'

export const getPastEventsByMonthDay = async (month: number, day: number): Promise<PastEvent[]> => {
  return unstable_cache(
    async (m: number, d: number): Promise<PastEvent[]> => {
      try {
        const events = await prisma.pastEvent.findMany({
          where: {
            month: m,
            day: d,
            isPublished: true
          },
          orderBy: [
            { year: 'asc' }, // Oldest to newest
            { title: 'asc' }  // Alphabetical within same year
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
    },
    [`past-events-${month}-${day}`],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [`past-events-${month}-${day}`]
    }
  )(month, day)
}

export const getPastEventsByCategory = unstable_cache(
  async (category: EventCategory): Promise<PastEvent[]> => {
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
  },
  ['past-events-by-category'],
  {
    revalidate: 3600,
    tags: ['past-events']
  }
)

export const getAllEventCategories = async (): Promise<EventCategory[]> => {
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