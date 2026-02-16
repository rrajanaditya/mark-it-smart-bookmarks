'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bookmark, RealtimePayload } from '@/types' 

interface BookmarkListProps {
  initialBookmarks: Bookmark[]
  userId: string
}

export default function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`rt_bookmarks_${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload as unknown as RealtimePayload<Bookmark>

          if (eventType === 'INSERT') setBookmarks((prev) => [newRecord, ...prev])
          if (eventType === 'UPDATE') setBookmarks((prev) => prev.map((b) => (b.id === newRecord.id ? newRecord : b)))
          if (eventType === 'DELETE') setBookmarks((prev) => prev.filter((b) => b.id !== oldRecord.id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase, userId])

  useEffect(() => { setBookmarks(initialBookmarks) }, [initialBookmarks])

  const startEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id)
    setEditTitle(bookmark.title)
    setEditUrl(bookmark.url)
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .update({ title: editTitle, url: editUrl })
      .eq('id', id)

    if (error) {
      console.error("Update failed:", error.message)
    } else {
      setEditingId(null)
    }
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) console.error("Deletion failed:", error.message)
  }

  return (
    <div className="mx-auto mt-8 grid w-full max-w-5xl gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((b) => (
        <div 
          key={b.id} 
          className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 backdrop-blur-2xl ${
            editingId === b.id 
            ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-400/20 shadow-2xl scale-[1.02]' 
            : 'border-blue-200/40 bg-blue-50/20 shadow-xl shadow-blue-500/5 hover:-translate-y-1.5 hover:bg-blue-50/40'
          } p-6`}
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl group-hover:opacity-100" />
          
          <div className="relative z-10 mb-6">
            {editingId === b.id ? (
              <div className="flex flex-col gap-2">
                <input 
                  className="bg-white/60 border text-black border-blue-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400/50"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                />
                <input 
                  className="bg-white/60 border text-black border-blue-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-400/50"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="URL"
                />
              </div>
            ) : (
              <>
                <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-800 line-clamp-1 group-hover:text-blue-600">
                  {b.title}
                </h3>
                <a href={b.url} target="_blank" rel="noreferrer" className="inline-block text-xs font-semibold text-blue-500/80 hover:text-blue-700 underline-offset-4 hover:underline break-all">
                  {b.url.replace(/^https?:\/\//, '')}
                </a>
              </>
            )}
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-blue-100/30 pt-4">
            <div className="flex gap-2">
              {editingId === b.id ? (
                <>
                  <button onClick={() => handleUpdate(b.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-200/50 rounded-lg hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => startEditing(b)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-500/10 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  Edit
                </button>
              )}
            </div>
            
            {!editingId && (
              <button 
                onClick={() => deleteBookmark(b.id)} 
                className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}