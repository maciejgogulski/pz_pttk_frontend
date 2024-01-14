/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

import GotBookEntry from '@/models/GotBookEntry'
import Badge from '@/models/Badge'
import Tourist from '@/models/Tourist'

class BadgeAward {
  id: number

  userId: number

  tourist: Tourist

  badge_id: number

  badge: Badge

  grant_date: Date

  badge_award_status: string

  points_from_previous_badge: number

  entries: GotBookEntry[]

  constructor(
    id: number,
    userId: number,
    tourist: Tourist,
    badgeId: number,
    badge: Badge,
    grantDate: Date,
    badgeAwardStatus: string,
    pointsFromPreviousBadge: number,
    entries: GotBookEntry[],
  ) {
    this.id = id
    this.userId = userId
    this.tourist = tourist
    this.badge_id = badgeId
    this.badge = badge
    this.grant_date = grantDate
    this.badge_award_status = badgeAwardStatus
    this.points_from_previous_badge = pointsFromPreviousBadge
    this.entries = entries
  }
}

export default BadgeAward
