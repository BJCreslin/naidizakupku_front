import { NextResponse } from 'next/server'
import type { News, NewsResponse } from '@/types/news'
import { NewsType } from '@/types/news'

export async function GET() {
  try {
    // Здесь будет реальный запрос к бэкенду
    // Пока возвращаем моковые данные для разработки
    const mockNews: News[] = [
      {
        id: 1,
        title: "Изменения в федеральном законе о контрактной системе",
        url: "https://zakupki.gov.ru/epz/news/1",
        publicationDate: "2024-01-15T10:30:00",
        content: "Внесены важные изменения в порядок проведения государственных закупок...",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-15T10:30:00",
        updatedAt: "2024-01-15T10:30:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      },
      {
        id: 2,
        title: "Новые требования к поставщикам в 2024 году",
        url: "https://zakupki.gov.ru/epz/news/2",
        publicationDate: "2024-01-14T14:20:00",
        content: "С 1 февраля вступают в силу обновленные требования к участникам закупок...",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-14T14:20:00",
        updatedAt: "2024-01-14T14:20:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      },
      {
        id: 3,
        title: "Планируемые технические работы на портале",
        url: "https://zakupki.gov.ru/epz/news/3",
        publicationDate: "2024-01-13T16:45:00",
        content: "Уведомляем о плановых технических работах на Единой информационной системе...",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-13T16:45:00",
        updatedAt: "2024-01-13T16:45:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      },
      {
        id: 4,
        title: "Обновление реестра недобросовестных поставщиков",
        url: "https://zakupki.gov.ru/epz/news/4",
        publicationDate: "2024-01-12T11:30:00",
        content: "В реестр недобросовестных поставщиков добавлены новые записи. Заказчикам рекомендуется проверять контрагентов перед заключением контрактов.",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-12T11:30:00",
        updatedAt: "2024-01-12T11:30:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      },
      {
        id: 5,
        title: "Изменения в порядке подачи жалоб",
        url: "https://zakupki.gov.ru/epz/news/5",
        publicationDate: "2024-01-11T09:15:00",
        content: "С 15 января изменяется порядок подачи и рассмотрения жалоб на действия заказчиков. Подробности в полном тексте новости.",
        newsType: NewsType.GENERAL,
        createdAt: "2024-01-11T09:15:00",
        updatedAt: "2024-01-11T09:15:00",
        createdBy: "system",
        updatedBy: null,
        comment: null
      }
    ]

    const response: NewsResponse = {
      data: mockNews,
      total: mockNews.length
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
} 