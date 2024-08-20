import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
pdfjs.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@4.4.168/legacy/build/pdf.worker.min.mjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetterOfString(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getEmailDomain(string: string) {
  const index = string.indexOf('@')
  return string.slice(index + 1)
}

export function renderPDFPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const arrayBuffer = e.target?.result
      if (arrayBuffer) {
        const pdfData = new Uint8Array(arrayBuffer as ArrayBuffer)
        pdfjs
          .getDocument({ data: pdfData })
          .promise.then((pdf) => {
            pdf
              .getPage(1)
              .then((page) => {
                const scale = 1.5
                const viewport = page.getViewport({ scale })
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')!
                canvas.height = viewport.height
                canvas.width = viewport.width

                const renderContext = {
                  canvasContext: context,
                  viewport: viewport
                }

                page
                  .render(renderContext)
                  .promise.then(() => {
                    resolve(canvas.toDataURL())
                  })
                  .catch((err) => reject(err))
                  .finally(() => {
                    pdf.destroy()
                  })
              })
              .catch((err) => reject(err))
          })
          .catch((err) => reject(err))
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

export function arrayBufferToFile(arrayBuffer: ArrayBuffer, fileName: string, mimeType: string) {
  // Create a new Blob object using the ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: mimeType })

  // Create a File object from the Blob
  const file = new File([blob], fileName, { type: mimeType })

  return file
}
