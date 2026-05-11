import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, RefreshCcw, Check, X, AlertCircle } from 'lucide-react'
import { useStore } from '../store/useStore'

const Results = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { examResults } = useStore()
  
  const result = examResults.find(r => r.id === id)
  const [reviewMode, setReviewMode] = useState(false)

  if (!result) return <div className="p-20 text-center">Natija topilmadi</div>

  const percentage = Math.round((result.score / result.total) * 100)
  const isExcellent = percentage >= 80
  const isGood = percentage >= 50

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 min-h-screen">
      {!reviewMode ? (
        <div className="flex flex-col items-center justify-center py-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-40 h-40 rounded-full flex items-center justify-center mb-8 border-8 shadow-2xl ${isExcellent ? 'border-green-500 text-green-500' : isGood ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'}`}
          >
            <div className="text-center">
              <span className="text-5xl font-black">{percentage}%</span>
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-black text-indigo-950 mb-2">Test yakunlandi!</h1>
          <p className="text-indigo-600 mb-10 text-xl font-medium">{result.deskName}</p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
            <div className="glass p-6 rounded-3xl text-center">
              <div className="text-indigo-400 text-sm mb-1 uppercase tracking-wider font-bold">Natija</div>
              <div className="text-3xl font-black text-indigo-950">{result.score} / {result.total}</div>
            </div>
            <div className="glass p-6 rounded-3xl text-center">
              <div className="text-indigo-400 text-sm mb-1 uppercase tracking-wider font-bold">Aniqlik</div>
              <div className="text-3xl font-black text-indigo-950">{percentage}%</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button 
              onClick={() => setReviewMode(true)}
              className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} /> Xatolarni ko'rish
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-8 py-4 glass text-indigo-900 rounded-2xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Home size={20} /> Bosh sahifa
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 pb-20">
          <header className="flex justify-between items-center mb-10 sticky top-0 py-4 glass-dark z-20 px-6 rounded-2xl shadow-2xl backdrop-blur-xl">
             <div>
                <h2 className="text-white font-black text-xl">Xatolarni ko'rib chiqish</h2>
                <p className="text-indigo-200 text-sm">{result.mistakes.length} ta xato topildi</p>
             </div>
             <button 
              onClick={() => setReviewMode(false)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
             >
                Natijaga qaytish
             </button>
          </header>

          <div className="space-y-6">
            {result.mistakes.map((q, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-[2rem] border-l-8 border-red-500 overflow-hidden"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-lg font-bold text-indigo-950">{q.index + 1}. {q.text}</h3>
                  <div className="bg-red-50 text-red-500 p-2 rounded-lg shrink-0">
                    <X size={20} />
                  </div>
                </div>
                
                <div className="grid gap-3 mt-6">
                    {/* User Answer */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                        <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-black">{q.userAnswer || '?'}</div>
                        <div className="flex-1 text-red-900 font-medium">Sizning javobingiz: <span className="font-bold">{q.options[q.userAnswer] || 'Javob berilmagan'}</span></div>
                        <X className="text-red-400" size={18} />
                    </div>
                    {/* Correct Answer */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                        <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-black">{q.correctAnswer}</div>
                        <div className="flex-1 text-green-900 font-medium">To'g'ri javob: <span className="font-bold">{q.options[q.correctAnswer] || 'Javoblar kaliti'}</span></div>
                        <Check className="text-green-400" size={18} />
                    </div>
                </div>
              </motion.div>
            ))}
            
            {result.mistakes.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                  <Check size={40} />
                </div>
                <h3 className="text-2xl font-black text-indigo-950">Ajoyib natija!</h3>
                <p className="text-indigo-600">Siz birorta ham xato qilmadingiz.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => navigate(`/exam/${result.deskId}`)}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <RefreshCcw size={20} /> TESTNI QAYTA TOPSHIRISH
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Results
