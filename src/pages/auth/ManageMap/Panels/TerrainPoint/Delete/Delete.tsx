import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import { getPath, GlobalFunctions, PathNames } from '../../../../../../utils/defines'
import TerrainPoint from '../../../../../../models/TerrainPoint'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'

type Props = {}

const Delete: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()

  const { id } = useParams()
  const [terrainPoint, setTerrainPoint] = useState<(TerrainPoint | undefined)>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<(boolean)>(true)

  const deleteTerrainPoint = async () => {
    if (id) {
      const terrainPointService = apiService.mountainData.getTerrainPoint(token)
      try {
        await terrainPointService.deleteTerrainPoint(id)
        toastUtils.Toast.showToast(
          toastUtils.types.INFO,
          'Usunięto punkt',
        )
      } catch (err) {
        toastUtils.Toast.showToast(
          toastUtils.types.ERROR,
          'Istnieją odcinki powiązane z tym punktem. Usuń je, by usunąć ten odcinek',
        )
      }
      await GlobalFunctions.wait(500)
      navigate(getPath(PathNames.MOUNTAIN_GROUP))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const terrainPointService = apiService.mountainData.getTerrainPoint(token)
      if (id) {
        setTerrainPoint(
          await terrainPointService.getTerrainPoint(id),
        )
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

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
      <h2 className="mb-4"> Usuń punkt </h2>
      {
        terrainPoint
          ? (
            <div>
              Czy na pewno chcesz usunąć ten punkt
              <span className="fw-bold">
                {' '}
                {terrainPoint.name}
              </span>
              ?
            </div>
          )
          : (
            <span>
              Ten punkt został już usunięty
            </span>
          )
      }

      <div className="mt-3">
        <Button
          className="me-2"
          // TODO: should use global paths
          href={getPath(PathNames.MOUNTAIN_GROUP)}
          variant="primary"
        >
          Powrót
        </Button>

        {
          terrainPoint
          && (
            <Button
              type="submit"
              variant="danger"
              onClick={deleteTerrainPoint}
            >
              Usuń
            </Button>
          )
        }
      </div>
    </div>
  )
}

export default Delete