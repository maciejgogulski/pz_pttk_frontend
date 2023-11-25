import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDependencies } from '../../../../../../context/dependencies'
import { useAuth } from '../../../../../../context/auth'
import * as Loading from '../../../../../../components/UI/Loading'
import TerrainPoint from '@/models/TerrainPoint'
import { getPath, PathNames } from '../../../../../../utils/defines'
import * as Modal from '../../../../../../components/UI/Modal'

type Props = {}

const List: React.FC<Props> = () => {
  const { getApiService, getToastUtils } = useDependencies()
  const apiService = getApiService()
  const { token } = useAuth()
  const [terrainPoints, setTerrainPoints] = useState<(TerrainPoint[])>([])
  const [loading, setLoading] = useState<(boolean)>(true)
  const toastUtils = getToastUtils()
  const [terrainPointService] = useState(apiService.mountainData.getTerrainPoint(token))
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      setTerrainPoints(
        await terrainPointService.getTerrainPoints(),
      )
      setLoading(false)
    }
    fetchData()
  }, [terrainPointService])

  const deleteTerrainPoint = async (id : number) => {
    try {
      await terrainPointService.deleteTerrainPoint(id.toString())
      setTerrainPoints(
        await terrainPointService.getTerrainPoints(),
      )
      toastUtils.Toast.showToast(
        toastUtils.types.INFO,
        'Usunięcie punktu terenowego przebiegło pomyślnie',
      )
    } catch (err) {
      toastUtils.Toast.showToast(
        toastUtils.types.ERROR,
        'Wystąpił nieoczekiwany błąd',
      )
    }
  }

  if (loading) {
    return (
      <Loading.Component />
    )
  }

  const filteredTerrainPoints = terrainPoints.filter(
    (point) => (point.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div>
      <div
        className="text-end"
      >
        <Button
          variant="success"
          href="/terrain-points/add"
          className="mb-3"
        >
          Dodaj punkt
        </Button>
      </div>

      <Form.Group controlId="searchForm" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Szukaj punktu po nazwie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      <h2 className="mb-4"> Punkty terenowe: </h2>

      <table
        className="table"
      >
        <thead>
          <th>Nazwa</th>
          <th>Szerokość geograficzna</th>
          <th>Długość geograficzna</th>
          <th>Wysokość (m n.p.m.)</th>
        </thead>
        <tbody>
          {filteredTerrainPoints.map((terrainPoint) => (
            <tr key={terrainPoint.id}>
              <td>{terrainPoint.name}</td>
              <td>{terrainPoint.latitude}</td>
              <td>{terrainPoint.longitude}</td>
              <td>{terrainPoint.sea_level_height}</td>
              <th className="text-center">
                <Button
                  variant="primary"
                  href={getPath(PathNames.TERRAIN_POINT_EDIT, {
                    id: terrainPoint.id,
                  })}
                >
                  Edytuj
                </Button>
              </th>
              <th className="text-center">
                <Modal.Component
                  title="Usuń"
                  message="Czy napewno chcesz usunąć punkt terenowy?"
                  action={() => deleteTerrainPoint(terrainPoint.id)}
                  variant="danger"
                />
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default List
