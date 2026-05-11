import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      desks: [],
      currentExam: null,
      examResults: [],
      
      setUser: (user) => set({ user }),
      
      setDesks: (desks) => set({ desks }),
      addDesk: (desk) => set((state) => ({ desks: [desk, ...state.desks] })),
      
      setCurrentExam: (exam) => set({ currentExam: exam }),
      addResult: (result) => set((state) => ({ examResults: [result, ...state.examResults] })),
      
      logout: () => set({ user: null, desks: [], currentExam: null, examResults: [] }),
    }),
    {
      name: 'exam-prep-storage',
    }
  )
)
