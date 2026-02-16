'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

export default function AddBookmark() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)

    let formattedUrl = url.trim();

    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
    }

    toast.promise(
      (async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("You must be logged in")

        const { error } = await supabase
          .from('bookmarks')
          .insert([{ url:formattedUrl, title, user_id: user.id }])
        
        if (error) throw error
        
        setUrl('')
        setTitle('')
      })(),
      {
        loading: 'Saving bookmark...',
        success: 'Bookmark added!',
        error: (err) => `Failed to add: ${err.message}`,
        finally: () => setIsSubmitting(false)
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-2xl gap-3 rounded-2xl border border-white/30 bg-white/40 p-6 shadow-xl backdrop-blur-md transition-all focus-within:bg-white/60 flex flex-col md:flex-row">
      <input 
        className="flex-1 rounded-xl border-none bg-white/50 p-3 text-gray-800 placeholder-gray-500 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-blue-500/50" 
        placeholder="Bookmark Title" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        disabled={isSubmitting}
        required 
      />
      <input 
        className="flex-2 rounded-xl border-none bg-white/50 p-3 text-gray-800 placeholder-gray-500 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-blue-500/50" 
        placeholder="https://example.com" 
        type="url"
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        disabled={isSubmitting}
        required 
      />
      <button 
        disabled={isSubmitting}
        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}