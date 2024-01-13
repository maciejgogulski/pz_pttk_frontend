import React from 'react'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import BadgeAward from '../../models/BadgeAward'

type Props = {
    badgeAward: BadgeAward
    variant?: string
}

const BadgeAwardComponent: React.FC<Props> = (props) => {
  const summarizeBadgePoints = (award: BadgeAward) => {
    let sum = 0
    // eslint-disable-next-line array-callback-return
    award.entries.map((entry) => {
      sum += entry.points
    })
    sum += award.points_from_previous_badge
    return sum
  }

  const translateBadgeAwardStatus = (award: BadgeAward) => {
    let translatedBadgeAwardStatus = ''
    switch (award.badge_award_status) {
      case 'COLLECTING_POINTS':
        translatedBadgeAwardStatus = 'ZBIERANIE PUNKTÓW'
        break
      case 'WAITING_FOR_LEADER_VERIFICATION':
        translatedBadgeAwardStatus = 'OCZEKUJE NA WERYFIKACJE PRZEZ PRZODOWNIKA'
        break
      case 'VERIFIED_BY_LEADER':
        translatedBadgeAwardStatus = 'ZWERYFIKOWANA PRZEZ PRZODOWNIKA'
        break
      default:
        translatedBadgeAwardStatus = ''
    }

    return translatedBadgeAwardStatus
  }

  const translateBookEntryStatus = (status: string) => {
    let translatedEntryStatus = ''
    switch (status) {
      case 'WAITING_FOR_LEADER_VERIFICATION':
        translatedEntryStatus = 'OCZEKUJE NA WERYFIKACJE PRZEZ PRZODOWNIKA'
        break
      case 'VERIFIED_BY_LEADER':
        translatedEntryStatus = 'ZWERYFIKOWANY PRZEZ PRZODOWNIKA'
        break
      default:
        translatedEntryStatus = ''
    }

    return translatedEntryStatus
  }

  return (
    <Table
      responsive
      hover
    >
      <thead>
        <tr className={`text-${props.variant}`}>
          <th colSpan={5}>
            {props.badgeAward.badge.name}
            {' '}
            [
            {translateBadgeAwardStatus(props.badgeAward)}
            ]
          </th>
        </tr>
        <tr>
          <th>Lp.</th>
          <th>Odcinek</th>
          <th>Kierunek</th>
          <th>Data</th>
          <th>Status</th>
          <th>Punkty</th>
        </tr>
      </thead>
      {props.badgeAward.entries.length > 0 ? (
        <>
          <tbody>
            {props.badgeAward.entries.map((entry, index) => (
              <tr key={uuidv4()}>
                <td>{index + 1}</td>
                <td>{entry.section.name}</td>
                <td>
                  {entry.oppositeDirection ? (
                    <FontAwesomeIcon className="ms-4" icon={faArrowLeft} />
                  ) : (
                    <FontAwesomeIcon className="ms-4" icon={faArrowRight} />
                  )}
                </td>
                <td>{dayjs(entry.date).format('DD.MM.YYYY')}</td>
                <td>{translateBookEntryStatus(entry.status)}</td>
                <td>{entry.points}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={5}>Punkty z poprzedniej odznaki</th>
              <td>{props.badgeAward.points_from_previous_badge}</td>
            </tr>
            <tr>
              <th colSpan={5}>Suma</th>
              <td>{summarizeBadgePoints(props.badgeAward)}</td>
            </tr>
          </tfoot>
        </>
      ) : (
        <tbody>
          <tr>
            <td colSpan={6} className="bg-warning">Nie masz jeszcze wpisów do tej odznaki</td>
          </tr>
        </tbody>
      )}
    </Table>
  )
}

BadgeAwardComponent.defaultProps = {
  variant: 'primary',
}

export default BadgeAwardComponent
