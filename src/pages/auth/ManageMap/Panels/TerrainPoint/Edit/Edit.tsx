import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
// TODO: Import path should use '@/.'
import { useParams } from 'react-router-dom'
import * as Input from '../../../../../../components/UI/Input'
import TextArea from '../../../../../../components/UI/TextArea'
import { Errors } from '../../../../../../utils/defines'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import TerrainPoint from '@/models/TerrainPoint'
import MapDefinition from '../../../../../../components/Map'

type Inputs = {
  terrainPointId: string,
  name: string,
  description: string,
  sea_level_height: number,
  latitude: string,
  longitude: string
}

interface Props {}

const Edit: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>()
  const [terrainPoint, setTerrainPoint] = useState<(TerrainPoint | undefined)>()
  const [loading, setLoading] = useState<boolean>(true)
  const { id } = useParams()

  // @ts-ignore
  const [mapPoint, setMapPoint] = useState<MapDefinition.Elements.Point>(
    new MapDefinition.Elements.Point(
      '',
      '0',
      '0',
    ),
  )

  useEffect(() => {
    const fetchData = async () => {
      const terrainPointService = apiService.mountainData.getTerrainPoint(token)
      if (id) {
        try {
          setTerrainPoint(
            await terrainPointService.getTerrainPoint(id),
          )
        } catch (err) {
          setTerrainPoint(undefined)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    setMapPoint(
      new MapDefinition.Elements.Point(
        terrainPoint?.name || '',
        terrainPoint?.latitude || '0',
        terrainPoint?.longitude || '0',
      ),
    )
  }, [terrainPoint])

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const terrainPointService = apiService.mountainData.getTerrainPoint(token)
    const { terrainPointId, ...formData } = data
    await terrainPointService.editTerrainPoint(terrainPointId, formData)
    toastUtils.Toast.showToast(
      toastUtils.types.INFO,
      'Edycja punktu przebiegło pomyślnie',
    )
  }

  const ErrorMessageMap = new Map([
    [Errors.REQUIRED, {
      value: true,
      message: 'To pole jest wymagane',
    }],
  ])

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
      <h2 className="mb-4"> Edytuj Punkt </h2>

      {
        terrainPoint
          ? (
            <div className="row">
              <form
                className="col-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="hidden"
                  defaultValue={id}
                  {...(register('terrainPointId'))}
                />

                <div className="mb-3">
                  <Input.Component
                    label="Nazwa punktu"
                    type={Input.Type.TEXT}
                    default={terrainPoint.name}
                    data={register('name', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                    errorMessage={errors?.name?.message || undefined}
                    onChange={(e) => {
                      setMapPoint(
                        new MapDefinition.Elements.Point(
                          e.target.value,
                          mapPoint.latitude,
                          mapPoint.longitude,
                        ),
                      )
                    }}
                  />
                </div>

                <div className="mb-3">
                  <TextArea.Component
                    label="Opis"
                    height={150}
                    default={terrainPoint.description}
                    data={register('description', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                    errorMessage={errors?.description?.message || undefined}
                  />
                </div>

                <div className="mb-3">
                  <Input.Component
                    label="Wysokość nad poziomem morza"
                    type={Input.Type.NUMBER}
                    default={terrainPoint.sea_level_height}
                    data={register('sea_level_height', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                    errorMessage={errors?.sea_level_height?.message || undefined}
                  />
                </div>

                <div className="mb-3">
                  <Input.Component
                    label="Szerokość geograficzna"
                    type={Input.Type.TEXT}
                    default={terrainPoint.latitude}
                    data={register('latitude', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                    errorMessage={errors?.latitude?.message || undefined}
                    onChange={(e) => {
                      setMapPoint(
                        new MapDefinition.Elements.Point(
                          mapPoint.name,
                          e.target.value,
                          mapPoint.longitude,
                        ),
                      )
                    }}
                  />
                </div>

                <div className="mb-3">
                  <Input.Component
                    label="Długość geograficzna"
                    type={Input.Type.TEXT}
                    default={terrainPoint.longitude}
                    data={register('longitude', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                    errorMessage={errors?.longitude?.message || undefined}
                    onChange={(e) => {
                      setMapPoint(
                        new MapDefinition.Elements.Point(
                          mapPoint.name,
                          mapPoint.latitude,
                          e.target.value,
                        ),
                      )
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  href="/terrain-points/add"
                  className="me-3"
                  variant="primary"
                >
                  Powrót
                </Button>

                <Button
                  type="submit"
                  variant="success"
                >
                  Zapisz zmiany
                </Button>
              </form>

              <div className="col-6">
                <MapDefinition.Component
                  points={[mapPoint]}
                />
              </div>
            </div>
          ) : (
            <p>
              Nie znaleziono podanego punktu
            </p>
          )
      }
    </div>
  )
}

export default Edit