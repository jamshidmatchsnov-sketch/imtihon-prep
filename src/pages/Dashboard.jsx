import React from 'react'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, desks } = useStore()
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <header className="flex justify-between items-center mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Xush kelibsiz!</h1>
          <p className="text-indigo-600 font-medium">Navbatdagi imtihonni topshirishga tayyormisiz?</p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/create-desk')}
          className="premium-gradient text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center gap-2"
        >
          <Plus size={24} />
          <span>Kurs yaratish</span>
        </motion.button>
      </header>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-indigo-950 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
              <BookOpen size={24} />
            </div>
            Sizning kurslaringiz
          </h2>
          <span className="text-indigo-400 font-bold text-sm bg-white px-4 py-1.5 rounded-full border border-indigo-50">Jami: {desks.length}</span>
        </div>
        
        {desks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-20 text-center border-dashed border-2 border-indigo-100"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <BookOpen size={48} className="text-indigo-200" />
            </div>
            <h3 className="text-2xl font-black text-indigo-950 mb-2">Hozircha kurslar yo'q</h3>
            <p className="text-indigo-400 font-medium mb-8">Interaktiv test stoli yaratish uchun PDF-laringizni yuklang.</p>
            <button 
              onClick={() => navigate('/create-desk')}
              className="px-8 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
            >
              Boshlash
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {desks.map((desk, idx) => (
              <motion.div
                key={desk.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/exam/${desk.id}`)}
                className="glass rounded-[2rem] p-8 card-hover cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
                      <BookOpen size={24} />
                    </div>
                    <div className="text-indigo-400 flex items-center gap-1.5 text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      <Clock size={14} />
                      <span>{new Date(desk.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-indigo-950 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {desk.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                       {[...Array(3)].map((_, i) => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center overflow-hidden">
                           <div className="w-full h-full bg-indigo-500/20" />
                         </div>
                       ))}
                    </div>
                    <span className="text-indigo-500 text-sm font-bold">{desk.questions.length} ta mashq savoli</span>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-indigo-50 flex justify-between items-center">
                    <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">Sessiyani boshlash</span>
                    <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
