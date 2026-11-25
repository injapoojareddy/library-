import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { KnowledgeBaseSection } from './components/KnowledgeBaseSection';
import { QuestionSolver } from './components/QuestionSolver';
import { RuleEngineSection } from './components/RuleEngineSection';
import {
  DEFAULT_LIBRARY_TEXT,
  DEFAULT_WORKED_EXAMPLE,
} from './data/libraryData';
import { evaluateQuestion, parseKnowledgeBase } from './utils/qaEngine';

export default function App() {
  const [libraryText, setLibraryText] = useState(DEFAULT_LIBRARY_TEXT);
  const [questionInput, setQuestionInput] = useState(
    DEFAULT_WORKED_EXAMPLE.question,
  );
  const [activeQuestion, setActiveQuestion] = useState(
    DEFAULT_WORKED_EXAMPLE.question,
  );

  const kbResult = useMemo(() => parseKnowledgeBase(libraryText), [libraryText]);
  const finalResult = useMemo(
    () => evaluateQuestion(activeQuestion, kbResult.entries),
    [activeQuestion, kbResult.entries],
  );

  const handleEditDocument = () => {
    const section = document.getElementById('knowledge-base');
    section?.scrollIntoView({ behavior: 'smooth' });
    const editor = document.getElementById('library-txt-editor');
    if (editor instanceof HTMLTextAreaElement) {
      window.setTimeout(() => editor.focus({ preventScroll: true }), 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onEditDocument={handleEditDocument} />

      <main>
        <QuestionSolver
          question={questionInput}
          onQuestionChange={(value) => {
            setQuestionInput(value);
            setActiveQuestion(value);
          }}
          onSubmitQuestion={(value) => {
            setQuestionInput(value);
            setActiveQuestion(value);
          }}
          finalResult={finalResult}
        />

        <KnowledgeBaseSection
          libraryText={libraryText}
          onLibraryTextChange={setLibraryText}
          kbResult={kbResult}
        />

        <RuleEngineSection />
      </main>
    </div>
  );
}
