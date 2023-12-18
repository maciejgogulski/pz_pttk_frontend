import ApiService from '../ApiService'
import BadgeAward from '../../../models/BadgeAward'

class BadgeAwardService {
  private badgeAwardUrl: string = '/badge-awards'
  private apiService: ApiService

  constructor(token: string) {
    this.apiService = new ApiService(token)
  }

  public async getAllBadgeAwards(): Promise<BadgeAward[]> {
    const badgeAwardsResponse = await this.apiService.get<BadgeAward[]>(`${this.badgeAwardUrl}`)
    return badgeAwardsResponse
  }

  public async getBadgeAward(badgeAwardId: string): Promise<BadgeAward> {
    const badgeAwardResponse = await this.apiService.get<BadgeAward>(`${this.badgeAwardUrl}/${badgeAwardId}`)
    return badgeAwardResponse
  }
}

export default BadgeAwardService
