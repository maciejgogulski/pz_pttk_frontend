import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
// TODO: Import path should use '@/.'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import * as Input from '../../../../../../components/UI/Input'
import TextArea from '../../../../../../components/UI/TextArea'
import Select from '../../../../../../components/UI/Select'
import { getPath, PathNames } from '../../../../../../utils/defines'
import { useDependencies } from '../../../../../../context/dependencies'
import * as MapDefinition from '../../../../../../components/Map'
import { useAuth } from '../../../../../../context/auth'
import Section from '@/models/Section'
import * as Loading from '../../../../../../components/UI/Loading'
import * as Modal from '../../../../../../components/UI/Modal'

type Inputs = {
  name: string,
  description: string,
  mountainRange: number,
  badgePoints_AtoB: number,
  badgePoints_BtoA: number,
  terrainPoint_A: number,
  terrainPoint_B: number,
}

interface Props {}

const Form: React.FC<Props> = () => {
  const { token } = useAuth()
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const toastUtils = getToastUtils()
  const { id } = useParams()
  const [section, setSection] = useState<(Section | undefined)>()
  const [loading, setLoading] = useState<boolean>(true)

  const navigate = useNavigate()
  const [allPoints, setAllPoints] = useState<Record<number, string>>({})
  const [allMountainRanges, setAllMountainRanges] = useState<Record<number, string>>({})
  // @ts-ignore
  const [mapLine, setMapLine] = useState<MapDefinition.Elements.Line>(
    new MapDefinition.Elements.Line(
      '',
      1,
      1,
    ),
  )

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const sectionService = apiService.mountainData.getSection(token)
        setSection(
          await sectionService.getOneSection(id),
        )
      }

      const terrainPointsService = apiService.mountainData.getTerrainPoint(token)
      const terrainPoints = await terrainPointsService.getTerrainPoints()
      const allPointsTemp: Record<number, string> = {}

      terrainPoints.forEach((terrainPoint) => {
        allPointsTemp[terrainPoint.id] = terrainPoint.name
      })

      setAllPoints(
        allPointsTemp,
      )

      const mountainRangeService = apiService.mountainData.getMountainRange(token)
      const mountainRanges = await mountainRangeService.getMountainRanges()
      const allMountainRangesTemp: Record<number, string> = {}

      mountainRanges.forEach((mountainRange) => {
        allMountainRangesTemp[mountainRange.id] = mountainRange.name
      })

      setAllMountainRanges(
        allMountainRangesTemp,
      )
      setLoading(false)
    }
    fetchData()
  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      const terrainPointsService = apiService.mountainData.getTerrainPoint(token)
      const terrainPoints = await terrainPointsService.getTerrainPoints()
      const allPointsTemp: Record<number, string> = {}

      terrainPoints.forEach((terrainPoint) => {
        allPointsTemp[terrainPoint.id] = terrainPoint.name
      })

      setAllPoints(
        allPointsTemp,
      )

      const mountainRangeService = apiService.mountainData.getMountainRange(token)
      const mountainRanges = await mountainRangeService.getMountainRanges()
      const allMountainRangesTemp: Record<number, string> = {}

      mountainRanges.forEach((mountainRange) => {
        allMountainRangesTemp[mountainRange.id] = mountainRange.name
      })

      setAllMountainRanges(
        allMountainRangesTemp,
      )
    }
    fetchData()
  }, [])

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const sectionService = apiService.mountainData.getSection(token)

    const transformedData = {
      name: data.name,
      description: data.description,
      mountain_range_id: data.mountainRange,
      badge_points_a_to_b: data.badgePoints_AtoB,
      badge_points_b_to_a: data.badgePoints_BtoA,
      terrain_point_a_id: data.terrainPoint_A,
      terrain_point_b_id: data.terrainPoint_B,
    }

    try {
      if (id) {
        await sectionService.createSection(transformedData)
        toastUtils.Toast.showToast(
          toastUtils.types.INFO,
          'Edycja odcinka przebiegła pomyślnie',
        )
      } else {
        const sectionResult = await sectionService.createSection(transformedData)
        toastUtils.Toast.showToast(
          toastUtils.types.SUCCESS,
          'Dodanie nowego odcinka przebiegło pomyślnie',
        )

        navigate(getPath(PathNames.SECTION_EDIT, {
          id: sectionResult.id,
        }))
      }
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  const deleteSection = async () => {
    try {
      const sectionService = apiService.mountainData.getSection(token)
      await sectionService.deleteSection(id || '')

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie odcinka przebiegło pomyślnie',
      )

      navigate(getPath(PathNames.MOUNTAIN_GROUP))
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

  return (
    <div>
      <h2 className="mb-4">
        {section ? 'Edytuj odcinek' : 'Dodaj Odcinek'}
      </h2>

      <div className="row">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-6"
        >
          <div className="mb-3">
            <Input.Component
              label="Nazwa odcinka"
              type={Input.Type.TEXT}
              register={register}
              name="name"
              errorMessage={errors?.name?.message || undefined}
              onChange={(e) => {
                setMapLine(
                  new MapDefinition.Elements.Line(
                    e.target.value,
                    mapLine.pointAId,
                    mapLine.pointBId,
                  ),
                )
              }}
              default={section?.name}
            />
          </div>

          <div className="mb-3">
            <TextArea.Component
              label="Opis odcinka"
              height={150}
              register={register}
              name="description"
              errorMessage={errors?.description?.message || undefined}
              default={section?.description}
            />
          </div>

          <div className="mb-3">
            <Select.Component
              label="Wybierz pasmo górskie"
              options={allMountainRanges}
              register={register}
              name="mountainRange"
              errorMessage={errors?.mountainRange?.message || undefined}
              default={section?.mountain_range_id}
            />
          </div>

          <div className="mb-3">
            <Input.Component
              label="Punkty do uzyskania (od A do B)"
              type={Input.Type.NUMBER}
              register={register}
              name="badgePoints_AtoB"
              errorMessage={errors?.badgePoints_AtoB?.message || undefined}
              default={section?.badge_points_a_to_b}
            />
          </div>

          <div className="mb-3">
            <Input.Component
              label="Punkty do uzyskania (od B do A)"
              type={Input.Type.NUMBER}
              register={register}
              name="badgePoints_BtoA"
              errorMessage={errors?.badgePoints_BtoA?.message || undefined}
              default={section?.badge_points_b_to_a}
            />
          </div>

          <div className="mb-3">
            <Select.Component
              label="Wybierz punkt A"
              options={allPoints}
              register={register}
              name="terrainPoint_A"
              errorMessage={errors?.terrainPoint_A?.message || undefined}
              onChange={(e) => {
                setMapLine(
                  new MapDefinition.Elements.Line(
                    mapLine.name,
                    e.target.value,
                    mapLine.pointBId,
                  ),
                )
              }}
              default={section?.terrain_point_a_id || mapLine.pointAId}
            />
          </div>

          <div className="mb-3">
            <Select.Component
              label="Wybierz punkt B"
              options={allPoints}
              register={register}
              name="terrainPoint_B"
              errorMessage={errors?.terrainPoint_B?.message || undefined}
              onChange={(e) => {
                setMapLine(
                  new MapDefinition.Elements.Line(
                    mapLine.name,
                    mapLine.pointAId,
                    e.target.value,
                  ),
                )
              }}
              default={section?.terrain_point_b_id || mapLine.pointBId}
            />
          </div>

          {
            section ? (
              <>
                <Button
                  type="submit"
                  variant="primary"
                  className="me-3"
                >
                  Edytuj odcinek
                </Button>

                <Modal.Component
                  title="Usuń odcinek"
                  message="Czy napewno chcesz usunąć odcinek?"
                  action={deleteSection}
                  variant="danger"
                />
              </>
            ) : (
              <Button
                type="submit"
                variant="success"
              >
                Zapisz odcinek
              </Button>
            )
          }

        </form>

        <div className="col-6">
          <MapDefinition.Component
            lines={[
              (section) ? new MapDefinition.Elements.Line(
                section.name,
                section.terrain_point_a_id,
                section.terrain_point_b_id,
              ) : mapLine,
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default Form