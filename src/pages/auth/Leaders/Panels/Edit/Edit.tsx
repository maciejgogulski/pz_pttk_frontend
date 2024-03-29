import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'
import MountainGroup from '@/models/MountainGroup'
import User from '@/models/User'
import { useDependencies } from '../../../../../context/dependencies/Dependencies'
import { useAuth } from '../../../../../context/auth/Auth'
import * as Loading from '../../../../../components/UI/Loading'
import {
  getPath, PathNames,
} from '../../../../../utils/defines'
import * as Row from './Row'
import { useTheme } from '../../../../../context/theme'

const Edit: React.FC = () => {
  const { getApiService } = useDependencies()
  const { token } = useAuth()
  const apiService = getApiService()
  const { id } = useParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [mountainGroups, setMountainGroups] = useState<MountainGroup[]>([])
  const [user, setUser] = useState<User | undefined>()
  const [mountainGroupService] = useState(apiService.mountainData.getMountainGroup(token))
  const [usersService] = useState(apiService.getUser(token))
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setMountainGroups(
          await mountainGroupService.getMountainGroups(),
        )
        setUser(
          await usersService.getUserWithRoles(id || ''),
        )
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
    fetchData()
  }, [mountainGroupService, usersService])

  if (loading) {
    return <Loading.Component />
  }
  return (
    <div>
      <h2 className="mb-4 w-50">
        Edytuj uprawnienia:
        {user && (` ${user.firstName} ${user.lastName}`)}
      </h2>

      <Table
        bordered
        responsive
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.color,
        }}
      >
        {
          mountainGroups.map((mountainGroup) => {
            const role = user?.mountainGroupRoles?.find((e) => mountainGroup.id === e.id)

            return (
              <Row.Component
                key={mountainGroup.id}
                userId={user?.id || 0}
                mountainGroupId={mountainGroup.id}
                mountainGroupName={mountainGroup.name}
                assignmentDate={role ? role.assignmentDate : undefined}
              />
            )
          })
        }
      </Table>

      <Button
        className="mt-2"
        type="submit"
        variant="secondary"
        href={getPath(PathNames.LEADERS)}
      >
        Powrót
      </Button>
    </div>
  )
}

export default Edit
