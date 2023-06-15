import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { getPath, PathNames } from '../../../utils/defines'
import { useDependencies } from '../../../context/dependencies'
import { useAuth } from '../../../context/auth'
import * as Input from '../../../components/UI/Input'
import Styles from './Login.module.scss'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import Actions from '../../../app/actions'

type Inputs = {
  email: string,
  password: string,
}

type Props = {}

const Login: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const toastUtils = getToastUtils()
  const apiService = getApiService()
  // eslint-disable-next-line no-unused-vars
  const { setToken, setLoggedIn, setRoles } = useAuth()
  const navigate = useNavigate()

  const selector = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  dispatch(Actions.auth.SET_TOKEN('login'))
  console.log(selector)

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const authService = apiService.getAuth()
      const authData = await authService.login(data)
      setToken(authData.getToken())
      setLoggedIn(true)
      setRoles(authData.getUserRoles())
      navigate(getPath(PathNames.TRIPS))
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Niepoprawne dane logowania',
      )
    }
  }

  return (
    <div className="me-3">
      <h2 className="my-4"> Zaloguj się </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4"
      >
        <div className="mb-3">
          <Input.Component
            label="Adres email"
            type={Input.Type.EMAIL}
            register={register}
            name="email"
            errorMessage={errors?.email?.message || undefined}
          />
        </div>

        <div className="mb-3">
          <Input.Component
            label="Hasło"
            type={Input.Type.PASSWORD}
            register={register}
            name="password"
            errorMessage={errors?.password?.message || undefined}
          />
        </div>

        <Button
          type="submit"
          variant="success"
        >
          Zaloguj się
        </Button>
      </form>

      <div
        className="text-center"
      >
        Nie masz konta?
        <div>
          <NavLink
            to={getPath(PathNames.REGISTER)}
            aria-current="true"
            className={Styles.link}
          >
            Zarejestruj się
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Login
