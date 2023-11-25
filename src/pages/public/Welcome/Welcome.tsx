import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Stack } from 'react-bootstrap'
import { PathNames, getPath } from '../../../utils/defines'

type Props = {}

const Welcome: React.FC<Props> = () => {
  const navigate = useNavigate()

  return (
    <Stack direction="vertical" gap={3}>
      <div style={{ height: '30vh' }} />
      <h2 className="text-center pb-3">Górska Odznaka Turystyczna</h2>
      <Button
        type="submit"
        variant="success"
        onClick={() => navigate(getPath(PathNames.LOGIN))}
      >
        Zaloguj się
      </Button>

      <Button
        type="submit"
        variant="success"
        onClick={() => navigate(getPath(PathNames.REGISTER))}
      >
        Zarejestruj się
      </Button>
    </Stack>
  )
}

export default Welcome
