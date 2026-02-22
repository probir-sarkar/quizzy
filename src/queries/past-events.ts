import prisma from '@/lib/prisma'
import { PastEvent, EventCategory } from '@/generated/prisma/client'
import { cacheLife } from 'next/cache';

export const getPastEventsByMonthDay = async (month: number, day: number): Promise<PastEvent[]> => {
  "use cache";
  cacheLife("days");

  try {
    const events = await prisma.pastEvent.findMany({
      where: {
        month: month,
        day: day,
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
}

export const getPastEventsByCategory = async (category: EventCategory): Promise<PastEvent[]> => {
  "use cache";
  cacheLife("days");

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

export const getAllEventCategories = async (): Promise<EventCategory[]> => {
  "use cache";
  cacheLife("days");

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