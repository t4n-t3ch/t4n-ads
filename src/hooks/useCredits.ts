'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

interface CreditsResponse {
  credits: number
  success: boolean
  message?: string
}

export function useCredits() {
  const { user, isLoading: authLoading } = useAuth()
  const [credits, setCredits] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/credits')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch credits: ${response.status}`)
      }

      const data: CreditsResponse = await response.json()
      
      if (data.success) {
        setCredits(data.credits)
      } else {
        throw new Error(data.message || 'Failed to fetch credits')
      }
    } catch (err) {
      console.error('Error fetching credits:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const deductCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated')
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
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error(`Failed to deduct credits: ${response.status}`)
      }

      const data: CreditsResponse = await response.json()
      
      if (data.success) {
        setCredits(data.credits)
        return true
      } else {
        throw new Error(data.message || 'Failed to deduct credits')
      }
    } catch (err) {
      console.error('Error deducting credits:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }, [user, credits])

  const addCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated')
      return false
    }

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Math.abs(amount) }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add credits: ${response.status}`)
      }

      const data: CreditsResponse = await response.json()
      
      if (data.success) {
        setCredits(data.credits)
        return true
      } else {
        throw new Error(data.message || 'Failed to add credits')
      }
    } catch (err) {
      console.error('Error adding credits:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }, [user])

  useEffect(() => {
    if (!authLoading) {
      fetchCredits()
    }
  }, [authLoading, fetchCredits])

  const refetch = useCallback(() => {
    fetchCredits()
  }, [fetchCredits])

  const hasLowCredits = credits < 10
  const hasNoCredits = credits === 0

  return {
    credits,
    isLoading: isLoading || authLoading,
    error,
    refetch,
    deductCredits,
    addCredits,
    hasLowCredits,
    hasNoCredits,
  }
}