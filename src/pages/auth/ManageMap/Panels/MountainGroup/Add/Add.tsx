import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import * as Input from '../../../../../../components/UI/Input'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import MountainGroup from '../../../../../../models/MountainGroup'
import { PathNames, getPath, Errors } from '../../../../../../utils/defines'

type Inputs = {
  name: string
}

type Props = {}

const Add: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()

  const [mountainGroup, setMountainGroup] = useState<(MountainGroup | undefined)>()
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const mountainGroupService = apiService.mountainData.getMountainGroup(token)
    await mountainGroupService.addMountainGroup(data)
    toastUtils.Toast.showToast(
      toastUtils.types.SUCCESS,
      'Dodanie grupy górskiej przebiegło pomyślnie',
    )
    navigate(getPath(PathNames.MOUNTAIN_GROUP))
  }

  useEffect(() => {
    const fetchData = async () => {
      const mountainGroupService = apiService.mountainData.getMountainGroup(token)
      if (id) {
        setMountainGroup(
          await mountainGroupService.getOneMountainGroup(id),
        )
      }
    }
    fetchData()
  }, [id])

  const ErrorMessageMap = new Map([
    [Errors.REQUIRED, {
      value: true,
      message: 'To pole jest wymagane',
    }],
  ])

  return (
    <div className="w-50">
      <h2 className="mb-4"> Dodaj grupę górską </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Input.Component
            label="Nazwa odcinka"
            type={Input.Type.TEXT}
            default={mountainGroup ? mountainGroup.name : undefined}
            data={register('name', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.name?.message || undefined}
          />
        </div>

        <Button
          className="me-2"
          href={getPath(PathNames.MOUNTAIN_GROUP)}
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
    </div>
  )
}

export default Add