import React, { useEffect, useState } from 'react'
import { useDependencies } from '../../../context/dependencies'
import { useAuth } from '../../../context/auth'
import Trip from '@/models/Trip'
import * as Loading from '../../../components/UI/Loading'
import * as Card from './Card'
import GotBook from '@/models/GotBook'
import * as Modal from '../../../components/UI/Modal'
import * as BadgeAwardComponent from './BadgeAwardComponent'
import Badge from '@/models/Badge'
import BadgeAward from '@/models/BadgeAward'
import User from '@/models/User'

type Props = {}

const TripComponent: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const toastUtils = getToastUtils()
  const { token } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [tripService] = useState(apiService.getTrip(token))
  const [gotBookService] = useState(apiService.getGotBook(token))
  const [gotBook, setGotBook] = useState<GotBook | null>(null)

  const [badges, setBadge] = useState<Badge[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [badgeAwards, setBadgeAwards] = useState<BadgeAward[]>([])
  const [userService] = useState(apiService.getUser(token))
  const [badgeService] = useState(apiService.getBadge(token))
  const [badgeAwardService] = useState(apiService.getBadgeAward(token))

  const fetchData = async () => {
    console.log("Fetching trips...")
    const tripsData = await tripService.getAllTrips()
    console.log("Trips data:", tripsData)

    console.log("Fetching gotBook...")
    const gotBookData = await gotBookService.getGotBook()
    console.log("GotBook data:", gotBookData)

    console.log("Fetching users...")
    const usersData = await userService.getAllUsersWithRoles()
    console.log("Users data:", usersData)

    console.log("Fetching badges...")
    const badgesData = await badgeService.getAllBadges()
    console.log("Badges data:", badgesData)

    console.log("Fetching badgeAwards...")
    const badgeAwardsData = await badgeAwardService.getAllBadgeAwards()
    console.log("BadgeAwards data:", badgeAwardsData)

    setTrips(tripsData)
    setGotBook(gotBookData)
    setUsers(usersData)
    setBadge(badgesData)
    setBadgeAwards(badgeAwardsData)
  }

  useEffect(() => {
    fetchData().then(() => setLoading(false))
  }, [tripService, gotBookService, userService, badgeService, badgeAwardService])

  const createGotBook = async () => {
    try {
      gotBookService.createGotBook()
        .then(() => {
          toastUtils.Toast.showToast(
            toastUtils.types.SUCCESS,
            'Utworzono książeczkę GOT',
          )
        })
      await fetchData()
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieoczekiwany błąd',
      )
    }
  }

  if (loading) {
    return <Loading.Component />
  }

  return (
    <div>
      <h2 className="text-center mb-4">
        Twoje wycieczki
      </h2>
      { !gotBook && (
      <div className="alert alert-warning" role="alert">
        <h4>Nie masz jeszcze założonej książeczki GOT</h4>
        <Modal.Component
          title="Załóż książeczkę"
          message="Czy na pewno chcesz założyć książeczkę GOT?"
          action={createGotBook}
          variant="success"
        />
      </div>
      )}
      {
        trips.map((trip) => (
          <div
            key={trip.id}
            className="mb-3"
          >
            <Card.Component
              trip={trip}
              gotBook={gotBook}
            />
          </div>
        ))
      }
      <div>
        {badgeAwards.map((badgeAward) => (
          <BadgeAwardComponent.Component
            key={badgeAward.id}
            badgeAward={badgeAward}
            users={users}  
            badges={badges}  
          />
      ))}
      </div>
    </div>
  )
}

export default TripComponent
