if (typeof Promise.withResolvers === 'undefined') {
  if (typeof window !== 'undefined') {
    window.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
  } else {
    global.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
  }
}

// Handle PDF.js worker script URL differently
const pdfjsWorkerSrc = 'pdfjs-dist/legacy/build/pdf.worker.min.js'

if (typeof window !== 'undefined') {
  // Client-side: Set the PDF.js worker source
  const pdfjs = require('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc
}