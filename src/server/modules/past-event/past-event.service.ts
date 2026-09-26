import { db } from '@/lib/prisma'

export abstract class PastEventService {
  static async getByMonthDay(month?: number, day?: number) {
    // Default to today's date if not provided
    const today = new Date();
    const selectedMonth = month ?? today.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedDay = day ?? today.getDate();

    try {
      const rows = await db.orm.public.PastEvent
        .where({ month: selectedMonth, day: selectedDay, isPublished: true })
        .orderBy([(e) => e.year.asc(), (e) => e.title.asc()])
        .all()

      const events = rows.map((event) => ({
        ...event,
        tags: [...(event.tags ?? [])],
        sourceUrls: [...(event.sourceUrls ?? [])]
      }))

      return { events, month: selectedMonth, day: selectedDay }
    } catch (error) {
      console.error('Error fetching past events:', error)
      return { events: [], month: selectedMonth, day: selectedDay }
    }
  }
}
