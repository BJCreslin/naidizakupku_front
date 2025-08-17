import { Heart, Code, Coffee } from 'lucide-react'
import { BACKEND_URLS } from '@/config/backend-urls'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* О проекте */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              О проекте
            </h3>
            <p className="text-sm text-muted-foreground">
              НайдиЗакупку — современная платформа для работы с государственными и коммерческими закупками.
            </p>
          </div>

          {/* Разработчики */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Команда разработки
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Code size={16} />
                <span>Frontend & UI/UX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Coffee size={16} />
                <span>Backend & API</span>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Связь с нами
            </h3>
            <div className="space-y-2">
              <a
                href={`mailto:${BACKEND_URLS.EMAIL.SUPPORT}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {BACKEND_URLS.EMAIL.SUPPORT}
              </a>
              <p className="text-sm text-muted-foreground">
                Техническая поддержка
              </p>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} НайдиЗакупку. Все права защищены.
            </p>
            <div className="flex items-center space-x-1 mt-2 sm:mt-0">
              <span className="text-sm text-muted-foreground">
                Сделано с
              </span>
              <Heart size={16} className="text-red-500" />
              <span className="text-sm text-muted-foreground">
                в России
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 