import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";

import { introQuestions, flow1Questions, flow2Questions, type Option, type QuizItem } from "@/lib/quiz-data";
import { QuizProgress } from "@/components/quiz/Progress";
import { QuestionScreen } from "@/components/quiz/QuestionScreen";
import { InsertScreen } from "@/components/quiz/InsertScreen";
import { LoadingScreen } from "@/components/quiz/LoadingScreen";
import { ResultScreen } from "@/components/quiz/ResultScreen";
import { IntroScreen } from "@/components/quiz/IntroScreen";
import { LeadForm, type Lead } from "@/components/quiz/LeadForm";
import { PostResultFlow } from "@/components/quiz/PostResultFlow";
import { trackStep } from "@/lib/analytics";
import { captureUtms } from "@/lib/utm";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa da Identidade Homossexual — Diagnóstico Gratuito" },
      {
        name: "description",
        content:
          "Quiz gratuito que ajuda pais e pessoas em conflito de identidade a compreender o que pode estar por trás da homossexualidade e do afastamento familiar.",
      },
      { property: "og:title", content: "Mapa da Identidade Homossexual" },
      {
        property: "og:description",
        content:
          "Descubra o que pode estar por trás dos conflitos de identidade e dos afastamentos familiares. Diagnóstico personalizado em menos de 3 minutos.",
      },
    ],
  }),
  component: Index,
});

type Phase = "intro" | "questions" | "loading" | "result" | "lead" | "post";

function track(step: string) {
  trackStep({ data: { step } }).catch(() => {});
}

function Index() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [flow, setFlow] = useState<"flow1" | "flow2" | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lead, setLead] = useState<Lead | null>(null);
  const halfwayTracked = useRef(false);

  // Rastreia page_view uma vez
  useEffect(() => { captureUtms(); track("1_page_view"); }, []);

  const questions: QuizItem[] = useMemo(() => {
    if (!flow) return introQuestions;
    return [...introQuestions, ...(flow === "flow1" ? flow1Questions : flow2Questions)];
  }, [flow]);

  const current = questions[step];
  const total = (flow ? (flow === "flow1" ? flow1Questions.length : flow2Questions.length) : flow2Questions.length) + introQuestions.length;
  const progress = phase === "questions" ? Math.round((step / total) * 100) : 0;

  // Rastreia 50% das perguntas
  useEffect(() => {
    if (phase === "questions" && progress >= 50 && !halfwayTracked.current) {
      halfwayTracked.current = true;
      track("3_halfway");
    }
  }, [phase, progress]);

  // Rastreia mudanças de fase
  useEffect(() => {
    if (phase === "loading")  track("4_questions_done");
    if (phase === "lead")     track("5_lead_view");
    if (phase === "result")   track("7_result_view");
  }, [phase]);

  function reset() {
    setPhase("intro");
    setFlow(null);
    setStep(0);
    setAnswers({});
    setLead(null);
    halfwayTracked.current = false;
  }

  function handleStart() {
    track("2_quiz_started");
    setPhase("questions");
    setStep(0);
  }

  function handleAnswer(opt: Option) {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.id]: opt.label }));

    if (current.id === "relation" && opt.next) {
      setFlow(opt.next);
      setStep((s) => s + 1);
      return;
    }

    const nextStep = step + 1;
    const limit = flow
      ? introQuestions.length + (flow === "flow1" ? flow1Questions.length : flow2Questions.length)
      : introQuestions.length;

    if (nextStep >= limit) {
      setPhase("loading");
    } else {
      setStep(nextStep);
    }
  }

  function handleBack() {
    if (phase === "intro") return;
    if (phase === "post") { setPhase("result"); return; }
    if (phase === "lead") { setPhase("questions"); return; }
    if (phase === "result" || phase === "loading") {
      setPhase("questions");
      return;
    }

    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 sm:px-6 py-6 sm:py-10">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            disabled={phase === "intro"}
            className="grid place-items-center w-9 h-9 rounded-full border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            {phase !== "intro" && (
              <QuizProgress value={phase === "questions" ? progress : 100} rainbow />
            )}

          </div>
        </div>

        <main className="pt-2 pb-16">
          {phase === "intro" && <IntroScreen onStart={handleStart} />}

          {phase === "questions" && current && current.kind !== "insert" && (
            <QuestionScreen
              key={current.id}
              question={current}
              onSelect={handleAnswer}
            />
          )}

          {phase === "questions" && current && current.kind === "insert" && (
            <InsertScreen
              key={current.id}
              insert={current}
              onContinue={() => {
                const nextStep = step + 1;
                const limit = flow
                  ? introQuestions.length + (flow === "flow1" ? flow1Questions.length : flow2Questions.length)
                  : introQuestions.length;
                if (nextStep >= limit) setPhase("loading");
                else setStep(nextStep);
              }}
            />
          )}

          {phase === "loading" && (
            <LoadingScreen onDone={() => setPhase("lead")} />
          )}

          {phase === "lead" && (
            <LeadForm flow={flow} onSubmit={(l) => { setLead(l); setPhase("result"); }} />
          )}

          {phase === "result" && flow && (
            <ResultScreen flow={flow} onRestart={reset} onContinue={() => setPhase("post")} />
          )}

          {phase === "post" && flow && (
            <PostResultFlow flow={flow} name={lead?.name ?? ""} onRestart={reset} />
          )}

        </main>
      </div>
    </div>
  );
}
