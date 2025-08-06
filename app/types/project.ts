/**
 * ДТО с информацией о проекте
 */
export interface ProjectInfoDto {
  /** Количество закупок */
  procurementsCount: number
  /** Количество участников */
  membersCount: number
  /** Бюджет */ 
  budgetAmount: number
}

export interface ProjectInfoResponse {
  data: ProjectInfoDto
} 