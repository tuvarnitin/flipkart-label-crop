import { useState } from "react"
import { PDFDocument, degrees } from "pdf-lib"
import MeeshoCard from "./components/MeeshoCard"
import FlipcartCard from "./components/FlipcartCard"

export default function App() {
  return (
    <div className="h-screen w-screen bg-slate-100 p-4 px-10 grid grid-cols-5 items-center justify-center grid-rows-2 gap-4">
      <FlipcartCard />
      <MeeshoCard />
    </div>
  );
}