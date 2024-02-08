"use client";

import { SubmitForm } from "@/components/submit-form";
import useStarsAnimation from "./hook";

export default function Home() {
  useStarsAnimation();

  return (
    <main className="relative h-full overflow-hidden">
      <SubmitForm />
    </main>
  );
}
