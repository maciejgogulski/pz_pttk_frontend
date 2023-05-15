import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import MountainRange from '../../../../../../models/MountainRange'
import { useAuth } from '../../../../../../context/auth'
import { useDependencies } from '../../../../../../context/dependencies'
import { GlobalFunctions, PathNames, getPath } from '../../../../../../utils/defines'

type Props = {}

const DeleteMountainRange: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()

  const { id } = useParams()
  const [mountainRange, setMountainRange] = useState<(MountainRange | undefined)>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<(boolean)>(true)

  const deleteMountainRange = async () => {
    if (id) {
      const mountainRangeService = apiService.mountainData.getMountainRange(token)
      try {
        await mountainRangeService.deleteMountainRange(id)
        toastUtils.Toast.showToast(
          toastUtils.types.INFO,
          'Usunięto pasmo górskie',
        )
      } catch (err) {
        toastUtils.Toast.showToast(
          toastUtils.types.ERROR,
          'Istnieją odcinki powiązane z tym pasmem górskim. Usuń je, by usunąć to pasmo górskie',
        )
      }
      await GlobalFunctions.wait(500)
      navigate(getPath(PathNames.MOUNTAIN_GROUP))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const mountainRangeService = apiService.mountainData.getMountainRange(token)
      if (id) {
        setMountainRange(
          await mountainRangeService.getOneMountainRange(id),
        )
      }
      setLoading(false)
    }
    fetchData()
  }, [])

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
      <h2 className="mb-4"> Usuń pasmo górskie </h2>
      {
        mountainRange
          ? (
            <div>
              Czy na pewno chcesz usunąć pasmo górskie
              <span className="fw-bold">
                {' '}
                {mountainRange.name}
              </span>
              ?
            </div>
          )
          : (
            <span>
              To pasmo górskie zostało już usunięte
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
          mountainRange
          && (
            <Button
              type="submit"
              variant="danger"
              onClick={deleteMountainRange}
            >
              Usuń
            </Button>
          )
        }
      </div>
    </div>
  )
}

export default DeleteMountainRange
