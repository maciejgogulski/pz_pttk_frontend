import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import Trip from '@/models/Trip'
import Styles from './Card.module.scss'
import Table from './Table'
import { getPath, PathNames } from '../../../../utils/defines'
import { useDependencies } from '../../../../context/dependencies'
import { useAuth } from '../../../../context/auth'
import * as Modal from '../../../../components/UI/Modal'

type Props = {
  trip: Trip
}

const CardComponent: React.FC<Props> = (props) => {
  const { getToastUtils, getApiService } = useDependencies()
  const { token } = useAuth()
  const apiService = getApiService()
  const toastUtils = getToastUtils()
  const [deleted, setDeleted] = useState<boolean>(false)

  const deleteTrip = async () => {
    try {
      const tripService = apiService.getTrip(token)
      await tripService.deleteTrip(props.trip.id.toString())

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Wycieczkę usunięto pomyślnie',
      )

      setDeleted(true)
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  if (deleted) {
    return <> </>
  }

  return (
    <Card
      className={`${Styles.content} mb-3`}
    >
      <Card.Header
        className={Styles.header}
      >
        {props.trip.name.toUpperCase()}
      </Card.Header>

      <Card.Body
        className="px-5"
      >
        <p className="mt-2 mb-4">
          {props.trip.description}
        </p>

        <h5>
          Przebieg wycieczki
        </h5>

        <Table
          tripEntries={props.trip.tripEntries}
        />

        <div className="text-end mt-2">
          <Button
            variant="primary"
            className="me-2"
            href={getPath(PathNames.TRIP_EDIT, {
              id: props.trip.id,
            })}
          >
            Edytuj
          </Button>

          <Modal.Component
            title="Usuń wycieczkę"
            message="Czy napewno chcesz usunąć tę wycieczkę"
            action={deleteTrip}
            variant="danger"
          />
        </div>
      </Card.Body>
    </Card>
  )
}

export default CardComponent