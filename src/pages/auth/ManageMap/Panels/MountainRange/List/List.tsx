import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import MountainRange from '../../../../../../models/MountainRange'
import { getPath, PathNames } from '../../../../../../utils/defines'
import * as Modal from '../../../../../../components/UI/Modal'

interface Props {}

const List: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()
  const navigate = useNavigate()

  const [mountainRange, setMountainRange] = useState<(MountainRange | undefined)>(undefined)
  const { id } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [mountainRangeService] = useState(apiService.mountainData.getMountainRange(token))

  const deleteSection = async (sectionId: string) => {
    try {
      const sectionService = apiService.mountainData.getSection(token)
      await sectionService.deleteSection(sectionId)

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie odcinka przebiegło pomyślnie',
      )

      window.location.reload()
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  const deleteMountainRange = async () => {
    try {
      await mountainRangeService.deleteMountainRange(id || '')

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie pasma górskiego przebiegło pomyślnie',
      )

      navigate(getPath(PathNames.MANAGE_MAP))
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
        setMountainRange(
          await mountainRangeService.getOneMountainRange(id),
        )
      }
      setLoading(false)
    }
    fetchData()
  }, [id, mountainRangeService])

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
        mountainRange
          ? (
            <div>
              <div
                className="text-end"
              >
                <Button
                  className="me-2 mb-2"
                  href={getPath(PathNames.MOUNTAIN_RANGE_EDIT, {
                    id,
                  })}
                  variant="primary"
                >
                  Edytuj pasmo górskie
                </Button>

                <Modal.Component
                  title="Usuń pasmo górskie"
                  message="Czy napewno chcesz usunąć pasmo górskie?"
                  action={deleteMountainRange}
                  variant="danger"
                  style={{ marginBottom: '0.5rem' }}
                />
              </div>

              <h2 className="mb-3">
                Pasmo górskie:
                {' '}
                {mountainRange.name}
              </h2>
              <p className="mb-4">
                Należy do grupy górskiej
                {' '}
                <span className="fw-bold">
                  {mountainRange.mountain_group?.name}
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
                      Nazwa odcinka
                    </th>

                    <th
                      className="text-center"
                      scope="col"
                    >
                      Przeglądaj
                    </th>

                    <th
                      className="text-center"
                      scope="col"
                    >
                      Edytuj
                    </th>

                    <th
                      className="text-center"
                      scope="col"
                    >
                      Usuń
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    mountainRange.sections.map((section) => (
                      <tr
                        className="align-middle"
                        key={uuidv4()}
                      >
                        <th
                          scope="row"
                        >
                          { section.name }
                        </th>

                        <th className="text-center">
                          <Button
                            variant="secondary"
                            href={getPath(PathNames.SECTION, {
                              id: section.id,
                            })}
                          >
                            Przeglądaj
                          </Button>
                        </th>

                        <th className="text-center">
                          <Button
                            variant="primary"
                            href={getPath(PathNames.SECTION_EDIT, {
                              id: section.id,
                            })}
                          >
                            Edytuj
                          </Button>
                        </th>

                        <th className="text-center">
                          <Modal.Component
                            title="Usuń"
                            message="Czy napewno chcesz usunąć odcinek?"
                            action={() => deleteSection(section.id.toString() || '')}
                            variant="danger"
                          />
                        </th>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <Button
                className="me-2"
                href={getPath(PathNames.SECTION_ADD, {
                  rangeId: id,
                })}
                variant="success"
              >
                Dodaj odcinek
              </Button>

              <Button
                className="me-2"
                href={getPath(PathNames.MANAGE_MAP)}
                variant="secondary"
              >
                Powrót
              </Button>
            </div>
          )
          : (
            <h2>
              Nie znaleziono takiej grupy górskiej
            </h2>
          )
      }
    </div>
  )
}

export default List
