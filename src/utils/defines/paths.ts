/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

export enum PathNames {
  WELCOME = 'Strona startowa',
  LOGIN = 'Logowanie',
  REGISTER = 'Rejestracja',

  MANAGE_MAP = 'Zarządzanie mapą',

  TERRAIN_POINT_LIST = 'Lista punktów',
  TERRAIN_POINT_ADD = 'Dodaj punkt',
  TERRAIN_POINT_EDIT = 'Edycja punktu',
  TERRAIN_POINT_DELETE = 'Usunięcie punktu',

  SECTION = 'Przeglądanie odcinka',
  SECTION_ADD = 'Dodaj odcinek',
  SECTION_EDIT = 'Edytowanie odcinka',
  SECTION_DELETE = 'Usuwanie odcinka',

  MOUNTAIN_RANGE = 'Pasmo górskie',
  MOUNTAIN_RANGE_ADD = 'Dodanie grupy górskiej',
  MOUNTAIN_RANGE_EDIT = 'Edycja grupy górskiej',
  MOUNTAIN_RANGE_DELETE = 'Usuwanie pasma górskiego',

  MOUNTAIN_GROUP = 'Grupa górska',
  MOUNTAIN_GROUP_ADD = 'Dodaj grupę górską',
  MOUNTAIN_GROUP_EDIT = 'Edycja pasma górskiego',
  MOUNTAIN_GROUP_DELETE = 'Usunięcie grupy górskiej',

  BADGES = 'Odznaki',
  BADGES_ADD = 'Dodaj odznakę',
  BADGES_EDIT = 'Edycja odznaki',
  BADGES_DELETE = 'Usunięcie odznaki',

  LEADERS = 'Zarządzanie przodownikami',
  LEADER_EDIT = 'Edycja leadera',

  VERIFICATION = 'Weryfikacja wpisów',

  TRIPS = 'Zarządzanie wycieczkami',
  TRIP_ADD = 'Dodaj wycieczkę',
  TRIP_EDIT = 'Modyfikuj wycieczkę',
  TRIP_DELETE = 'Usuń wycieczkę',
  TRIP_MAP_TO_GOT = 'Wpisz do książeczki GOT',
  GOT_BOOK = 'Książeczka GOT'
}

export const PathLinkMap = new Map([
  [PathNames.WELCOME, '/'],
  [PathNames.LOGIN, '/login'],
  [PathNames.REGISTER, '/register'],

  [PathNames.MANAGE_MAP, '/manage-map'],

  [PathNames.TERRAIN_POINT_LIST, '/terrain-points/list'],
  [PathNames.TERRAIN_POINT_ADD, '/terrain-points/add'],
  [PathNames.TERRAIN_POINT_EDIT, '/terrain-points/edit/:id'],
  [PathNames.TERRAIN_POINT_DELETE, '/terrain-points/delete/:id'],

  [PathNames.SECTION, '/section/:id'],
  [PathNames.SECTION_ADD, '/section/add/:rangeId'], // Id pasma górskiego żeby łatwiej było dodwać odcinki z poziomu pasma
  [PathNames.SECTION_EDIT, '/section/edit/:id'],
  [PathNames.SECTION_DELETE, '/section/delete/:id'],

  [PathNames.MOUNTAIN_RANGE, '/mountain-range/:id'],
  [PathNames.MOUNTAIN_RANGE_ADD, '/mountain-range/add/:groupId'],
  [PathNames.MOUNTAIN_RANGE_EDIT, '/mountain-range/edit/:id'],
  [PathNames.MOUNTAIN_RANGE_DELETE, '/mountain-range/delete/:id'],

  [PathNames.MOUNTAIN_GROUP, '/mountain-group'],
  [PathNames.MOUNTAIN_GROUP_ADD, '/mountain-group/add'],
  [PathNames.MOUNTAIN_GROUP_EDIT, '/mountain-group/edit/:id'],
  [PathNames.MOUNTAIN_GROUP_DELETE, '/mountain-group/delete/:id'],

  [PathNames.BADGES, '/badges'],
  [PathNames.BADGES_ADD, '/badges/add'],
  [PathNames.BADGES_EDIT, '/badges/edit/:id'],
  [PathNames.BADGES_DELETE, '/badges/delete/:id'],

  [PathNames.LEADERS, '/leaders'],
  [PathNames.LEADER_EDIT, '/leader/edit/:id'],

  [PathNames.VERIFICATION, '/verification'],

  [PathNames.TRIPS, '/trips'],
  [PathNames.TRIP_ADD, '/trip/add'],
  [PathNames.TRIP_EDIT, '/trip/edit/:id'],
  [PathNames.TRIP_DELETE, '/trip/delete/:id'],
  [PathNames.TRIP_MAP_TO_GOT, '/trip/map-to-got/:id'],

  [PathNames.GOT_BOOK, '/got-book'],
])

export const getPath = (
  pathName: PathNames,
  params: Record<string, any> | undefined = undefined,
): string => {
  if (!params) {
    return PathLinkMap.get(pathName) || ''
  }

  let path = PathLinkMap.get(pathName) || ''

  Object.entries(params).forEach(([param, value]) => {
    path = path.replaceAll(`:${param}`, value)
  })

  return path
}
