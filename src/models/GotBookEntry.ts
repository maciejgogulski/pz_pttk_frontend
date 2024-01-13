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

  oppositeDirection: boolean

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
    oppositeDirection: boolean,
    tripPlanEntryId: number,
    points: number,
    status: string,
  ) {
    this.id = id
    this.sectionId = sectionId
    this.section = section
    this.date = tripDate
    this.gotBookId = gotBookId
    this.oppositeDirection = oppositeDirection
    this.badgeAwardId = badgeAwardId
    this.tripPlanEntryId = tripPlanEntryId
    this.points = points
    this.status = status
  }
}

export default GotBookEntry
