'use client'

import { TrendingUp, Calendar, MapPin, Briefcase, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useProjectInfo } from '@/hooks/use-project-info'
import { formatNumber, formatBudget } from '@/utils/format'
import { AuthStatus } from './auth-status'

interface ProcurementItem {
  id: string
  title: string
  organization: string
  budget: string
  deadline: string
  location: string
  status: 'active' | 'ending-soon' | 'new'
}

export function MainContent() {
  // Получаем данные о проекте из API
  const { projectInfo, isLoading, error } = useProjectInfo()

  // Мокап данных для демонстрации
  const procurements: ProcurementItem[] = [
    {
      id: '1',
      title: 'Поставка офисной мебели для государственного учреждения',
      organization: 'Министерство образования РФ',
      budget: '2 450 000 ₽',
      deadline: '2024-02-15',
      location: 'Москва',
      status: 'new'
    },
    {
      id: '2',
      title: 'Техническое обслуживание компьютерной техники',
      organization: 'Администрация городского округа',
      budget: '890 000 ₽',
      deadline: '2024-02-10',
      location: 'Санкт-Петербург',
      status: 'ending-soon'
    },
    {
      id: '3',
      title: 'Строительство детской площадки',
      organization: 'Комитет по благоустройству',
      budget: '1 250 000 ₽',
      deadline: '2024-02-20',
      location: 'Казань',
      status: 'active'
    },
    {
      id: '4',
      title: 'Поставка медицинского оборудования',
      organization: 'Городская больница №1',
      budget: '3 750 000 ₽',
      deadline: '2024-02-25',
      location: 'Новосибирск',
      status: 'active'
    },
    {
      id: '5',
      title: 'Ремонт дорожного покрытия',
      organization: 'Дорожная служба области',
      budget: '15 800 000 ₽',
      deadline: '2024-03-01',
      location: 'Екатеринбург',
      status: 'new'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'ending-soon':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новая'
      case 'ending-soon':
        return 'Скоро окончание'
      case 'active':
        return 'Активная'
      default:
        return 'Активная'
    }
  }

  const handleStartSearch = () => {
    window.open('https://zakupki.gov.ru/epz/order/extendedsearch/results.html', '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Auth Status */}
      <AuthStatus />

      {/* Hero Section */}
      <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Найдите подходящие закупки
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl">
            Ваш надежный помощник в мире государственных и коммерческих закупок. 
            Отслеживайте тендеры, участвуйте в конкурсах и развивайте свой бизнес.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleStartSearch}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Начать поиск
            </button>
            <button className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
              Узнать больше
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-10">
          <TrendingUp size={120} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-primary mb-2 min-h-[2rem] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : error ? (
              <span className="text-red-500 text-base">Ошибка</span>
            ) : (
              `${formatNumber(projectInfo?.procurementsCount || 0)}+`
            )}
          </div>
          <div className="text-sm text-muted-foreground">Активных закупок</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-primary mb-2 min-h-[2rem] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : error ? (
              <span className="text-red-500 text-base">Ошибка</span>
            ) : (
              `${formatNumber(projectInfo?.membersCount || 0)}+`
            )}
          </div>
          <div className="text-sm text-muted-foreground">Участников</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-primary mb-2 min-h-[2rem] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : error ? (
              <span className="text-red-500 text-base">Ошибка</span>
            ) : (
              formatBudget(projectInfo?.budgetAmount || 0)
            )}
          </div>
          <div className="text-sm text-muted-foreground">Общий бюджет</div>
        </div>
      </div>

      {/* Procurement List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Актуальные закупки
        </h2>
        
        <div className="space-y-4 max-h-screen overflow-y-auto">
          {procurements.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {item.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} />
                      <span>{item.organization}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Срок подачи: {new Date(item.deadline).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:items-end gap-3">
                  <div className="text-xl font-semibold text-primary">
                    {item.budget}
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 