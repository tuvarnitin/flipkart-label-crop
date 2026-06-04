import { useState } from "react"
import { PDFDocument, degrees } from "pdf-lib"
import "./App.css"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [file,setFile] = useState(null)

  const cropLabelsOnly = async (file) => {
    try {
      setLoading(true)

      const bytes = await file.arrayBuffer()

      const inputPdf = await PDFDocument.load(bytes)

      const outputPdf = await PDFDocument.create()

      const pageCount = inputPdf.getPageCount()

      for (let i = 0; i < pageCount; i++) {
        const [topPage] = await outputPdf.copyPages(inputPdf, [i])
        const [bottomPage] = await outputPdf.copyPages(inputPdf, [i])

        const { width, height } = topPage.getSize()

        // Portion 1 (Top Area)
        const LEFT = 185
        const RIGHT = 185
        const TOP = 20
        const BOTTOM = 458

        topPage.setCropBox(
          LEFT,
          BOTTOM,
          width - LEFT - RIGHT,
          height - TOP - BOTTOM
        )

        outputPdf.addPage(topPage)
      }

      const pdfBytes = await outputPdf.save()

      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      })

      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `split-${file.name}`
      a.click()

      URL.revokeObjectURL(url)
      setFile(null)
    } catch (error) {
      console.error(error)
      alert("Failed to process PDF")
    } finally {
      setLoading(false)
    }
  }
  const cropLabelAndInvoice = async (file) => {
    try {
      setLoading(true)

      const bytes = await file.arrayBuffer()

      const inputPdf = await PDFDocument.load(bytes)

      const outputPdf = await PDFDocument.create()

      const pageCount = inputPdf.getPageCount()

      for (let i = 0; i < pageCount; i++) {
        const [topPage] = await outputPdf.copyPages(inputPdf, [i])
        const [bottomPage] = await outputPdf.copyPages(inputPdf, [i])

        const { width, height } = topPage.getSize()

        // Portion 1 (Top Area)
        const PART_1_LEFT = 185
        const PART_1_RIGHT = 185
        const PART_1_TOP = 20
        const PART_1_BOTTOM = 458

        // Portion 2 (Bottom Area)
        const PART_2_LEFT = 0
        const PART_2_RIGHT = 0
        const PART_2_TOP = 380
        const PART_2_BOTTOM = 0

        topPage.setCropBox(
          PART_1_LEFT,
          PART_1_BOTTOM,
          width - PART_1_LEFT - PART_1_RIGHT,
          height - PART_1_TOP - PART_1_BOTTOM
        )

        bottomPage.setCropBox(
          PART_2_LEFT,
          PART_2_BOTTOM,
          width - PART_2_LEFT - PART_2_RIGHT,
          height - PART_2_TOP - PART_2_BOTTOM
        )

        bottomPage.setRotation(degrees(90))

        outputPdf.addPage(topPage)
        outputPdf.addPage(bottomPage)
      }

      const pdfBytes = await outputPdf.save()

      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      })

      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `split-${file.name}`
      a.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      alert("Failed to process PDF")
    } finally {
      setLoading(false)
      setFile(null)
    }
  }

  const handleFileChange = (e) => {
    const file = [...e.target.files][0]

    if (!file) return
    setFile(()=>{
      e.target.value = null
      return file
    })
  }

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col items-center pt-20 gap-8">

      <h1 className="text-3xl font-bold text-slate-800 tracking-tight decoration-slate-400 select-none">
        Flipkart Label Splitter
      </h1>

      <div className="w-80 flex flex-col items-center justify-center text-center gap-3 rounded-xl bg-white p-5 shadow-md border border-slate-200">

        {/* Upload Box */}
        <label
          className={`w-full h-28 flex flex-col items-center justify-center cursor-pointer rounded-lg border transition-all duration-200
        ${file ? "border-emerald-400 bg-emerald-50" : "border-slate-300 bg-slate-50 hover:border-slate-400"}
        text-slate-500 font-medium`}
        >
          <span className="text-sm">
            {loading ? "Processing PDF..." : "Click to upload PDF"}
          </span>

          <input
            hidden
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </label>

        {/* Primary Button */}
        <button
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          onClick={() => cropLabelsOnly(file)}
          disabled={!file || loading}
        >
          Extract Labels
        </button>

        {/* Secondary Button */}
        <button
          className="w-full px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          onClick={() => cropLabelAndInvoice(file)}
          disabled={!file || loading}
        >
          Label + Invoice
        </button>
      </div>
    </div>
  );
}