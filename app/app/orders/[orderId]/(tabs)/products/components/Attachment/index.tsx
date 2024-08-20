'use client'
import FileDisplay from '@/components/file/FileDisplay'
import type { OrderAttachment } from '@/db/orders'
import { arrayBufferToFile } from '@/utils'
import { useEffect, useState } from 'react'

export default function Attachment({ attachment }: { attachment: OrderAttachment }) {
  const [file, setFile] = useState<File>()

  useEffect(() => {
    if (!attachment || !attachment.fileUrl) return
    fetch(attachment.fileUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) =>
        arrayBufferToFile(arrayBuffer, attachment.fileName ?? '', attachment.mimeType ?? '')
      )

      .then((file) => {
        setFile(file)
      })
  }, [attachment])

  return (
    <a href={attachment.fileUrl ?? ''} target="_blank" className="cursor-pointer py-2 px-1 rounded border">
      {file && <FileDisplay file={file} />}
    </a>
  )
}
