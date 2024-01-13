import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { useDependencies } from '../../../context/dependencies'
import { useAuth } from '../../../context/auth'
import BadgeAward from '../../../models/BadgeAward'
import GotBook from '../../../models/GotBook'
import * as Modal from '../../../components/UI/Modal'
import BadgeAwardComponent from '../../../components/BadgeAwardComponent/BadgeAwardComponent'

const GotBookComponent: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [badgeAwards, setBadgeAwards] = useState<BadgeAward[]>([])
  const [previousBadgeAwards, setPreviousBadgeAwards] = useState<BadgeAward[]>([])
  const { getApiService, getToastUtils } = useDependencies()
  const toastUtils = getToastUtils()
  const apiService = getApiService()
  const { token } = useAuth()
  const badgeAwardService = apiService.getBadgeAward(token)
  const gotBookService = apiService.getGotBook(token)
  const [gotBook, setGotBook] = useState<GotBook | null>(null)
  const [currentBadgeAward, setCurrentBadgeAward] = useState<BadgeAward>()

  const fetchData = async () => {
    setGotBook(
      await gotBookService.getGotBook(),
    )
    setBadgeAwards(await badgeAwardService.getBadgeAwardsForGotBook())
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (gotBook) {
      const foundBadgeAward = badgeAwards.find((award) => award.grant_date === null)
      if (foundBadgeAward) {
        setCurrentBadgeAward(foundBadgeAward)
      }

      const filteredBadgeAwards = badgeAwards.filter((award) => award.grant_date !== null)
      setPreviousBadgeAwards(filteredBadgeAwards)
    }
    setLoading(false)
  }, [gotBook, badgeAwards])

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
    return (
      <div className="mt-3 text-center">
        <Spinner animation="border" role="status" className="text-center">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4">
        Książeczka GOT
      </h1>
      { !gotBook ? (
        <div className="alert alert-warning" role="alert">
          <h4>Nie masz jeszcze założonej książeczki GOT</h4>
          <Modal.Component
            title="Załóż książeczkę"
            message="Czy na pewno chcesz założyć książeczkę GOT?"
            action={createGotBook}
            variant="success"
          />
        </div>
      ) : currentBadgeAward && (
        <>
          <h5 className="text-warning">Obecnie zdobywana odznaka</h5>
          <hr className="text-warning" />
          <BadgeAwardComponent
            badgeAward={currentBadgeAward}
            variant="warning"
          />
          <h5 className="text-success mt-5">Poprzednie odznaki</h5>
          <hr className="text-success" />
          {previousBadgeAwards.map((award) => (
            <BadgeAwardComponent
              badgeAward={award}
              variant="success"
              key={uuidv4()}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default GotBookComponent
