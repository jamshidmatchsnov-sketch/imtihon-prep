import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { extractTextFromPdf, parseQuestions, parseAnswers } from '../utils/pdfParser'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CreateDesk = () => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [qFile, setQFile] = useState(null)
  const [aFile, setAFile] = useState(null)
  const [parsedData, setParsedData] = useState([])
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState('')
  
  const { addDesk, user } = useStore()
  const navigate = useNavigate()

  const handleParse = async () => {
    setParsing(true)
    setError('')
    try {
      const qText = await extractTextFromPdf(qFile)
      const aText = await extractTextFromPdf(aFile)
      
      const parsedQs = parseQuestions(qText)
      const parsedAs = parseAnswers(aText)
      
      if (parsedQs.length === 0) throw new Error("PDF'dan savollar topilmadi.")
      
      const questionsWithAnswers = parsedQs.map(q => ({
        ...q,
        correctAnswer: parsedAs[q.id] || 'A'
      }))

      setParsedData(questionsWithAnswers)
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setParsing(false)
    }
  }

  const handleCreate = async () => {
    setParsing(true)
    try {
      const newDesk = {
        id: crypto.randomUUID(),
        name,
        questions: parsedData,
        created_at: new Date().toISOString(),
        user_id: user?.id
      }

      if (user) {
        const { error: dbError } = await supabase.from('desks').insert([newDesk])
        if (dbError) console.error('Supabase save error:', dbError)
      }

      addDesk(newDesk)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setParsing(false)
    }
  }

  const steps = [
    { title: 'Nomlash', icon: <FileText /> },
    { title: 'Savollar', icon: <Upload /> },
    { title: 'Javoblar', icon: <Upload /> },
    { title: 'Ko‘zdan kechirish', icon: <CheckCircle2 /> }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 min-h-screen flex flex-col items-center">
      <div className="w-full mb-12 flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-indigo-100 -translate-y-1/2 z-0 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500 rounded-full" 
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((s, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step > i + 1 ? 'bg-indigo-600 text-white' : step === i + 1 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-white text-indigo-300 border-2 border-indigo-100'}`}>
              {step > i + 1 ? <CheckCircle2 size={18} /> : React.cloneElement(s.icon, { size: 18 })}
            </div>
            <span className={`text-xs font-bold ${step >= i + 1 ? 'text-indigo-900' : 'text-indigo-300'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`glass rounded-3xl p-8 w-full ${step === 4 ? 'max-w-3xl' : 'max-w-lg'}`}
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-indigo-950">Nom bering</h2>
              <p className="text-indigo-600">Kurs stoli uchun nom tanlang.</p>
              <input 
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 text-lg font-medium"
                placeholder="Fizika 1-bob..."
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-black text-indigo-950">Savollarni yuklang</h2>
              <p className="text-indigo-600">Savollar mavjud PDF faylini yuklang.</p>
              <label className="block border-4 border-dashed border-indigo-50 rounded-3xl p-10 hover:border-indigo-200 transition-all cursor-pointer bg-indigo-50/10 active:bg-indigo-50/30">
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setQFile(e.target.files[0])} />
                <div className="flex flex-col items-center gap-4">
                   <Upload size={48} className="text-indigo-400" />
                   <span className="text-indigo-950 font-bold">{qFile ? qFile.name : 'PDF faylni tanlang'}</span>
                </div>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-black text-indigo-950">Javoblar kalitini yuklang</h2>
              <p className="text-indigo-600">To'g'ri javoblar mavjud PDF faylini yuklang.</p>
              <label className="block border-4 border-dashed border-indigo-50 rounded-3xl p-10 hover:border-indigo-200 transition-all cursor-pointer bg-indigo-50/10 active:bg-indigo-50/30">
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setAFile(e.target.files[0])} />
                <div className="flex flex-col items-center gap-4">
                  <Upload size={48} className="text-indigo-400" />
                  <span className="text-indigo-950 font-bold">{aFile ? aFile.name : 'PDF faylni tanlang'}</span>
                </div>
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-indigo-950">Savollarni ko'zdan kechirish</h2>
              <p className="text-indigo-600 mb-4">{parsedData.length} ta savol topildi. Iltimos, tekshirib chiqing.</p>
              
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {parsedData.map((q, i) => (
                  <div key={i} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                    <div className="flex justify-between mb-2">
                       <span className="font-bold text-indigo-950">{q.id}-savol</span>
                       <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Javob: {q.correctAnswer}</span>
                    </div>
                    <p className="text-indigo-800 text-sm mb-3">{q.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(q.options).map(([key, val]) => (
                        <div key={key} className="text-xs text-indigo-500 bg-white p-2 rounded-lg border border-indigo-50">
                          <span className="font-bold mr-1">{key}:</span> {val}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm font-medium mt-4 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                disabled={parsing}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
              >
                <ArrowLeft size={18} /> Orqaga
              </button>
            )}
            <button 
              disabled={parsing || (step === 1 && !name) || (step === 2 && !qFile) || (step === 3 && !aFile)}
              onClick={() => step === 4 ? handleCreate() : step === 3 ? handleParse() : setStep(step + 1)}
              className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
            >
              {parsing ? <><Loader2 className="animate-spin" /> Jarayon...</> : step === 4 ? 'Tasdiqlash va Yaratish' : <>{step === 3 ? 'PDF-larni tahlil qilish' : 'Davom etish'} <ArrowRight size={20} /></>}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CreateDesk
