/** @type {import('next').NextConfig} */

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

module.exports = {
  experimental: { esmExternals: 'loose' },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]
    return config
  },
  eslint: { dirs: ['app', 'assets', 'auth', 'db', 'utils', 'components', 'contexts'] }
}
