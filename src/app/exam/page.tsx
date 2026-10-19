import React from "react";
import { ExamSession } from "@/components/exam/ExamSession";

export const metadata = {
  title: "TEM Examination Preparation — TEM-AI",
  description:
    "Prepare for university materials science examinations: 2 mark, 5 mark, 10 mark, and Viva Voce questions grounded in Barry Carter.",
};

export default function ExamPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <ExamSession />
    </div>
  );
}
