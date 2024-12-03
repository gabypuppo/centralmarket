import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { addFiles, getFiles, getOrderById } from '@/db/orders'
import File from './components/File'
import Dropzone from '@/components/file/Dropzone'
import { revalidatePath } from 'next/cache'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const session = await auth()
  if (!session) return

  const orderId = parseInt(params.orderId)

  const orderPromise = getOrderById(orderId)
  const filesPromise = getFiles(orderId)

  const [order, files] = await Promise.all([orderPromise, filesPromise])

  const upload = async (formData: FormData) => {
    'use server'
    const formFiles = Array.from(formData.values()) as File[]
    await addFiles(order.id, session?.user.organizationId!, formFiles)

    revalidatePath(`/${order.id}/files`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archivos</CardTitle>
        <CardDescription>Intercambia archivos aquí.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-6 overflow-auto p-4 min-h-32 rounded border">
          {files.map((file, i) => (
            <File key={i} orderFile={file} />
          ))}
        </div>
        <h5 className="text-lg font-semibold pt-2">Subir Archivos</h5>
        <Dropzone onSubmit={upload} />
      </CardContent>
    </Card>
  )
}
