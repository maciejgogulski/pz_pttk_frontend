import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
// TODO: Import path should use '@/.'
import { useNavigate, useParams } from 'react-router-dom'
import * as Input from '../../../../../../components/UI/Input'
import TextArea from '../../../../../../components/UI/TextArea'
import {
  getPath, PathNames,
} from '../../../../../../utils/defines'
import { useDependencies } from '../../../../../../context/dependencies'
import * as MapDefinition from '../../../../../../components/Map'
import * as Loading from '../../../../../../components/UI/Loading'
import * as Modal from '../../../../../../components/UI/Modal'
import { useAuth } from '../../../../../../context/auth'
import TerrainPoint from '@/models/TerrainPoint'

type Inputs = {
  name: string,
  description: string,
  sea_level_height: number,
  latitude: number,
  longitude: number
}

interface Props {}

const TerrainPointComponent: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const { token } = useAuth()
  const apiService = getApiService()
  const toastUtils = getToastUtils()
  const { id } = useParams()
  const [terrainPoint, setTerrainPoint] = useState<(TerrainPoint | undefined)>()
  const [loading, setLoading] = useState<boolean>(true)
  const [terrainPointService] = useState(apiService.mountainData.getTerrainPoint(token))

  const navigate = useNavigate()
  const {
    register, setValue, handleSubmit, formState: { errors },
  } = useForm<Inputs>({
    mode: 'all',
  })
  // @ts-ignore
  const [mapPoint, setMapPoint] = useState<MapDefinition.Elements.Point>(
    new MapDefinition.Elements.Point(
      '',
      '50.44',
      '18.91',
    ),
  )

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (id) {
        try {
          setTerrainPoint(
            await terrainPointService.getTerrainPoint(id),
          )
        } catch (err) {
          setTerrainPoint(undefined)
        }
      } else {
        setTerrainPoint(undefined)
      }
      setLoading(false)
    }
    fetchData()
  }, [id, terrainPointService])

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (id) {
        await terrainPointService.editTerrainPoint(id, data)

        toastUtils.Toast.showToast(
          toastUtils.types.INFO,
          'Edycja punktu przebiegła pomyślnie',
        )
        navigate(getPath(PathNames.TERRAIN_POINT_LIST))
      } else {
        await terrainPointService.createTerrainPoint(data)

        toastUtils.Toast.showToast(
          toastUtils.types.SUCCESS,
          'Dodanie nowego punktu przebiegło pomyślnie',
        )

        navigate(getPath(PathNames.TERRAIN_POINT_LIST))
      }
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  const deleteTerrainPoint = async () => {
    try {
      await terrainPointService.deleteTerrainPoint(id || '')

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie punktu przebiegło pomyślnie',
      )

      navigate(getPath(PathNames.TERRAIN_POINT_LIST))
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  if (loading) {
    return <Loading.Component />
  }

  const handleMarkerPositionChange = (position: [number, number] | null) => {
    if (position) {
      setValue('latitude', position[0])
      setValue('longitude', position[1])
    }
  }

  return (
    <div>
      <h2 className="mb-4">
        { terrainPoint ? 'Edytuj punkt' : 'Dodaj Punkt' }
      </h2>

      <div className="row">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-6"
        >
          <div className="mb-3">
            <Input.Component
              label="Nazwa punktu"
              type={Input.Type.TEXT}
              register={register}
              name="name"
              onChange={(e) => {
                setMapPoint(
                  new MapDefinition.Elements.Point(
                    e.target.value,
                    mapPoint.latitude,
                    mapPoint.longitude,
                  ),
                )
              }}
              errorMessage={errors?.name?.message || undefined}
              default={terrainPoint?.name}
              validation={['required', 'min:3']}
            />
          </div>

          <div className="mb-3">
            <TextArea.Component
              label="Opis"
              height={150}
              register={register}
              name="description"
              errorMessage={errors?.description?.message || undefined}
              default={terrainPoint?.description}
            />
          </div>

          <div className="mb-3">
            <Input.Component
              label="Wysokość nad poziomem morza"
              type={Input.Type.NUMBER}
              register={register}
              name="sea_level_height"
              errorMessage={errors?.sea_level_height?.message || undefined}
              default={terrainPoint?.sea_level_height}
            />
          </div>

          <div className="mb-3">
            <Input.Component
              label="Szerokość geograficzna"
              type={Input.Type.TEXT}
              register={register}
              name="latitude"
              errorMessage={errors?.latitude?.message || undefined}
              onChange={(e) => {
                setMapPoint(
                  new MapDefinition.Elements.Point(
                    mapPoint.name,
                    e.target.value || mapPoint.longitude,
                    mapPoint.longitude,
                  ),
                )
              }}
              default={terrainPoint?.latitude}
              validation={['required', 'pattern:^-?([1-8]?[0-9](\\.\\d+)?|90(\\.0+)?)$']}
            />
          </div>

          <div className="mb-3">
            <Input.Component
              label="Długość geograficzna"
              type={Input.Type.TEXT}
              register={register}
              name="longitude"
              errorMessage={errors?.longitude?.message || undefined}
              onChange={(e) => {
                setMapPoint(
                  new MapDefinition.Elements.Point(
                    mapPoint.name,
                    mapPoint.latitude,
                    e.target.value || mapPoint.longitude,
                  ),
                )
              }}
              default={terrainPoint?.longitude}
              validation={['required', 'pattern:^-?((1[0-7]|[1-9])?\\d(\\.\\d+)?|180(\\.0+)?)$']}
            />
          </div>

          {
            terrainPoint ? (
              <>
                <Button
                  type="submit"
                  variant="primary"
                  className="me-3"
                >
                  Edytuj punkt
                </Button>

                <Modal.Component
                  title="Usuń punkt"
                  message="Czy napewno chcesz usunąć punkt?"
                  action={deleteTerrainPoint}
                  variant="danger"
                />
              </>
            ) : (
              <Button
                type="submit"
                variant="success"
              >
                Zapisz punkt
              </Button>
            )
          }

        </form>

        <div
          className="col-6"
          style={{ height: '60vh' }}
        >
          <MapDefinition.Component
            points={(terrainPoint) ? [new MapDefinition.Elements.Point(
              terrainPoint.name,
              terrainPoint.latitude,
              terrainPoint.longitude,
            )] : [mapPoint]}
            center={(terrainPoint) ? new MapDefinition.Elements.Point(
              terrainPoint.name,
              terrainPoint.latitude,
              terrainPoint.longitude,
            ) : mapPoint}
            onMarkerPositionChange={handleMarkerPositionChange}
            zoom={(terrainPoint) ? 13 : 6}
          />
        </div>
      </div>
    </div>
  )
}

export default TerrainPointComponent
