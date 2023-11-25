import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import * as Input from '../../../../../../components/UI/Input'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import MountainGroup from '../../../../../../models/MountainGroup'
import { PathNames, getPath } from '../../../../../../utils/defines'
import * as Loading from '../../../../../../components/UI/Loading'
import * as Modal from '../../../../../../components/UI/Modal'

type Inputs = {
  name: string
}

type Props = {}

const Form: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const toastUtils = getToastUtils()
  const [loading, setLoading] = useState<boolean>(true)
  const [mountainGroup, setMountainGroup] = useState<(MountainGroup | undefined)>()
  const navigate = useNavigate()
  const { id } = useParams()
  const [mountainGroupService] = useState(apiService.mountainData.getMountainGroup(token))

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>({
    mode: 'all',
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (id) {
        const result = await mountainGroupService.editMountainGroup(id, data)
        toastUtils.Toast.showToast(
          toastUtils.types.INFO,
          'Edycja grupy górskiej przebiegło pomyślnie',
        )
        navigate(getPath(PathNames.MANAGE_MAP, {
          id: result.id,
        }))
      } else {
        const result = await mountainGroupService.addMountainGroup(data)
        toastUtils.Toast.showToast(
          toastUtils.types.SUCCESS,
          'Dodanie grupy górskiej przebiegło pomyślnie',
        )
        navigate(getPath(PathNames.MANAGE_MAP, {
          id: result.id,
        }))
      }
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieocezekiwany błąd',
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setMountainGroup(
          await mountainGroupService.getOneMountainGroup(id),
        )
      }
      setLoading(false)
    }
    fetchData()
  }, [id, mountainGroupService])

  const deleteMountainGroup = async () => {
    try {
      await mountainGroupService.deleteMountainGroup(id || '')

      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie grupy górskiej przebiegło pomyślnie',
      )

      navigate(getPath(PathNames.MANAGE_MAP))
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
      <h2 className="mb-4"> Dodaj grupę górską </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Input.Component
            label="Nazwa grupy górskiej"
            type={Input.Type.TEXT}
            register={register}
            name="name"
            errorMessage={errors?.name?.message || undefined}
            default={mountainGroup ? mountainGroup.name : undefined}
            validation={['required', 'min:3']}
          />
        </div>

        <Button
          className="me-3"
          href={getPath(PathNames.MOUNTAIN_GROUP)}
          variant="secondary"
        >
          Powrót
        </Button>

        {
          mountainGroup ? (
            <>
              <Button
                type="submit"
                variant="primary"
                className="me-3"
              >
                Edytuj grupę górską
              </Button>

              <Modal.Component
                title="Usuń grupę górską"
                message="Czy napewno chcesz usunąć grupę górską?"
                action={deleteMountainGroup}
                variant="danger"
              />
            </>
          ) : (
            <Button
              type="submit"
              variant="success"
            >
              Zapisz grupę górską
            </Button>
          )
        }
      </form>
    </div>
  )
}

export default Form
