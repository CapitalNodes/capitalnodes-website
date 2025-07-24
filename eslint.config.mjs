"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function Page() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      setCount((prev) => prev + 1);
    }
  }, [isInView]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-8">
      <h1 className="text-4xl font-bold mb-6">Willkommen bei Capital Nodes</h1>
      <p className="text-lg mb-4">Diese Section wird gezählt, sobald sie im Viewport erscheint.</p>

      <div
        ref={ref}
        className="mt-32 h-64 w-full max-w-xl bg-white shadow-md flex items-center justify-center rounded-xl"
      >
        <p className="text-2xl font-semibold">In View Count: {count}</p>
      </div>
    </main>
  );
}
