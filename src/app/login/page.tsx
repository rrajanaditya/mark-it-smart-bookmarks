'use client'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-100 via-white to-purple-100 px-4">
            <div className="absolute top-[-10%] right-[-10%] h-125 w-125 rounded-full bg-blue-400/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-125 w-125 rounded-full bg-purple-400/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-10 shadow-2xl shadow-blue-900/10 backdrop-blur-2xl text-center">
                <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <span className="text-3xl font-black text-white">M</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            MarkIt
          </h1>
          <p className="mt-2 text-sm font-semibold text-blue-600/70 uppercase tracking-widest">
            Your Digital Library
          </p>
        </div>

        <p className="mb-10 text-slate-600 font-medium leading-relaxed">
          The elegant way to save and sync <br /> 
          your favorite corners of the internet.
        </p>
        
        <button 
          onClick={handleLogin}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white p-4 text-slate-800 shadow-xl shadow-blue-900/5 transition-all hover:-translate-y-1 hover:shadow-blue-900/10 active:scale-95 border border-blue-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>

          <span className="font-bold tracking-tight">Continue with Google</span>
          
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-blue-400/5 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
        </button>

        <div className="mt-10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Powered by Supabase & Next.js
        </div>
      </div>
    </div>
  )
}