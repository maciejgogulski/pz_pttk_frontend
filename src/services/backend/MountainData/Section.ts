import TerrainPoint from '@/models/TerrainPoint'
import ApiService, { ApiResponse } from '../ApiService'
import Section from '@/models/Section'
import MountainRangeService from './MountainRange'
import TerrainPointService from './TerrainPoint'

class SectionService {
  private sectionUrl = '/sections'

  private apiService: ApiService

  public async getSections(): Promise<Section[]> {
    const response = await this.apiService.get<ApiResponse<Section[]>>(this.sectionUrl)
    return response as any as Promise<Section[]>
  }

  public async getTerrainPoints(sectionId : number): Promise<TerrainPoint[]> {
    const response = await this.apiService.get<ApiResponse<TerrainPoint[]>>(`${this.sectionUrl}/${sectionId}/terrain-points`)
    return response as any as Promise<TerrainPoint[]>
  }

  public async createSection(data?: any): Promise<(Section)> {
    return this.apiService.post<Section>(`${this.sectionUrl}`, data)
  }

  public async editSection(sectionId: string, data?: any): Promise<(Section)> {
    return this.apiService.put<Section>(`${this.sectionUrl}/${sectionId}`, data)
  }

  public async deleteSection(sectionId : string): Promise<Section> {
    const response = await this.apiService.delete<ApiResponse<Section>>(`${this.sectionUrl}/${sectionId}`)
    return response as any as Promise<Section>
  }

  public async getOneSection(sectionId : string): Promise<Section> {
    const section = await this.apiService.get<Section>(`${this.sectionUrl}/${sectionId}`)
    const mountainRangeService = new MountainRangeService(this.apiService.token)
    section.mountainRange = await
    mountainRangeService.getOneMountainRangeWithoutDetails(section.mountain_range_id.toString())

    const terrainPointService = new TerrainPointService(this.apiService.token)
    section.terrainPointA = await
    terrainPointService.getTerrainPoint(section.terrain_point_a_id.toString())

    section.terrainPointB = await
    terrainPointService.getTerrainPoint(section.terrain_point_b_id.toString())

    return section
  }

  constructor(token: string) {
    this.apiService = new ApiService(token)
  }
}

export default SectionService
