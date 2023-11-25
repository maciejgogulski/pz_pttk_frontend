import React, { useEffect, useState } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { PathNames, getPath } from '../../../../../utils/defines'
import * as Input from '../../../../../components/UI/Input'
import * as Checkbox from '../../../../../components/UI/Checkbox'
import * as Modal from '../../../../../components/UI/Modal'
import * as MapDefinition from '../../../../../components/Map'
import TextArea from '../../../../../components/UI/TextArea'
import * as types from './types'
import Select from '../../../../../components/UI/Select'
import { useDependencies } from '../../../../../context/dependencies'
import { useAuth } from '../../../../../context/auth'
import * as Loading from '../../../../../components/UI/Loading'
import Trip from '@/models/Trip'

type Props = {}

type SectionObj = {
  name: string
  a_to_b: number
  b_to_a: number
  pointAId: number
  pointBId: number
}

const Modify: React.FC<Props> = () => {
  const {
    control, register, handleSubmit, formState: { errors }, watch,
  } = useForm<types.Inputs>({
    mode: 'all',
  })

  const {
    fields, append, remove, update,
  } = useFieldArray({
    control,
    name: 'tripElements',
  })

  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useAuth()
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const toastUtils = getToastUtils()
  const [allSections, setAllSections] = useState<Record<number, SectionObj>>({})
  const [trip, setTrip] = useState<Trip | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [tripsService] = useState(apiService.getTrip(token))
  const [sectionService] = useState(apiService.mountainData.getSection(token))

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setTrip(
          await tripsService.getTrip(id),
        )
      }

      const sections = await sectionService.getSections()

      const allSectionsTemp: Record<number, SectionObj> = {}

      sections.forEach((section) => {
        allSectionsTemp[section.id] = {
          name: section.name,
          a_to_b: section.badge_points_a_to_b,
          b_to_a: section.badge_points_b_to_a,
          pointAId: section.terrain_point_a_id,
          pointBId: section.terrain_point_b_id,
        }
      })

      setAllSections(allSectionsTemp)

      setLoading(false)
    }

    fetchData()
  }, [id, tripsService, sectionService])

  useEffect(() => {
    trip?.tripEntries.forEach((entry, index) => {
      update(index, {
        section: entry.sectionId,
        date: entry.date,
        oppositeDirection: entry.oppositeDirection,
      })
    })
  }, [trip])

  if (loading) {
    return <Loading.Component />
  }

  const defaultTripElement: types.TripElement = {
    section: 0,
    date: new Date(),
    oppositeDirection: false,
  }

  const deleteTrip = async () => {
    try {
      const tripService = apiService.getTrip(token)
      await tripService.deleteTrip(id || '')

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Wycieczkę usunięto pomyślnie',
      )

      navigate(
        getPath(PathNames.TRIPS),
      )
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  const onSubmit: SubmitHandler<types.Inputs> = async (data) => {
    try {
      const tripService = apiService.getTrip(token)

      if (id) {
        await tripService.updateTrip(id, data)

        toastUtils.Toast.showToast(
          toastUtils.types.SUCCESS,
          'Edycja wycieczki przebiegła pomyślnie',
        )

        navigate(
          getPath(PathNames.TRIPS),
        )
      } else {
        await tripService.createTrip(data)

        toastUtils.Toast.showToast(
          toastUtils.types.SUCCESS,
          'Utworzenie wycieczki przebiegło pomyślnie',
        )

        navigate(
          getPath(PathNames.TRIPS),
        )
      }
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  return (
    <div>
      <h2 className="mb-4">
        {
          trip ? 'Edycja wycieczki' : 'Tworzenie wycieczki'
        }
      </h2>

      <div className="row">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-6"
        >
          <div className="mb-3">
            <Input.Component
              label="Nazwa wycieczki"
              type={Input.Type.TEXT}
              default={trip?.name}
              register={register}
              name="name"
              errorMessage={errors?.name?.message || undefined}
              validation={['required', 'min:3']}
            />
          </div>

          <div className="mb-3">
            <TextArea.Component
              label="Opis"
              height={150}
              default={trip?.description}
              register={register}
              name="description"
              errorMessage={errors?.description?.message || undefined}
            />
          </div>

          <h5 className="mb-3">
            Odcinki wycieczki
          </h5>

          {
            fields.map((tripElement, index) => {
              const fieldName = `tripElements.${index}`
              const sectionFieldName = `${fieldName}.section` as 'tripElements.0.section'
              const dateFieldName = `${fieldName}.date` as 'tripElements.0.date'
              const oppositeDirectionFieldName = `${fieldName}.oppositeDirection` as 'tripElements.0.oppositeDirection'
              const watchSectionField = watch(sectionFieldName)
              const watchOppositeDirectionField = watch(oppositeDirectionFieldName)

              return (
                <div
                  key={fieldName}
                  className="mb-3"
                >
                  <div className="mb-2 d-flex gap-2">
                    <Select.Component
                      label="Wybierz odcinek"
                      options={Object.fromEntries(
                        Object.entries(allSections).map(
                          ([sectionId, value]) => [sectionId, value.name],
                        ),
                      )}
                      register={register}
                      name={sectionFieldName}
                      errorMessage={errors?.tripElements?.[index]?.section?.message || undefined}
                    />

                    <Input.Component
                      label="Wybierz datę"
                      type={Input.Type.DATE}
                      register={register}
                      name={dateFieldName}
                      errorMessage={errors?.tripElements?.[index]?.date?.message || undefined}
                      validation={['required']}
                    />

                    <Button
                      variant="outline-danger"
                      onClick={() => remove(index)}
                    >
                      Usuń
                    </Button>
                  </div>

                  <div className="mb-2 d-flex justify-content-between">
                    <div className="fw-bold">
                      {
                        watchOppositeDirectionField
                          ? allSections[watchSectionField]?.b_to_a
                          : allSections[watchSectionField]?.a_to_b
                      }
                      {' '}
                      punktów
                    </div>

                    <Checkbox.Component
                      label="W kierunku przeciwnym?"
                      data={
                        register(
                          oppositeDirectionFieldName,
                        )
                      }
                      errorMessage={
                        errors?.tripElements?.[index]?.oppositeDirection?.message || undefined
                      }
                    />
                  </div>
                  <hr />
                </div>
              )
            })
          }

          <div className="fw-bold mb-3">
            Razem:
            {' '}
            {
              watch('tripElements').reduce((sum, elem) => {
                const value = elem.oppositeDirection
                  ? allSections[elem.section]?.b_to_a
                  : allSections[elem.section]?.a_to_b
                return sum + (value || 0)
              }, 0)
            }
            {' '}
            punktów
          </div>

          <Button
            className="d-block mb-3"
            onClick={() => append(defaultTripElement)}
            variant="outline-primary"
          >
            Dodaj odcinek
          </Button>

          <Button
            className="me-2"
            type="submit"
            variant={trip ? 'primary' : 'success'}
          >
            {
              trip ? 'Edytuj wycieczkę' : 'Stwórz wycieczkę'
            }
          </Button>

          {
            trip && (
              <Modal.Component
                title="Usuń wycieczkę"
                message="Czy napewno chcesz usunąć tę wycieczkę"
                action={deleteTrip}
                variant="danger"
              />
            )
          }
        </form>

        <div className="col-6" style={{ height: '60vh' }}>
          <MapDefinition.Component
            lines={
              watch('tripElements').map((elem) => {
                if (allSections[elem.section]) {
                  const sectionData = allSections[elem.section]

                  return new MapDefinition.Elements.Line(
                    sectionData.name,
                    sectionData.pointAId,
                    sectionData.pointBId,
                  )
                }
                return undefined
              }).filter((e) => e) as MapDefinition.Elements.Line[]
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Modify
