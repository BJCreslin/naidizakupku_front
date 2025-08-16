'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { useAuthContext } from '@/components/auth-provider'
import { Briefcase, Calendar, MapPin, DollarSign, Eye } from 'lucide-react'

interface PurchaseItem {
  id: string
  title: string
  organization: string
  budget: string
  deadline: string
  location: string
  status: 'active' | 'won' | 'lost' | 'pending'
  applicationDate: string
}

export default function MyPurchasesPage() {
  const { user } = useAuthContext()

  // Мокап данных для демонстрации
  const purchases: PurchaseItem[] = [
    {
      id: '1',
      title: 'Поставка офисной мебели для государственного учреждения',
      organization: 'Министерство образования РФ',
      budget: '2 450 000 ₽',
      deadline: '2024-02-15',
      location: 'Москва',
      status: 'active',
      applicationDate: '2024-01-20'
    },
    {
      id: '2',
      title: 'Техническое обслуживание компьютерной техники',
      organization: 'Администрация городского округа',
      budget: '890 000 ₽',
      deadline: '2024-02-10',
      location: 'Санкт-Петербург',
      status: 'won',
      applicationDate: '2024-01-15'
    },
    {
      id: '3',
      title: 'Строительство детской площадки',
      organization: 'Комитет по благоустройству',
      budget: '1 250 000 ₽',
      deadline: '2024-02-20',
      location: 'Казань',
      status: 'lost',
      applicationDate: '2024-01-10'
    },
    {
      id: '4',
      title: 'Поставка медицинского оборудования',
      organization: 'Городская больница №1',
      budget: '3 750 000 ₽',
      deadline: '2024-02-25',
      location: 'Новосибирск',
      status: 'pending',
      applicationDate: '2024-01-25'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'won':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активная'
      case 'won':
        return 'Выиграна'
      case 'lost':
        return 'Проиграна'
      case 'pending':
        return 'На рассмотрении'
      default:
        return 'Неизвестно'
    }
  }

  const MyPurchasesContent = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Мои закупки
        </h1>
        {user && (
          <p className="text-gray-600">
            Добро пожаловать, {user.firstName}! Здесь вы можете отслеживать свои заявки на участие в закупках.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {purchases.filter(p => p.status === 'active').length}
          </div>
          <div className="text-sm text-muted-foreground">Активные заявки</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {purchases.filter(p => p.status === 'won').length}
          </div>
          <div className="text-sm text-muted-foreground">Выигранные</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {purchases.filter(p => p.status === 'lost').length}
          </div>
          <div className="text-sm text-muted-foreground">Проигранные</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            {purchases.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-sm text-muted-foreground">На рассмотрении</div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white border border-border rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-gray-900">
            История заявок
          </h2>
        </div>
        
        <div className="divide-y divide-border">
          {purchases.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span>{item.organization}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        <span>Бюджет: {item.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Подача: {new Date(item.applicationDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:items-end gap-3">
                  <div className="text-sm text-muted-foreground">
                    Дедлайн: {new Date(item.deadline).toLocaleDateString('ru-RU')}
                  </div>
                  <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Eye size={16} />
                    <span>Подробнее</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <ProtectedRoute>
      <MyPurchasesContent />
    </ProtectedRoute>
  )
} 