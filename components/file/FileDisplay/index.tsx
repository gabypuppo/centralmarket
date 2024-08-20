'use client'
import { renderPDFPreview } from '@/utils'
import { Cross2Icon } from '@radix-ui/react-icons'
import { FileIcon } from 'assets/icons'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface IFileDisplay {
  file: File
  remove?: () => Promise<void> | void
}

// To make the component follow the single responsibility principle, abstract the "remove"
export default function FileDisplay({ file, remove }: IFileDisplay) {
  const [previewURI, setPreviewURI] = useState<string | null>()
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (file.type === 'application/pdf') {
      renderPDFPreview(file)
        .then((res) => {
          setPreviewURI(res)
        })
        .catch((err) => console.error(err))
    } else if (file.type.split('/')[0] === 'image') {
      setPreviewURI(URL.createObjectURL(file))
    } else {
      setPreviewURI(null)
    }
  }, [file])

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!remove) return

    setDisabled(true)

    const res = remove()
    if (res instanceof Promise) {
      res.then(() => {
        setDisabled(false)
      })
    } else {
      setDisabled(false)
    }
  }

  return (
    <div
      className="relative w-20 cursor-default"
      title={file.name}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {previewURI ? (
        <Image
          src={previewURI ?? ''}
          alt={`file called "${file.name}"`}
          width={100}
          height={100}
          className="size-20 object-cover object-top cursor-pointer"
        />
      ) : previewURI === null ? (
        <FileIcon className="size-20 p-5" />
      ) : (
        <Loader className="size-20 p-5" />
      )}
      <p className="text-xs text-nowrap overflow-hidden text-ellipsis mt-1">{file.name}</p>

      {remove && (
        <button
          className="size-6 rounded-full bg-red-500 hover:bg-red-400 disabled:bg-red-400 transition-colors flex justify-center items-center absolute right-0 top-0 translate-x-1/4 -translate-y-1/4"
          onClick={(e) => handleRemove(e)}
          disabled={disabled}
        >
          <Cross2Icon color="white" width={17} height={17} />
        </button>
      )}
    </div>
  )
}
