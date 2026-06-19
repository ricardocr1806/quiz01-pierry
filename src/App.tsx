import { useState } from 'react'
import QuizPage from './QuizPage'
import ResultPage from './ResultPage'

type Page = 'quiz' | 'result'

export default function App() {
  const [page, setPage] = useState<Page>('quiz')

  if (page === 'result') return <ResultPage onRestart={() => setPage('quiz')} />
  return <QuizPage onComplete={() => setPage('result')} />
}
