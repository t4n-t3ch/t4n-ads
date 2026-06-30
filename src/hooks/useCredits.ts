'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

interface CreditsData {
  credits: number
  updatedAt: Date
}

interface UseCreditsReturn {
  credits: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  deductCredits: (amount: number) => Promise<boolean>
  isLowCredits: boolean
}

export function useCredits(): UseCreditsReturn {
  const { user, session, loading: authLoading } = useAuth()
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCredits = useCallback(async () => {
    if (!user || !session) {
      setCredits(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch credits')
      }

      const data = await response.json()
      setCredits(data.credits || 0)
    } catch (err) {
      console.error('Error fetching credits:', err)
      setError(err instanceof Error ? err.message : 'Failed to load credits')
    } finally {
      setLoading(false)
    }
  }, [user, session])

  const deductCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (!session) {
      setError('Not authenticated')
      return false
    }

    if (credits < amount) {
      setError('Insufficient credits')
      return false
    }

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ amount })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to deduct credits')
      }

      const data = await response.json()
      setCredits(data.newBalance)
      setError(null)
      return true
    } catch (err) {
      console.error('Error deducting credits:', err)
      setError(err instanceof Error ? err.message : 'Failed to deduct credits')
      return false
    }
  }, [session, credits])

  useEffect(() => {
    if (!authLoading) {
      fetchCredits()
    }
  }, [authLoading, fetchCredits])

  const isLowCredits = credits < 10

  return {
    credits,
    loading: authLoading || loading,
    error,
    refetch: fetchCredits,
    deductCredits,
    isLowCredits
  }
}