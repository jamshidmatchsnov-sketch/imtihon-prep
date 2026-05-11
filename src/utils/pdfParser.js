import * as pdfjs from 'pdfjs-dist'

// Set worker source using the local dependency for better reliability in Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const extractTextFromPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument(arrayBuffer).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(' ')
    fullText += pageText + '\n'
  }

  return fullText
}

export const parseQuestions = (text) => {
  // Relaxed regex: doesn't strictly require newlines, handles "1." "1)" "1-" and "Savol 1:"
  // Fix: The lookahead should ONLY stop at the next question (or end of text), NOT at options.
  // This ensures options are included in match[2] so extractOptions can find them.
  const questionRegex = /(?:\s|^)(\d+|[Qq]uestion|[Ss]avol)\s*[\.\-\)]\s*(.*?)(?=(?:\s+(\d+|[Qq]uestion|[Ss]avol)\s*[\.\-\)])|$)/gs
  const matches = [...text.matchAll(questionRegex)]
  
  return matches.map((match, index) => {
    const rawText = match[2].trim()
    const { cleanText, options } = extractOptions(rawText)
    
    return {
      text: cleanText,
      options: options,
    }
  }).filter(q => Object.keys(q.options).length > 0)
    .map((q, index) => ({
      ...q,
      id: (index + 1).toString()
    }))
}

const extractOptions = (text) => {
  // Look for options in format: A) content B) content ... or A. content B. content ...
  const optionRegex = /(?:\s|^)([A-D])[\.\-\)]\s*(.*?)(?=(?:\s+[A-D][\.\-\)])|$)/gs
  const matches = [...text.matchAll(optionRegex)]
  
  if (matches.length === 0) {
    return { cleanText: text, options: {} }
  }

  const options = {}
  let cleanText = text
  
  matches.forEach(match => {
    options[match[1]] = match[2].trim()
    // Remove the option string from the clean text to get just the question prompt
    cleanText = cleanText.replace(match[0], '')
  })
  
  return { cleanText: cleanText.trim(), options }
}

export const parseAnswers = (text) => {
  // Handle multiple answer formats: 1-A, 1. A, 1)A, 1:A, 1 A, etc.
  // Support for A-E and case-insensitivity
  const answerRegex = /(\d+)\s*[\.\-\)\:]?\s*([A-Ea-e])/g
  const matches = [...text.matchAll(answerRegex)]
  const answers = {}
  
  matches.forEach(match => {
    answers[match[1]] = match[2].toUpperCase()
  })
  
  return answers
}

export const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
