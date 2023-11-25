import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../../../../context/auth'
import { useDependencies } from '../../../../../context/dependencies'
import Trip from '@/models/Trip'
import * as Loading from '../../../../../components/UI/Loading'
import GotBook from '@/models/GotBook'
import BadgeAward from '@/models/BadgeAward'
import { getPath, PathNames } from '../../../../../utils/defines'
import TripEntry from '@/models/TripEntry'

type Props = {}

const MapToGot: React.FC<Props> = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const toastUtils = getToastUtils()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  const [tripsService] = useState(apiService.getTrip(token))
  const [gotBookService] = useState(apiService.getGotBook(token))
  const [gotBook, setGotBook] = useState<GotBook | null>(null)
  const [mappedEntries, setMappedEntries] = useState<TripEntry[] | undefined>([])
  const [unmappedEntries, setUnmappedEntries] = useState<TripEntry[] | undefined>([])
  const [latestBadgeAward, setLatestBadgeAward] = useState<BadgeAward | null>(null)

  const [entriesToMap, setEntriesToMap] = useState<{ [key: number]: boolean }>({})

  const getTrip = async () => {
    if (id) {
      const tmpTrip = await tripsService.getTrip(id)
      setTrip(tmpTrip)
      setMappedEntries(await tripsService.getMappedEntries(tmpTrip.id.toString()))
      setUnmappedEntries(await tripsService.getUnmappedEntries(tmpTrip.id.toString()))
    }
  }

  const getGotBook = async () => {
    setGotBook(
      await gotBookService.getGotBook(),
    )
  }

  const getLatestBadgeAward = async () => {
    setLatestBadgeAward(
      await gotBookService.getLatestBadgeAward(),
    )
  }

  // eslint-disable-next-line max-len
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, tripEntryId: number) => {
    setEntriesToMap((prevCheckedItems) => ({
      ...prevCheckedItems,
      [tripEntryId]: event.target.checked,
    }))
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    try {
      // eslint-disable-next-line array-callback-return
      trip?.tripEntries.map(async (entry) => {
        if (gotBook && latestBadgeAward && entriesToMap[entry.id]) {
          await gotBookService.mapEntryToGot(gotBook.id, latestBadgeAward.id, entry)
        }
      })

      toastUtils.Toast.showToast(
        toastUtils.types.SUCCESS,
        'Pomyślnie wpisano wybrane odcinki do książeczki GOT',
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

  useEffect(() => {
    getGotBook()
      .then(() => getLatestBadgeAward()
        .then(() => getTrip()
          .then(() => setLoading(false))))
  }, [tripsService, gotBookService])

  if (loading) {
    return <Loading.Component />
  }

  return (
    <div>
      <h2 className="mb-4">
        { `Wpisywanie odcinków wycieczki '${trip?.name}' do GOT` }
      </h2>
      { trip && (
      <>
        <Form>
          <Table responsive>
            <thead className="bg-light">
              <tr>
                <th> Lp. </th>
                <th> Odcinek </th>
                <th> Kierunek </th>
                <th> Data </th>
                <th className="text-center"> Punkty </th>
                <th className="text-center"> Wpisz do GOT </th>
              </tr>
            </thead>
            <tbody>
              { unmappedEntries && unmappedEntries.map((tripEntry, index) => (
                <tr key={tripEntry.id}>
                  <td>{index + 1}</td>
                  <td>{tripEntry.section.name}</td>
                  <td>
                    {
                  tripEntry.oppositeDirection ? (
                    <FontAwesomeIcon className="ms-4" icon={faArrowLeft} />
                  ) : (
                    <FontAwesomeIcon className="ms-4" icon={faArrowRight} />
                  )
                }
                  </td>
                  <td>
                    {dayjs(tripEntry.date).format('DD.MM.YYYY')}
                  </td>
                  <td className="text-center">
                    {
                  tripEntry.oppositeDirection
                    ? tripEntry.section.badge_points_b_to_a
                    : tripEntry.section.badge_points_a_to_b
                }
                  </td>
                  <td className="text-center">
                    <Form.Check
                      key={tripEntry.id}
                      type="checkbox"
                      checked={entriesToMap[tripEntry.id] || false}
                      onChange={(e) => handleCheckboxChange(e, tripEntry.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} className="text-center">
                  <Button
                    className="me-2"
                    type="submit"
                    variant="success"
                    onClick={(e) => onSubmit(e)}
                  >
                    Wpisz wybrane odcinki do książeczki GOT
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Form>

        <Table responsive>
          <thead className="bg-light">
            <tr>
              <th> Lp. </th>
              <th> Odcinek </th>
              <th> Kierunek </th>
              <th> Data </th>
              <th className="text-center"> Punkty </th>
            </tr>
          </thead>
          <tbody>
            { mappedEntries && mappedEntries.map((tripEntry, index) => (
              <tr key={tripEntry.id}>
                <td>{index + 1}</td>
                <td>{tripEntry.section.name}</td>
                <td>
                  {
                  tripEntry.oppositeDirection ? (
                    <FontAwesomeIcon className="ms-4" icon={faArrowLeft} />
                  ) : (
                    <FontAwesomeIcon className="ms-4" icon={faArrowRight} />
                  )
                }
                </td>
                <td>
                  {dayjs(tripEntry.date).format('DD.MM.YYYY')}
                </td>
                <td className="text-center">
                  {
                  tripEntry.oppositeDirection
                    ? tripEntry.section.badge_points_b_to_a
                    : tripEntry.section.badge_points_a_to_b
                }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button className="mb-3" variant="secondary" onClick={() => navigate(getPath(PathNames.TRIPS))}>
          Powrót do wycieczek
        </Button>
      </>
      )}
    </div>
  )
}

export default MapToGot
