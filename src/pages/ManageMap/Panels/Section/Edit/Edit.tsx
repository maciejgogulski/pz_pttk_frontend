import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
// TODO: Import path should use '@/.'
import { Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import * as Input from '../../../../../components/UI/Input'
import TextArea from '../../../../../components/UI/TextArea'
import Select from '../../../../../components/UI/Select'
import TerrainPointService from '../../../../../services/TerrainPointService'
import { Errors } from '../../../../../utils/defines'
import SectionService from '../../../../../services/SectionService'
import MountainRangeService from '../../../../../services/MountainRangeService'
import Section from '@/models/Section'

type Inputs = {
  section_id: string,
  name: string,
  description: string,
  mountainRange: number,
  badgePoints_AtoB: number,
  badgePoints_BtoA: number,
  terrainPoint_A: number,
  terrainPoint_B: number,
}

interface Props {}

const Edit: React.FC<Props> = () => {
  const { id } = useParams()
  const [allPoints, setAllPoints] = useState<Record<number, string>>({})
  const [section, setSection] = useState<(Section | undefined)>()
  const [allMountainRanges, setAllMountainRanges] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState<boolean>(true)

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const sectionService = new SectionService()

    const transformedData = {
      name: data.name,
      description: data.description,
      mountain_range_id: data.mountainRange,
      badge_points_a_to_b: data.badgePoints_AtoB,
      badge_points_b_to_a: data.badgePoints_BtoA,
      terrain_point_a_id: data.terrainPoint_A,
      terrain_point_b_id: data.terrainPoint_B,
    }

    await sectionService.createSection(transformedData)

    toast.success('Edycja odcinka przebiegła pomyślnie', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const sectionService = new SectionService()
        setSection(
          await sectionService.getOneSection(id),
        )
      }

      const terrainPointsService = new TerrainPointService()
      const terrainPoints = await terrainPointsService.getTerrainPoints()
      const allPointsTemp: Record<number, string> = {}

      terrainPoints.forEach((terrainPoint) => {
        allPointsTemp[terrainPoint.id] = terrainPoint.name
      })

      setAllPoints(
        allPointsTemp,
      )

      const mountainRangeService = new MountainRangeService()
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
  }, [])

  const ErrorMessageMap = new Map([
    [Errors.REQUIRED, {
      value: true,
      message: 'To pole jest wymagane',
    }],
  ])

  if (loading) {
    return (
      <div className="w-50 mt-3 text-center">
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
    <div className="w-50">
      <h2 className="mb-4"> Edytuj Odcinek </h2>

      {
        section
          ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <Input.Component
                  label="Nazwa odcinka"
                  type={Input.Type.TEXT}
                  default={section.name}
                  data={register('name', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                  errorMessage={errors?.name?.message || undefined}
                />
              </div>

              <div className="mb-3">
                <TextArea.Component
                  label="Opis odcinka"
                  height={150}
                  default={section.description}
                  data={register('description')}
                  errorMessage={errors?.description?.message || undefined}
                />
              </div>

              <div className="mb-3">
                <Select.Component
                  label="Wybierz pasmo górskie"
                  options={allMountainRanges}
                  default={section.mountain_range_id}
                  data={register('mountainRange', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                  errorMessage={errors?.mountainRange?.message || undefined}
                />
              </div>

              <div className="mb-3">
                <Input.Component
                  label="Punkty do uzyskania (od A do B)"
                  type={Input.Type.NUMBER}
                  default={section.badge_points_a_to_b}
                  data={register('badgePoints_AtoB')}
                  errorMessage={errors?.badgePoints_AtoB?.message || undefined}
                />
              </div>

              <div className="mb-3">
                <Input.Component
                  label="Punkty do uzyskania (od B do A)"
                  type={Input.Type.NUMBER}
                  default={section.badge_points_b_to_a}
                  data={register('badgePoints_BtoA')}
                  errorMessage={errors?.badgePoints_BtoA?.message || undefined}
                />
              </div>

              <div className="mb-3">
                <Select.Component
                  label="Wybierz punkt A"
                  options={allPoints}
                  default={section.terrain_point_a_id}
                  data={register('terrainPoint_A', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                  errorMessage={errors?.terrainPoint_A?.message || undefined}
                />
              </div>

              <div className="mb-3">
                <Select.Component
                  label="Wybierz punkt B"
                  options={allPoints}
                  default={section.terrain_point_b_id}
                  data={register('terrainPoint_B', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
                  errorMessage={errors?.terrainPoint_B?.message || undefined}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                href={`/mountain-range/${section.mountain_range_id}`}
                className="me-3"
              >
                Powrót
              </Button>

              <Button
                type="submit"
                variant="success"
              >
                Zapisz odcinek
              </Button>
            </form>
          )
          : (
            <>
              <p>
                Nie znaleziono podanego odcinka
              </p>

              <Button
                type="submit"
                variant="primary"
                href="/mountain-group/list"
              >
                Powrót
              </Button>
            </>
          )
      }
    </div>
  )
}

export default Edit