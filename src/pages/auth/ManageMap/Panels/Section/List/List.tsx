import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import Section from '../../../../../../models/Section'
import { getPath, PathNames } from '../../../../../../utils/defines'
import * as Modal from '../../../../../../components/UI/Modal'

type Props = {}

const List: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()

  const { id } = useParams()
  const [section, setSection] = useState<(Section | undefined)>()
  const [loading, setLoading] = useState<(boolean)>(true)
  const [sectionService] = useState(apiService.mountainData.getSection(token))
  const toastUtils = getToastUtils()
  const navigate = useNavigate()

  const deleteSection = async () => {
    try {
      await sectionService.deleteSection(id || '')

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie odcinka przebiegło pomyślnie',
      )
      if (section) {
        navigate(getPath(PathNames.MOUNTAIN_RANGE, {
          id: section.mountainRange?.id,
        }))
      }
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setSection(
          await sectionService.getOneSection(id),
        )
      }
      setLoading(false)
    }
    fetchData()
  }, [id, sectionService])

  if (loading) {
    return (
      <div className="mt-3 text-center">
        <Spinner
          animation="border"
          role="status"
          className="text-center"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div>
      {
        section
          ? (
            <>
              <h2>
                Odcinek:
                {' '}
                {section.name}
              </h2>

              <p className="mt-3">
                Należy do pasma górskiego
                {' '}
                <span className="fw-bold">
                  {section.mountainRange?.name}
                </span>
              </p>

              <p className="">
                Należy do grupy górskiej
                {' '}
                <span className="fw-bold">
                  {section.mountainRange?.name}
                </span>
              </p>

              <p className="">
                Opis ocinka:
                {' '}
                <div className="fw-bold">
                  {section.description}
                </div>
              </p>

              <p className="">
                Punkty za trasę od punktu
                {' '}
                <span className="fw-bold">
                  {section.terrainPointA?.name}
                </span>
                {' '}
                do
                {' '}
                <span className="fw-bold">
                  {section.terrainPointB?.name}
                </span>
                :
                {' '}
                <span className="fw-bold">
                  {section.badge_points_a_to_b}
                </span>
              </p>

              <p className="mb-4">
                Punkty za trasę od punktu
                {' '}
                <span className="fw-bold">
                  {section.terrainPointB?.name}
                </span>
                {' '}
                do
                {' '}
                <span className="fw-bold">
                  {section.terrainPointA?.name}
                </span>
                :
                {' '}
                <span className="fw-bold">
                  {section.badge_points_b_to_a}
                </span>
              </p>

              <table
                className="table"
              >
                <thead>
                  <tr>
                    <th
                      scope="col"
                    >
                      Nazwa
                    </th>

                    <th
                      scope="col"
                    >
                      Szerokość geograficzna
                    </th>

                    <th
                      scope="col"
                    >
                      Długość geograficzna
                    </th>

                    <th
                      scope="col"
                    >
                      Wysokość
                    </th>

                  </tr>
                </thead>

                <tbody>
                  <tr
                    className="align-middle"
                  >
                    <th
                      scope="row"
                    >
                      { section.terrainPointA?.name }
                    </th>

                    <th
                      scope="row"
                    >
                      { section.terrainPointA?.latitude }
                    </th>

                    <th
                      scope="row"
                    >
                      { section.terrainPointA?.longitude }
                    </th>

                    <th
                      scope="row"
                    >
                      { section.terrainPointA?.sea_level_height }
                    </th>
                  </tr>

                  <tr
                    className="align-middle"
                  >
                    <th
                      scope="row"
                    >
                      { section.terrainPointB?.name }
                    </th>

                    <th
                      scope="row"
                    >
                      { section.terrainPointB?.latitude }
                    </th>

                    <th
                      scope="row"
                    >
                      { section.terrainPointB?.longitude }
                    </th>

                    <th
                      scope="row"
                    >
                      { section.terrainPointB?.sea_level_height }
                    </th>
                  </tr>
                </tbody>
              </table>

              <Button
                variant="primary"
                href={getPath(PathNames.SECTION_EDIT, {
                  id: section.id,
                })}
                className="me-2 mt-2"
              >
                Edytuj odcinek
              </Button>

              <Modal.Component
                title="Usuń odcinek"
                message="Czy napewno chcesz usunąć odcinek?"
                action={deleteSection}
                variant="danger"
                style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}
              />

              <Button
                className="me-2 mt-2"
                href={getPath(PathNames.MOUNTAIN_RANGE, {
                  id: section.mountainRange?.id,
                })}
                variant="secondary"
              >
                Powrót
              </Button>
            </>
          ) : (
            <p>
              Nie udało się znaleźć podanego odcinka
            </p>
          )
      }
    </div>
  )
}

export default List
