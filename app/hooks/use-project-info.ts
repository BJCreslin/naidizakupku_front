'use client'

import { useState, useEffect, useRef } from 'react'
import type { ProjectInfoDto } from '@/types/project'

interface UseProjectInfoReturn {
  projectInfo: ProjectInfoDto | null
  isLoading: boolean
  error: string | null
}

export function useProjectInfo(): UseProjectInfoReturn {
  const [projectInfo, setProjectInfo] = useState<ProjectInfoDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    // Предотвращаем повторные запросы
    if (hasFetched.current) {
      return
    }
    const abortController = new AbortController()
    let cancelled = false

    async function fetchProjectInfo() {
      try {
        hasFetched.current = true
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/admin/common/info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch project info')
        }
        
        const data = await response.json()
        
        // Проверяем, не был ли запрос отменен
        if (!cancelled) {
          setProjectInfo(data.data)
        }
      } catch (err) {
        // Игнорируем ошибки отмены запроса
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        
        console.error('Error fetching project info:', err)
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchProjectInfo()

    // Cleanup функция для отмены запроса
    return () => {
      cancelled = true
      abortController.abort()
    }
  }, [])

  return { projectInfo, isLoading, error }
} 