"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Check,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { EXAM_QUESTIONS, ExamQuestion } from "@/data/demo-questions";

export function ExamSession() {
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>("");
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    good: string[];
    missing: string[];
    advice: string;
  } | null>(null);

  // Filter question bank
  const filteredQuestions = EXAM_QUESTIONS.filter((q) => {
    if (selectedTopic !== "All" && q.topic !== selectedTopic) return false;
    if (selectedType !== "All" && q.type !== selectedType) return false;
    return true;
  });

  const question: ExamQuestion | undefined =
    filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleEvaluateAnswer = () => {
    if (!question) return;

    if (question.type === "MCQ") {
      if (selectedMcqOption === null) return;
      const isCorrect = selectedMcqOption === question.correctOptionIndex;
      const awarded = isCorrect ? question.marks : 0;
      setScore(awarded);
      setFeedback({
        good: isCorrect
          ? ["Selected correct answer option", ...question.gradingCriteria.goodPoints]
          : [],
        missing: isCorrect
          ? []
          : [
              `Selected incorrect option. Correct answer was: "${question.options?.[question.correctOptionIndex || 0]}"`,
            ],
        advice: isCorrect
          ? "Excellent! You have mastered this concept."
          : `Review ${question.gradingCriteria.carterCitation} to reinforce this principle.`,
      });
      setIsEvaluated(true);
      if (isCorrect) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      return;
    }

    // Evaluate open-ended questions (2 mark, 5 mark, 10 mark, viva)
    const text = studentAnswer.toLowerCase();
    let awarded = 0;
    const good: string[] = [];
    const missing: string[] = [];

    // Keyword detection matching Carter criteria
    question.gradingCriteria.goodPoints.forEach((criterion) => {
      // Pick keywords
      const words = criterion.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const matches = words.filter((w) => text.includes(w));
      if (matches.length >= 1 || text.length > 150) {
        good.push(criterion);
        awarded += question.marks / question.gradingCriteria.goodPoints.length;
      } else {
        missing.push(criterion);
      }
    });

    // Ensure baseline score if substantial answer provided
    if (studentAnswer.length > 50 && awarded === 0) {
      awarded = Math.max(1, question.marks * 0.4);
    }
    const finalScore = Math.min(question.marks, Math.max(0, Math.round(awarded * 2) / 2));
    setScore(finalScore);

    setFeedback({
      good: good.length > 0 ? good : ["Submitted plausible response"],
      missing:
        missing.length > 0
          ? missing
          : ["Ensure exact mathematical notation is written out explicitly"],
      advice: `To attain full marks in university examinations, structure answers with: 1) Physical principle; 2) Key equation; 3) Objective aperture or diffraction ray condition; 4) Reference to ${question.gradingCriteria.carterCitation}.`,
    });

    setIsEvaluated(true);

    if (finalScore >= question.marks * 0.8) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleNextQuestion = () => {
    setIsEvaluated(false);
    setStudentAnswer("");
    setSelectedMcqOption(null);
    setFeedback(null);
    setCurrentQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  return (
    <div className="space-y-6">
      {/* Exam Header */}
      <div className="border-b-2 border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black font-sans uppercase">
            04 / EXAMINATION PREPARATION & MARKING RUBRICS
          </h2>
          <p className="text-xs font-mono text-slate-600">
            Assessed Against Barry Carter Examination Standards (2, 5, 10 Marks & Viva Voce)
          </p>
        </div>
        <ScientificBadge variant="amber" hasDot>
          CARTER MARKING SCHEME
        </ScientificBadge>
      </div>

      {/* Filter Toolbar */}
      <div className="brutal-border bg-surface-warm p-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-800 uppercase">Topic:</span>
          {["All", "Electron Optics", "Diffraction", "Imaging & Contrast", "Defects & Dislocations"].map(
            (t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedTopic(t);
                  setCurrentQuestionIndex(0);
                  setIsEvaluated(false);
                }}
                className={`px-2 py-0.5 border text-[11px] ${
                  selectedTopic === t
                    ? "bg-foreground text-background font-bold border-border"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 uppercase">Type:</span>
          {["All", "MCQ", "2 MARK", "5 MARK", "10 MARK", "VIVA"].map((typ) => (
            <button
              key={typ}
              onClick={() => {
                setSelectedType(typ);
                setCurrentQuestionIndex(0);
                setIsEvaluated(false);
              }}
              className={`px-2 py-0.5 border text-[11px] ${
                selectedType === typ
                  ? "bg-[#FF5722] text-white font-bold border-border"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {typ}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card & Answering Area */}
      {question ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question & Answer Box */}
          <div className="lg:col-span-7 space-y-4">
            <BrutalCard
              variant="default"
              shadowSize="md"
              titleBar={`QUESTION ${currentQuestionIndex + 1} OF ${filteredQuestions.length}`}
              titleBarBadge={`${question.marks} MARKS • ${question.type}`}
              className="bg-white"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="bg-surface-warm px-2 py-0.5 border border-border font-bold text-slate-800">
                    {question.topic}
                  </span>
                  <span className="text-slate-500 font-bold">
                    DIFFICULTY: {question.difficulty.toUpperCase()}
                  </span>
                </div>

                <div className="text-sm font-sans font-bold text-slate-900 leading-relaxed">
                  {question.questionText}
                </div>

                {/* MCQ Options */}
                {question.type === "MCQ" && question.options && (
                  <div className="space-y-2 pt-2">
                    {question.options.map((opt, i) => (
                      <button
                        key={i}
                        disabled={isEvaluated}
                        onClick={() => setSelectedMcqOption(i)}
                        className={`w-full text-left p-2.5 border-2 font-mono text-xs flex items-center gap-3 transition-all ${
                          selectedMcqOption === i
                            ? "bg-foreground text-background border-border font-bold shadow-neo-xs"
                            : "bg-white hover:bg-surface-warm border-slate-300 text-slate-800"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-none border border-current flex items-center justify-center font-bold text-[10px]">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Free Text Input (2, 5, 10 mark, viva) */}
                {question.type !== "MCQ" && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-mono font-bold text-slate-700 uppercase block">
                      Your Examination Answer:
                    </label>
                    <textarea
                      rows={6}
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      disabled={isEvaluated}
                      className="w-full p-3 brutal-border bg-white text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      placeholder="Write your explanation here: state the physical principle, relevant equations (e.g. R*d = lambda*L or g.b = 0), and beam conditions..."
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <div className="flex gap-2">
                    {!isEvaluated ? (
                      <BrutalButton
                        variant="primary"
                        size="md"
                        onClick={handleEvaluateAnswer}
                        disabled={
                          question.type === "MCQ"
                            ? selectedMcqOption === null
                            : !studentAnswer.trim()
                        }
                        icon={<Sparkles className="w-4 h-4" />}
                      >
                        SUBMIT & GRADE
                      </BrutalButton>
                    ) : (
                      <BrutalButton
                        variant="cyan"
                        size="md"
                        onClick={handleNextQuestion}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        NEXT QUESTION
                      </BrutalButton>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="text-xs font-mono text-slate-600 hover:text-foreground flex items-center gap-1"
                  >
                    Skip Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </BrutalCard>
          </div>

          {/* Grading Evaluation Report & Model Answer */}
          <div className="lg:col-span-5 space-y-4">
            {isEvaluated && feedback ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Score Banner */}
                <div className="brutal-border bg-foreground text-background p-4 shadow-neo-md flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      OFFICIAL ASSESSMENT SCORE
                    </div>
                    <div className="text-3xl font-black font-mono text-[#00D2FF]">
                      {score} / {question.marks}{" "}
                      <span className="text-sm text-slate-300">MARKS</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-1 border ${
                        score >= question.marks * 0.7
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-black"
                      }`}
                    >
                      {score >= question.marks * 0.7 ? "PASSED" : "NEEDS REVISION"}
                    </span>
                  </div>
                </div>

                {/* Good vs Missing Checklist */}
                <BrutalCard variant="default" shadowSize="sm" className="bg-white">
                  <div className="space-y-3 font-mono text-xs">
                    {/* GOOD POINTS */}
                    <div className="space-y-1">
                      <div className="font-bold text-emerald-800 uppercase flex items-center gap-1 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Points Rewarded (Good):
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] font-sans text-slate-800">
                        {feedback.good.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>

                    {/* MISSING POINTS */}
                    {feedback.missing.length > 0 && (
                      <div className="space-y-1 pt-2 border-t">
                        <div className="font-bold text-red-800 uppercase flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Missing or Incomplete Points:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] font-sans text-slate-700">
                          {feedback.missing.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </BrutalCard>

                {/* Official Model Answer */}
                <BrutalCard
                  variant="warm"
                  shadowSize="sm"
                  titleBar="OFFICIAL CARTER MODEL ANSWER"
                  titleBarBadge={question.gradingCriteria.carterCitation}
                  className="bg-[#F4EFE6]"
                >
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white brutal-border font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-line">
                      {question.modelAnswer}
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 pt-1">
                      📖 Grounding: {question.gradingCriteria.carterCitation}
                    </div>
                  </div>
                </BrutalCard>
              </div>
            ) : (
              /* Awaiting submission placeholder card */
              <BrutalCard variant="warm" shadowSize="md" className="bg-[#F4EFE6]">
                <div className="space-y-3 font-mono text-xs">
                  <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#FF5722]" />
                    How Answers are Evaluated:
                  </div>
                  <p className="text-[11px] font-sans text-slate-700 leading-relaxed">
                    TEM-AI compares your response against the pedagogical structure of Williams & Carter. For full marks, ensure you state:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 font-sans">
                    <li>The underlying electron scattering mechanism</li>
                    <li>The relevant mathematical relationship</li>
                    <li>Ray paths or aperture conditions in the back focal plane</li>
                  </ul>
                  <div className="p-2 bg-white brutal-border text-[10px] text-slate-600">
                    💡 Click <strong>"Submit & Grade"</strong> to see detailed scoring, missing points, and the textbook model answer.
                  </div>
                </div>
              </BrutalCard>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center brutal-border bg-white font-mono text-xs">
          No questions found matching your filter criteria. Try selecting "All" topics or types.
        </div>
      )}
    </div>
  );
}
