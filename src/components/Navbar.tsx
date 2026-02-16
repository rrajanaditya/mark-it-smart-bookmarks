'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [imgError, setImgError] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const userImage = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email || 'User'
  const firstLetter = displayName.charAt(0).toUpperCase()

  return (
    <nav className="sticky top-4 z-50 mx-auto w-[95%] max-w-5xl rounded-3xl border border-blue-200/40 bg-white/40 p-3 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl md:top-6 transition-all duration-300">
      <div className="flex items-center justify-between px-4">
        <div className="text-2xl font-black bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
          MarkIt
        </div>
        
        <div className="flex items-center gap-5">
          <span className="hidden md:block text-sm font-bold text-slate-600">
            {displayName}        
          </span>

          <div className="relative h-10 w-10 overflow-hidden rounded-2xl border-2 border-white shadow-inner bg-blue-50">
            {userImage && !imgError ? (
              <Image 
                src={userImage} 
                alt="User avatar" 
                fill 
                sizes="40px"
                className="object-cover"
                onError={() => setImgError(true)}
                priority 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600 text-white font-black text-sm">
                {firstLetter}
              </div>
            )}
          </div>

          <form action="/auth/signout" method="post">
            <button 
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}