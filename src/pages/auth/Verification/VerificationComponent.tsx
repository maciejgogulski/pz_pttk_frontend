import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { useDependencies } from '../../../context/dependencies'
import { useAuth } from '../../../context/auth'
import BadgeAward from '../../../models/BadgeAward'
import BadgeAwardComponent from '../../../components/BadgeAwardComponent/BadgeAwardComponent'

const VerificationComponent: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [badgeAwards, setBadgeAwards] = useState<BadgeAward[]>([])
  const { getApiService, getToastUtils } = useDependencies()
  // eslint-disable-next-line no-unused-vars
  const toastUtils = getToastUtils()
  const apiService = getApiService()
  const { token } = useAuth()
  const badgeAwardService = apiService.getBadgeAward(token)



  const fetchData = async () => {
    setBadgeAwards(await badgeAwardService.getBadgeAwardsForVerification())
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
        Weryfikacja wpisów do GOT
      </h1>
      {badgeAwards.map((award) => (
        <BadgeAwardComponent
          badgeAward={award}
          variant="success"
          leaderVerification
          key={uuidv4()}
        />
      ))}
    </div>
  )
}

export default VerificationComponent
