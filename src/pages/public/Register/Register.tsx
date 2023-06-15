import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { getPath, PathNames } from '../../../utils/defines'
import { useDependencies } from '../../../context/dependencies'
import { useAuth } from '../../../context/auth'
import * as Input from '../../../components/UI/Input'
import Styles from './Register.module.scss'
import { useAppSelector } from '../../../app/hooks'

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

  const selector = useAppSelector((state) => state.auth)
  console.log(selector)

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>({
    mode: 'all',
  })

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
    navigate(getPath(PathNames.MANAGE_MAP))
  }

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
            register={register}
            name="firstName"
            errorMessage={errors?.firstName?.message || undefined}
            validation={['required', 'min:3']}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Nazwisko"
            type={Input.Type.TEXT}
            register={register}
            name="lastName"
            errorMessage={errors?.lastName?.message || undefined}
            validation={['required', 'min:3']}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Adres email"
            type={Input.Type.EMAIL}
            register={register}
            name="email"
            errorMessage={errors?.email?.message || undefined}
            validation={['required']}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Hasło"
            type={Input.Type.PASSWORD}
            register={register}
            name="password"
            errorMessage={errors?.password?.message || undefined}
            validation={['required', 'password']}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Nazwa użytkownika"
            type={Input.Type.TEXT}
            register={register}
            name="name"
            errorMessage={errors?.name?.message || undefined}
            validation={['required', 'min:3']}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Numer legitymacji"
            type={Input.Type.TEXT}
            register={register}
            name="legitimationNumber"
            errorMessage={errors?.legitimationNumber?.message || undefined}
            validation={['required', 'min:3']}
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
