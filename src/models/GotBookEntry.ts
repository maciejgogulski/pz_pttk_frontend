/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

import Section from '@/models/Section'

class GotBookEntry {
  id: number

  gotBookId: number

  badgeAwardId: number

  sectionId: number

  section: Section

  date: Date

  b_to_a: boolean

  tripPlanEntryId: number

  points: number

  status: string

  constructor(
    id: number,
    sectionId: number,
    section: Section,
    tripDate: Date,
    gotBookId: number,
    badgeAwardId: number,
    // eslint-disable-next-line camelcase
    b_to_a: boolean,
    tripPlanEntryId: number,
    points: number,
    status: string,
  ) {
    this.id = id
    this.sectionId = sectionId
    this.section = section
    this.date = tripDate
    this.gotBookId = gotBookId
    // eslint-disable-next-line camelcase
    this.b_to_a = b_to_a
    this.badgeAwardId = badgeAwardId
    this.tripPlanEntryId = tripPlanEntryId
    this.points = points
    this.status = status
  }
}

export default GotBookEntry
