/* eslint-disable no-unused-vars */

import { MountainDataInterface } from './MountainData'
import Auth from './Auth/Auth'
import Trip from './Trip/Trip'
import User from './User/User'
import GotBook from './GotBook/GotBook'
import Badge from './Badge/Badge'
import BadgeAward from './BadgeAward/BadgeAward'

export interface BackendInterface {
  mountainData: MountainDataInterface
  getAuth: () => Auth,
  getTrip: (token: string | undefined) => Trip,
  getBadge: (token: string | undefined) => Badge,
  getBadgeAward: (token: string | undefined) => BadgeAward,
  getUser: (token: string | undefined) => User
  getGotBook: (token: string | undefined) => GotBook,
}
