import React, { ReactNode, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import BadgeAward from '../../models/BadgeAward'
import { useDependencies } from '../../context/dependencies'
import { useAuth } from '../../context/auth'

type BadgeAwardFormWrapperProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  children: ReactNode
  // eslint-disable-next-line react/no-unused-prop-types
  leaderVerification?: boolean
}

const BadgeAwardFormWrapper: React.FC<BadgeAwardFormWrapperProps> = (wrapperProps) => {
  if (wrapperProps.leaderVerification) {
    return <Form>{wrapperProps.children}</Form>
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{wrapperProps.children}</>
}

BadgeAwardFormWrapper.defaultProps = {
  leaderVerification: false,
}

type Props = {
    badgeAward: BadgeAward
    variant?: string
  leaderVerification?: boolean
}

const BadgeAwardComponent: React.FC<Props> = (props) => {
  const [entriesToVerify, setEntriesToVerify] = useState<{ [key: number]: boolean }>({})
  const { getApiService, getToastUtils } = useDependencies()
  const toastUtils = getToastUtils()
  const apiService = getApiService()
  const { token } = useAuth()
  const badgeAwardService = apiService.getBadgeAward(token)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, entryId: number) => {
    setEntriesToVerify((prevCheckedItems) => ({
      ...prevCheckedItems,
      [entryId]: event.target.checked,
    }))
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    try {
      // eslint-disable-next-line array-callback-return
      props.badgeAward.entries.map(async (entry) => {
        if (entriesToVerify[entry.id]) {
          await badgeAwardService.verifyGotBookEntry(entry.id)
        }
      })

      toastUtils.Toast.showToast(
        toastUtils.types.SUCCESS,
        'Pomyślnie zweryfikowano wpisy do książeczki GOT',
      )

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieoczekiwany błąd',
      )
    }
  }

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
    <BadgeAwardFormWrapper leaderVerification={props.leaderVerification}>
      <Table
        responsive
        hover
      >
        <thead>
          <tr className={`text-${props.variant}`}>
            <th colSpan={6}>
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
            <th>
              {props.leaderVerification && 'Zweryfikuj wpis'}
              {' '}
            </th>
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
                  <td>
                    {props.leaderVerification && entry.status === 'WAITING_FOR_LEADER_VERIFICATION' && (
                    <Form.Check
                      key={entry.id}
                      type="checkbox"
                      checked={entriesToVerify[entry.id] || false}
                      onChange={(e) => handleCheckboxChange(e, entry.id)}
                    />
                    )}
                  </td>
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

      {props.leaderVerification && (
      <Button
        className="me-2"
        type="submit"
        variant="success"
        onClick={(e) => onSubmit(e)}
      >
        Zweryfikuj wybrane odcinki
      </Button>
      )}
    </BadgeAwardFormWrapper>
  )
}

BadgeAwardComponent.defaultProps = {
  variant: 'primary',
  leaderVerification: false,
}

export default BadgeAwardComponent
