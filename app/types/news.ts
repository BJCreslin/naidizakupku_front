export interface News {
  id: number
  title: string
  url: string
  publicationDate: string | null
  content: string | null
  newsType: NewsType
  createdAt: string | null
  updatedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  comment: string | null
}

export enum NewsType {
  GENERAL = 'GENERAL'
}

export interface NewsResponse {
  data: News[]
  total: number
} 