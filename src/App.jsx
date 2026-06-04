import { useState } from "react"
import { PDFDocument,degrees } from "pdf-lib"
import "./App.css"

export default function App() {
  const [loading, setLoading] = useState(false)

  const processPdf = async (file) => {
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
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    processPdf(file)
    e.target.value = null
  }

  return (
    <>
      <div className="container">
        <h1 style={{ textDecoration: "underline" }}>Flipkart PDF Splitter</h1>
        <div className="section">
          <h3>For Quanitity Orders</h3>
          <label className="upload-btn">
            {loading ? "Processing..." : "Upload PDF"}

            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

    </>
  )
}