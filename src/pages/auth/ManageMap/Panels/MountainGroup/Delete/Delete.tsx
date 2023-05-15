import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import MountainGroup from '../../../../../../models/MountainGroup'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import { getPath, GlobalFunctions, PathNames } from '../../../../../../utils/defines'

type Props = {}

const Delete: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()

  const { id } = useParams()
  const [mountainGroup, setMountainGroup] = useState<(MountainGroup | undefined)>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<(boolean)>(true)

  const deleteMountainGroup = async () => {
    if (id) {
      const mountainGroupService = apiService.mountainData.getMountainGroup(token)
      await mountainGroupService.deleteMountainGroup(id)
      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięto grupę górską',
      )
      await GlobalFunctions.wait(500)
      navigate(PathNames.MOUNTAIN_GROUP)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const mountainGroupService = apiService.mountainData.getMountainGroup(token)
      if (id) {
        setMountainGroup(
          await mountainGroupService.getOneMountainGroup(id),
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
      <h2 className="mb-4"> Usuń grupę górską </h2>
      {
        mountainGroup
          ? (
            <div>
              Czy na pewno chcesz usunąć grupę górską
              <span className="fw-bold">
                {' '}
                {mountainGroup.name}
              </span>
              ?
            </div>
          )
          : (
            <span>
              Ta grupa górska została już usunięta
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
          mountainGroup
          && (
            <Button
              type="submit"
              variant="danger"
              onClick={deleteMountainGroup}
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
