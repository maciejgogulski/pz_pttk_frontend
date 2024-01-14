class Tourist {
  id: number

  name: string

  email: string

  first_name: string

  last_name: string

  constructor(
    id: number,
    name: string,
    email: string,
    // eslint-disable-next-line camelcase
    first_name: string,
    // eslint-disable-next-line camelcase
    last_name: string,
  ) {
    this.id = id
    this.name = name
    this.email = email
    // eslint-disable-next-line camelcase
    this.first_name = first_name
    // eslint-disable-next-line camelcase
    this.last_name = last_name
  }
}

export default Tourist
