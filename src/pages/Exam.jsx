import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle, Clock, BarChart3, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { shuffleArray } from '../utils/pdfParser'

const Exam = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { desks, setCurrentExam, addResult } = useStore()
  
  const desk = desks.find(d => d.id === id)
  
  const [started, setStarted] = useState(false)
  const [qCount, setQCount] = useState(10)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [examQuestions, setExamQuestions] = useState([])
  
  useEffect(() => {
    if (desk) {
      setQCount(Math.min(10, desk.questions.length))
    }
  }, [desk])

  const handleStart = () => {
    const shuffled = shuffleArray(desk.questions).slice(0, qCount)
    setExamQuestions(shuffled)
    setStarted(true)
  }

  const handleFinish = () => {
    let score = 0
    const mistakes = []
    
    examQuestions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx]
      if (userAns === q.correctAnswer) {
        score++
      } else {
        mistakes.push({
          ...q,
          userAnswer: userAns,
          index: idx
        })
      }
    })
    
    const result = {
      id: crypto.randomUUID(),
      deskId: id,
      deskName: desk.name,
      score,
      total: examQuestions.length,
      mistakes,
      date: new Date().toISOString()
    }
    
    addResult(result)
    navigate(`/results/${result.id}`)
  }

  if (!desk) return <div className="p-20 text-center">Kurs topilmadi</div>

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto p-10 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-10 rounded-[3rem] w-full text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <BarChart3 size={48} />
          </div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2">{desk.name}</h1>
          <p className="text-indigo-600 mb-8">Bilimingizni sinab ko'rishga tayyormisiz?</p>
          
          <div className="bg-indigo-50/50 p-6 rounded-2xl mb-8">
            <label className="block text-sm font-bold text-indigo-900 mb-2">Nechta savol yechishni xohlaysiz?</label>
            <input 
              type="number"
              min="1"
              max={desk.questions.length}
              value={qCount}
              onChange={(e) => setQCount(parseInt(e.target.value))}
              className="w-full text-center py-3 rounded-xl border border-indigo-100 focus:ring-2 focus:ring-indigo-500 font-bold text-xl text-indigo-900"
            />
            {qCount > desk.questions.length && (
              <p className="text-red-500 text-xs mt-2 flex items-center justify-center gap-1">
                <AlertTriangle size={12} /> Savollar yetarli emas (Maksimal: {desk.questions.length})
              </p>
            )}
          </div>
          
          <button 
            disabled={qCount < 1 || qCount > desk.questions.length}
            onClick={handleStart}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            IMTIHONNI BOSHLASH
          </button>
        </motion.div>
      </div>
    )
  }

  const currentQ = examQuestions[currentIdx]
  const progress = ((currentIdx + 1) / examQuestions.length) * 100

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col">
      <header className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              <BarChart3 size={20} />
            </div>
            <span className="text-xl font-black text-indigo-950 tracking-tight">{desk.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-indigo-50">
              Q {currentIdx + 1} / {examQuestions.length}
            </div>
          </div>
        </div>
        <div className="w-full h-3 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/20 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full premium-gradient rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          />
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-[3rem] p-12 mb-12 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50/30 rounded-full blur-3xl" />
            
            <h2 className="text-2xl font-black text-indigo-950 mb-10 leading-snug relative z-10">
              {currentQ.text}
            </h2>
            
            <div className="grid gap-5 relative z-10">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedAnswers({...selectedAnswers, [currentIdx]: opt})}
                  className={`flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all text-left group ${selectedAnswers[currentIdx] === opt ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-500/10' : 'border-indigo-50 hover:border-indigo-200 bg-white/50 hover:bg-white'}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${selectedAnswers[currentIdx] === opt ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 rotate-12' : 'bg-indigo-50 text-indigo-300 group-hover:text-indigo-500 group-hover:bg-indigo-100'}`}>
                    {opt}
                  </div>
                  <span className={`font-bold transition-colors ${selectedAnswers[currentIdx] === opt ? 'text-indigo-950' : 'text-indigo-700'}`}>
                    {currentQ.options[opt] || `Option ${opt}`}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="flex justify-between items-center gap-6 py-8 border-t border-indigo-50">
        <button 
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(currentIdx - 1)}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-indigo-100 text-indigo-600 font-black hover:bg-indigo-50 transition-all disabled:opacity-20 translate-y-0 active:translate-y-1"
        >
          <ChevronLeft size={24} />
          <span>Oldingi</span>
        </button>
        
        {currentIdx === examQuestions.length - 1 ? (
          <button 
            onClick={handleFinish}
            className="flex items-center gap-3 px-12 py-4 bg-green-600 text-white rounded-2xl font-black shadow-2xl hover:bg-green-700 hover:shadow-green-500/20 transition-all transform active:scale-95"
          >
            <CheckCircle size={24} />
            <span>Imtihonni yakunlash</span>
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl hover:bg-indigo-700 hover:shadow-indigo-500/20 transition-all transform active:scale-95"
          >
            <span>Keyingi savol</span>
            <ChevronRight size={24} />
          </button>
        )}
      </footer>
    </div>
  )
}

export default Exam
