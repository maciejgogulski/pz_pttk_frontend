import ApiService from '../ApiService'
import TripEntry from '@/models/TripEntry'
import GotBook from '@/models/GotBook'
import BadgeAward from '@/models/BadgeAward'
import GotBookEntry from '../../../models/GotBookEntry'

class GotBookService {
  private gotBookUrl: string = '/got-books'

  private apiService: ApiService

  public async mapEntryToGot(
    gotBookId: number,
    badgeAwardId: number,
    entry: TripEntry,
  ): Promise<GotBookEntry> {
    const tripRequest = {
      got_book_id: gotBookId,
      badge_award_id: badgeAwardId,
      trip_plan_entry_id: entry.id,
      section_id: entry.section.id,
      trip_date: entry.date,
      b_to_a: Boolean(entry.oppositeDirection),
    }

    return this.apiService.put<GotBookEntry>(`${this.gotBookUrl}/map-entry`, tripRequest)
  }

  public async getGotBook() {
    return this.apiService.get<GotBook>(`${this.gotBookUrl}`)
  }

  public async createGotBook() {
    return this.apiService.post<GotBook>(`${this.gotBookUrl}`)
  }

  public async getLatestBadgeAward() {
    return this.apiService.get<BadgeAward>(`${this.gotBookUrl}/badge-award`)
  }

  public async getGotBookEntries(gotBookId: number) {
    const bookEntriesResponse = await this.apiService.get<any[]>(`${this.gotBookUrl}/${gotBookId}/entries`)
    return bookEntriesResponse.map((entryBase) => new GotBookEntry(
      entryBase.id,
      entryBase.got_book_id,
      entryBase.badge_award_id,
      entryBase.section_id,
      entryBase.section,
      entryBase.trip_date,
      Boolean(entryBase.b_to_a),
      entryBase.trip_plan_entry_id,
      entryBase.points,
      entryBase.status,
    ))
  }

  constructor(token: string) {
    this.apiService = new ApiService(token)
  }
}

export default GotBookService
