import { PDFDocument, degrees } from "pdf-lib"
import React, { useState } from 'react'

const MeeshoCard = ({}) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const cropLabelsOnly = async () => {
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
    const cropLabelAndInvoice = async () => {
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
                const PART_2_LEFT = 25
                const PART_2_RIGHT = 25
                const PART_2_TOP = 365
                const PART_2_BOTTOM = 80

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
        setFile(() => {
            e.target.value = null
            return file
        })
    }

    return (
        <div className="flex flex-col gap-3 items-center h-full  border rounded-2xl px-4 p-4">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center decoration-slate-400 select-none">
                Meesho Label Splitter
            </h1>
            <div className="w-full h-full flex flex-col items-center justify-center text-center gap-3 rounded-xl bg-white p-5 shadow-md border border-slate-200">

                {/* Upload Box */}
                <label
                    className={`w-full h-full flex flex-col items-center justify-center cursor-pointer rounded-lg border transition-all duration-200
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
                    className="w-full px-4 py-2  shrink-0 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    onClick={() => cropLabelsOnly(file)}
                    disabled={!file || loading}
                >
                    Extract Labels
                </button>
            </div>
        </div>
    )
}

export default MeeshoCard