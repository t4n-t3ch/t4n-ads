'use client'

import { useState, useEffect, useCallback } from 'react'

interface UsageResponse {
  myCents: number
  myVideoCount: number
  totalCents: number
  totalVideoCount: number
}

export function useUsage() {
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsage = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/usage')
      if (!response.ok) {
        throw new Error(`Failed to fetch usage: ${response.status}`)
      }
      const data: UsageResponse = await response.json()
      setUsage(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  return { usage, isLoading, error, refetch: fetchUsage }
}
