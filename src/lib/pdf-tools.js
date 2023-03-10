import { readFile } from "fs";
import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import { promisify } from "util";
import { getPDFWritableStream } from "./fs-tools.js"

export const getPDFReadableStream = media => {
    const fonts = {
        Helvetica: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-BoldOblique",
        },
    }
    const printer = new PdfPrinter(fonts)

    const docDefinition = {
        content: [media.title, media.year],
        defaultStyle: {
            font: "Helvetica",
        },
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
    pdfReadableStream.end()

    return pdfReadableStream
}

export const asyncPDFGeneration = async media => {
    const source = getPDFReadableStream(media)
    const destination = getPDFWritableStream("media.pdf")

    const promiseBasedPipeline = promisify(pipeline)
    await promiseBasedPipeline(source, destination)
}