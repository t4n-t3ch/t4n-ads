"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { FiUpload } from 'react-icons/fi'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CreateAd() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('ads')
        .insert([{ title, description, user_id: user.id }])
      
      if (error) throw error
      
      setTitle('')
      setDescription('')
      alert('Ad created successfully!')
    } catch (error) {
      console.error('Error creating ad:', error)
      alert('Failed to create ad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Ad</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ad title"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter ad description"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !user}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold',
            twMerge(
              loading || !user
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            )
          )}
        >
          <FiUpload />
          {loading ? 'Creating...' : 'Create Ad'}
        </button>
      </form>
    </div>
  )
}