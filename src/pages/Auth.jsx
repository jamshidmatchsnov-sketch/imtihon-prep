import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useStore((state) => state.setUser)
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setUser(data.user)
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setUser(data.user)
      }
      navigate('/dashboard')
    } catch (error) {
      alert("Xato yuz berdi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen premium-gradient p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-900 mb-2">ExamPrep AI</h1>
          <p className="text-indigo-600">Prepare smarter, not harder.</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-xl transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-600 hover:bg-indigo-50'}`}
          >
            Kirish
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-xl transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-600 hover:bg-indigo-50'}`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-900 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
              placeholder="ism@misol.uz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-900 mb-1">Parol</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Jarayon...' : (isLogin ? <><LogIn size={18} /> Kirish</> : <><UserPlus size={18} /> Ro'yxatdan o'tish</>)}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default Auth
