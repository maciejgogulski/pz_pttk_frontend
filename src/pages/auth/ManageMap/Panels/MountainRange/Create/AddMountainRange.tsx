import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
// TODO: Import path should use '@/.'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import * as Input from '../../../../../../components/UI/Input'
import Select from '../../../../../../components/UI/Select'
import { Errors, getPath, PathNames } from '../../../../../../utils/defines'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'

type Inputs = {
  name: string,
  mountain_group_id: number,
}

interface Props {}

const AddMountainRange: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()

  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const mountainRangeService = apiService.mountainData.getMountainRange(token)
    await mountainRangeService.addMountainRange(data)
    toastUtils.Toast.showToast(
      toastUtils.types.SUCCESS,
      'Dodanie pasma górskiego przebiegło pomyślnie',
    )
    navigate(getPath(PathNames.MOUNTAIN_GROUP))
  }

  const ErrorMessageMap = new Map([
    [Errors.REQUIRED, {
      value: true,
      message: 'To pole jest wymagane',
    }],
  ])

  const [options, setOptions] = useState<Record<number, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      const mountainGroupService = apiService.mountainData.getMountainGroup(token)
      const mountainGroups = await mountainGroupService.getMountainGroups()

      const tempOptions: Record<number, string> = {}

      mountainGroups.forEach((mountain) => {
        tempOptions[mountain.id] = mountain.name
      })

      setOptions(tempOptions)
    }
    fetchData()
  }, [])

  return (
    <div className="w-50">
      <h2 className="mb-4"> Dodaj Pasmo Górskie </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Input.Component
            label="Nazwa pasma"
            type={Input.Type.TEXT}
            data={register('name', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.name?.message || undefined}
          />
        </div>

        <div className="mb-3">
          <Select.Component
            label="Wybierz grupę górską"
            options={options}
            default={id}
            data={register('mountain_group_id', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.mountain_group_id?.message || undefined}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="me-3"
          href={getPath(PathNames.MOUNTAIN_RANGE)}
        >
          Powrót
        </Button>

        <Button
          type="submit"
          variant="success"
        >
          Zapisz pasmo
        </Button>
      </form>
    </div>
  )
}

export default AddMountainRange
