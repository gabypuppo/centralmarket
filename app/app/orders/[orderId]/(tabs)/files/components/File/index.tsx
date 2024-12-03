'use client'
import { isCentralMarketUser } from '@/auth/authorization'
import FileDisplay from '@/components/file/FileDisplay'
import { useUser } from '@/contexts/UserContext'
import type { OrderFile } from '@/db/orders'
import { arrayBufferToFile } from '@/utils'
import { addHistoryAction, removeFileAction } from '@/utils/actions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface FileProps {
  orderFile: OrderFile
}
export default function File({ orderFile }: FileProps) {
  const router = useRouter()
  const { user } = useUser()
  const [file, setFile] = useState<File>()
    
  useEffect(() => {
    if (!orderFile || !orderFile.fileUrl) return
    fetch(orderFile.fileUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) =>
        arrayBufferToFile(arrayBuffer, orderFile.fileName ?? '', orderFile.mimeType ?? '')
      )
      .then((file) => {
        setFile(file)
      })
  }, [orderFile])

  const handleRemove = async () => {
    if (!user) return
    const removePromise = removeFileAction(orderFile.id)
    const historyPromise = await addHistoryAction({
      orderId: orderFile.orderId,
      label: 'Archivo eliminado',
      modifiedBy: isCentralMarketUser(user) ? 'Central Market' : `${user.firstName} ${user.lastName}`
    })

    await Promise.all([removePromise, historyPromise])
    router.refresh()
  }

  const isSenderOrg = user?.organizationId === orderFile.senderId

  return file ? (
    <div className="flex flex-col items-center gap-4">
      <a href={orderFile.fileUrl ?? ''} target="_blank" className="cursor-pointer">
        <FileDisplay file={file} remove={isSenderOrg ? handleRemove : undefined} />
      </a>
    </div>
  ) : (
    <p>loading...</p>
  )
}
