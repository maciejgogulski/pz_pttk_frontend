import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { Errors, getPath, PathNames } from '../../../utils/defines'
import { useDependencies } from '../../../context/dependencies'
import { useAuth } from '../../../context/auth'
import * as Input from '../../../components/UI/Input'
import Styles from './Register.module.scss'

type Inputs = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  name: string,
  legitimationNumber: string,
}

type Props = {}

const Register: React.FC<Props> = () => {
  const { getApiService } = useDependencies()
  const apiService = getApiService()
  const { setToken, setLoggedIn } = useAuth()
  const navigate = useNavigate()

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const authService = apiService.getAuth()

    const transformedData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      name: data.name,
      legitimation_number: data.legitimationNumber,
    }

    const token = await authService.register(transformedData)
    setToken(token)
    setLoggedIn(true)
    navigate(getPath(PathNames.MOUNTAIN_GROUP))
  }

  const ErrorMessageMap = new Map([
    [Errors.REQUIRED, {
      value: true,
      message: 'To pole jest wymagane',
    }],
  ])

  return (
    <div className="me-3">
      <h2 className="my-4"> Zarejestruj się </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4"
      >
        <div className="mb-3">
          <Input.Component
            label="Imię"
            type={Input.Type.TEXT}
            data={register('firstName', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.firstName?.message || undefined}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Nazwisko"
            type={Input.Type.TEXT}
            data={register('lastName', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.lastName?.message || undefined}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Adres email"
            type={Input.Type.EMAIL}
            data={register('email', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.email?.message || undefined}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Hasło"
            type={Input.Type.PASSWORD}
            data={register('password', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.password?.message || undefined}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Nazwa użytkownika"
            type={Input.Type.TEXT}
            data={register('name', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.name?.message || undefined}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Numer legitymacji"
            type={Input.Type.TEXT}
            data={register('legitimationNumber', { required: ErrorMessageMap.get(Errors.REQUIRED) })}
            errorMessage={errors?.legitimationNumber?.message || undefined}
          />
        </div>

        <Button
          type="submit"
          variant="success"
        >
          Zarejestruj się
        </Button>
      </form>

      <div
        className="text-center"
      >
        Masz już konto?
        <div>
          <NavLink
            to={getPath(PathNames.LOGIN)}
            aria-current="true"
            className={Styles.link}
          >
            Zaloguj się
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Register