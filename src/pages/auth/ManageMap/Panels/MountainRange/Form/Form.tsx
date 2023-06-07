import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
// TODO: Import path should use '@/.'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import * as Input from '../../../../../../components/UI/Input'
import Select from '../../../../../../components/UI/Select'
import { getPath, PathNames } from '../../../../../../utils/defines'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import MountainRange from '@/models/MountainRange'
import * as Loading from '../../../../../../components/UI/Loading'
import * as Modal from '../../../../../../components/UI/Modal'

type Inputs = {
  name: string,
  mountain_group_id: number,
}

interface Props {}

const Form: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()
  const [mountainRange, setMountainRange] = useState<(MountainRange | undefined)>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const { groupId, id } = useParams()
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

  const [options, setOptions] = useState<Record<number, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const mountainRangeService = apiService.mountainData.getMountainRange(token)
        setMountainRange(
          await mountainRangeService.getOneMountainRange(id),
        )
      } else {
        setMountainRange(
          undefined,
        )
      }

      const mountainGroupService = apiService.mountainData.getMountainGroup(token)
      const mountainGroups = await mountainGroupService.getMountainGroups()

      const tempOptions: Record<number, string> = {}

      mountainGroups.forEach((mountain) => {
        tempOptions[mountain.id] = mountain.name
      })

      setOptions(tempOptions)
      setLoading(false)
    }

    fetchData()
  }, [id])

  const deleteMountainRange = async () => {
    try {
      const mountainRangeService = apiService.mountainData.getMountainRange(token)
      await mountainRangeService.deleteMountainRange(id || '')

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie pasma górskiego przebiegło pomyślnie',
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
    <div className="w-50">
      <h2 className="mb-4">
        {
          mountainRange ? 'Edytuj pasmo górskie' : 'Dodaj pasmo górskie'
        }
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Input.Component
            label="Nazwa pasma"
            type={Input.Type.TEXT}
            register={register}
            name="name"
            errorMessage={errors?.name?.message || undefined}
            default={mountainRange?.name}
          />
        </div>

        <div className="mb-3">
          <Select.Component
            label="Wybierz grupę górską"
            options={options}
            register={register}
            name="mountain_group_id"
            errorMessage={errors?.mountain_group_id?.message || undefined}
            default={mountainRange?.mountain_group_id || groupId}
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="me-3"
          href={getPath(PathNames.MOUNTAIN_GROUP)}
        >
          Powrót
        </Button>

        {
          mountainRange ? (
            <>
              <Button
                type="submit"
                variant="primary"
                className="me-3"
              >
                Edytuj pasmo
              </Button>

              <Modal.Component
                title="Usuń pasmo górskie"
                message="Czy napewno chcesz usunąć pasmo górskie?"
                action={deleteMountainRange}
                variant="danger"
              />
            </>
          ) : (
            <Button
              type="submit"
              variant="success"
            >
              Zapisz pasmo
            </Button>
          )
        }

      </form>
    </div>
  )
}

export default Form