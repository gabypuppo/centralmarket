'use client'
import { useCallback, useEffect, useState } from 'react'
import { type Accept, useDropzone } from 'react-dropzone'
import FileDisplay from '../FileDisplay'
import { Button } from '@/components/ui/Button'

interface DropzoneProps {
  onSubmit?: (formData: FormData) => Promise<void> | void
  onChange?: (files: File[]) => Promise<void> | void
  accept?: Accept
}

export default function Dropzone({ onSubmit, onChange, accept }: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isHandling, setIsHandling] = useState(false)

  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
    setFiles((files) => [...files, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone(
    Object.assign({
      onDrop,
      maxSize: 5e6 //5MB
    }, { accept })
  )

  useEffect(() => {
    if (!onChange) return
    const res = onChange(files)

    if (res instanceof Promise) {
      res
        .then(() => {})
        .catch((err) => {
          console.error(err)
        })
    }
  }, [onChange, files])

  const handleFiles = () => {
    if (isHandling || !onSubmit) return
    setIsHandling(true)

    const formData = new FormData()
    files.forEach((file, i) => {
      formData.append(`file-${i}`, file)
    })

    const res = onSubmit(formData)

    if (res instanceof Promise) {
      res
        .then(() => {
          setFiles([])
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setIsHandling(false)
        })
    } else {
      setFiles([])
      setIsHandling(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        {...getRootProps()}
        className="min-h-24 w-full border-dashed border-2 p-4 rounded-lg mb-2 cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelte los archivos aquí...</p>
        ) : files.length !== 0 ? (
          <div className="flex gap-8 overflow-auto py-2">
            {files.map((file, i) => (
              <FileDisplay
                key={i}
                file={file}
                remove={() => setFiles((files) => files.filter((_, j) => j !== i))}
              />
            ))}
          </div>
        ) : (
          <p>
            Arrastre &apos;y&apos; suelte algunos archivos aquí o haga clic para seleccionar
            archivos{' '}
            <span className="italic">
              ({accept && Object.values(accept).map((value) => value + ', ')}menor a 5MB).
            </span>
          </p>
        )}
      </div>
      {onSubmit && (
        <Button onClick={handleFiles} disabled={isHandling}>
          Enviar
        </Button>
      )}
    </div>
  )
}
