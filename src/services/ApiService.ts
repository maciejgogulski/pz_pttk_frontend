// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios'

export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

class ApiService {
  private baseUrl = 'http://localhost:8000/api'

  // eslint-disable-next-line no-use-before-define
  private static instance: ApiService

  public async get<T>(endpoint: string, data?:any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await axios.get<T>(url, { params: data })
    return response.data
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }
}

export default ApiService