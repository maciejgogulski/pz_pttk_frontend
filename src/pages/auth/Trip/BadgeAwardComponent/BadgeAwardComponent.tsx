import React, { useEffect, useState } from 'react'
import BadgeAward from '@/models/BadgeAward'
import Badge from '@/models/Badge'
import User from '@/models/User'
import { useDependencies } from '../../../../context/dependencies'


type BadgeAwardComponentProps = {
  badgeAward: BadgeAward
  users: User[]
  badges: Badge[]
}

const BadgeAwardComponent: React.FC<BadgeAwardComponentProps> = ({ badgeAward, users, badges }) => {
  const { getToastUtils } = useDependencies()
  const toastUtils = getToastUtils()

  
  const user = users.find((user) => user.id === badgeAward.userId)

  
  const badge = badges.find((badge) => badge.id === badgeAward.badge_id)

  if (!user || !badge) {
    toastUtils.Toast.showToast(
      toastUtils.types.ERROR,
      'Nie znaleziono użytkownika lub odznaki',
    )
    return null
  }

  return (
    <div>
      <h4>Nagroda w postaci odznaki:</h4>
      <p>Użytkownik - {user.name}</p>
      <p>Odznaka - {badge.name}</p>
      <p>Data przyznania - {badgeAward.grant_date.toLocaleString()}</p>
      <p>Status przyznania odznaki - {badgeAward.badge_award_status}</p>
    </div>
  )
}

export default BadgeAwardComponent
