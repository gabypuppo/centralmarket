'use client'
import { isCentralMarketUser } from '@/auth/authorization'
import Dropzone from '@/components/file/Dropzone'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Separator } from '@/components/ui/Separator'
import { useUser } from '@/contexts/UserContext'
import { type OrderProduct } from '@/db/orders'
import type { DeliveryPoint } from '@/db/organizations'
import { cn } from '@/utils'
import { addAttachmentsAction, addHistoryAction, createOrderWithProductsAction, sendMailOrderCreatedAction, sendMailOrderCreatedCentralMarketAction } from '@/utils/actions'
import { useRouter } from 'next/navigation'
import React, { type DetailedHTMLProps, type FormHTMLAttributes, useEffect, useState } from 'react'

interface Props extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  deliveryPoints: DeliveryPoint[]
}

type PartialOrderProduct = Omit<OrderProduct, 'id' | 'orderId'> & { key: number }

const PRODUCT_TEMPLATE: PartialOrderProduct = Object.freeze({
  product: '',
  quantity: 0,
  quantityUnit: '',
  estimatedCost: 0,
  estimatedCostCurrency: 'ars',
  key: Date.now(),
  productNotes: ''
})

export default function OrderForm({ deliveryPoints, className, ...formProps }: Props) {
  const router = useRouter()
  const { user } = useUser()

  const [title, setTitle] = useState('')
  const [products, setProducts] = useState<PartialOrderProduct[]>([{ ...PRODUCT_TEMPLATE }])
  const [deliveryPointId, setDeliveryPointId] = useState<number>()
  const [shippingMethod, setShippingMethod] = useState<string>()
  const [shippingDateString, setShippingDateString] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)
  const [finalClient, setFinalClient] = useState('')
  const [finalAddress, setFinalAddress] = useState('')
  const [isShippingDateInvalid, setIsShippingDateInvalid] = useState(false)
  const [files, setFiles] = useState<File[]>()

  const addProduct = () => {
    setProducts((products) => [...products, { ...PRODUCT_TEMPLATE, key: Date.now() }])
  }

  const removeProduct = (index: number) => {
    setProducts((products) => products.filter((_, i) => i !== index))
  }

  const editProduct = <K extends keyof PartialOrderProduct>(
    index: number,
    key: K,
    value: PartialOrderProduct[K]
  ) => {
    const newProducts = [...products]
    newProducts[index][key] = value

    setProducts(newProducts)
  }

  useEffect(() => {
    if (!shippingDateString) return

    const date = new Date(shippingDateString)
    const now = new Date()
    const minDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 días en el futuro

    const day = date.getDay()
    if (day === 5 || day === 6) {
      setIsShippingDateInvalid(true)
      return
    } 
    setIsShippingDateInvalid(date <= minDate)
  }, [shippingDateString])

  const handleSubmit = () => {
    if (isUploading || !user || !deliveryPointId || !shippingMethod || !shippingDateString || !finalAddress ) return
    setIsUploading(true)

    createOrderWithProductsAction({
      organizationId: user.organizationId!,
      createdBy: user.id,
      deliveryPointId: deliveryPointId,
      shippingMethod: shippingMethod,
      shippingDate: new Date(shippingDateString),
      notes: '',
      finalClient,
      finalAddress,
      title
    }, products, user.punchout)
      .then((res) => {
        const formData = new FormData()
        files?.forEach((file, i) => {
          formData.append(`file-${i}`, file)
        })

        return Promise.all([
          addAttachmentsAction(res.id, formData),
          addHistoryAction({
            orderId: res.id,
            label: 'Solicitud creada',
            modifiedBy: isCentralMarketUser(user) ? 'Central Market' : 'Usuario'
          }),
          sendMailOrderCreatedAction(
            res.id,
            user.id,
            products.map(p => ({
              ...p, id: 0, orderId: res.id
            })),
            new Date()
          ),
          sendMailOrderCreatedCentralMarketAction(
            res.id,
            products.map(p => ({
              ...p, id: 0, orderId: res.id
            })),
            new Date()
          )
        ])
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsUploading(false)
      })

    router.prefetch('./')
    router.push('./')
  }

  const handleFileDrop = (files: File[]) => {
    setFiles(files)
  }

  if (!user) return
  return (
    <form
      action={handleSubmit}
      className={cn(className, 'flex flex-col rounded p-4 shadow')}
      {...formProps}
    >
      <div className="left-0 top-0 bg-gray-50 p-5">
        { shippingDateString && isShippingDateInvalid && <p className="text-xs text-red-500">La fecha de entrega debe ser un dia habil y al menos 5 días en el futuro</p> }
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium">Los campos con * son obligatorios</span>
          <label className="text-xs font-medium flex flex-col gap-2 items-start">
            Titulo
            <Input
              type="text"
              className="font-normal"
              onChange={(e) => {
                const value = e.target.value
                setTitle(value)
              }}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="text-xs font-medium flex flex-col gap-2 items-start">
              Fecha de Entrega*
              <Input
                className="font-normal"
                type="date"
                required
                min={new Date().toLocaleDateString()}
                onChange={(e) => {
                  setShippingDateString(e.target.value)
                }}
              />
            </label>
            <label className="text-xs font-medium flex flex-col gap-2 items-start">
              Método de Envío*
              <Select
                className="text-base font-normal min-w-40"
                placeholder="Método de Envío"
                required
                options={[
                  {
                    items: [
                      {
                        value: 'Puesto en Sucursal',
                        label: 'Puesto en Sucursal'
                      },
                      {
                        value: 'A Retirar',
                        label: 'A Retirar'
                      },
                      {
                        value: 'Envío Incluido',
                        label: 'Envío Incluido'
                      }
                    ]
                  }
                ]}
                onValueChange={(value) => {
                  setShippingMethod(value)
                }}
              />
            </label>
            <label className="text-xs font-medium flex flex-col gap-2 items-start">
              Punto de Entrega* 
              <Select
                className="text-base font-normal min-w-40"
                placeholder="Punto de Entrega"
                required
                options={[
                  {
                    items: deliveryPoints.map((deliveryPoint) => ({
                      value: `${deliveryPoint.id}`,
                      label: deliveryPoint.name ?? ''
                    }))
                  }
                ]}
                onValueChange={(value) => {
                  const id = parseInt(value)
                  setDeliveryPointId(id)
                }}
              />
            </label>
          </div>
          <label className="text-xs font-medium flex flex-col gap-2 items-start">
            Cliente Final*
            <Input
              type="text"
              className="font-normal"
              onChange={(e) => {
                const value = e.target.value
                setFinalClient(value)
              }}
            />
          </label>
          <label className="text-xs font-medium flex flex-col gap-2 items-start">
            Destino final*
            <Input 
              type="text"
              className="font-normal"
              onChange={(e) => {
                const value = e.target.value
                setFinalAddress(value)
              }}
            />
          </label>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap pt-4">
          <h2 className="font-semibold text-2xl text-nowrap pt-6">Agregar un producto</h2>
          <Button className="self-end text-xs mt-4" type="button" onClick={addProduct}>
            +
          </Button>
        </div>
        <Separator className="mt-6" />
      </div>
      <div className="flex flex-col gap-10 p-5">
        {products.map((product, i, arr) => {
          return (
            <React.Fragment key={product.key}>
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex gap-4 flex-wrap">
                  <label className="flex-1 max-w-96 text-xs font-medium flex flex-col gap-2 items-start">
                    Producto* 
                    <Input
                      className="font-normal"
                      name={`producto-${i}`}
                      required
                      defaultValue={product.product ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        editProduct(i, 'product', value)
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex-1 max-w-32 text-xs font-medium flex flex-col gap-2 items-start">
                    Cantidad*
                    <Input
                      className="font-normal"
                      type="number"
                      name={`cantidad-${i}`}
                      required min={1}
                      defaultValue={product.quantity ?? 0}
                      onChange={(e) => {
                        let value = parseInt(e.target.value)
                        if (Number.isNaN(value)) value = 0
                        editProduct(i, 'quantity', value)
                      }}
                    />
                  </label>
                  <label className="flex-1 min-w-32 text-xs font-medium flex flex-col gap-2 items-start">
                    Unidad*
                    <Select
                      className="font-normal w-fit"
                      name={`unidad-${i}`}
                      required
                      defaultValue={product.quantityUnit ?? 'kg'}
                      options={[
                        {
                          items: [
                            { value: 'kg', label: 'Kilogramo' },
                            { value: 'm', label: 'Metros' },
                            { value: 'm2', label: 'Metro cuadrado' },
                            { value: 'm3', label: 'Metro cúbico' },
                            { value: 'l', label: 'Litros' },
                            { value: 'kWh', label: '1000 Kilowatt hora' },
                            { value: 'u', label: 'Unidad' },
                            { value: 'par', label: 'Par' },
                            { value: 'docena', label: 'Docena' },
                            { value: 'ct', label: 'Quilate' },
                            { value: 'millar', label: 'Millar' },
                            { value: 'g', label: 'Gramo' },
                            { value: 'mm', label: 'Milímetro' },
                            { value: 'mm3', label: 'Milímetro cúbico' },
                            { value: 'km', label: 'Kilómetro' },
                            { value: 'hl', label: 'Hectolitro' },
                            { value: 'cm', label: 'Centímetro' },
                            { value: 'cm3', label: 'Centímetro cúbico' },
                            { value: 'ton', label: 'Tonelada' },
                            { value: 'hm3', label: 'Hectómetro cúbico' },
                            { value: 'km3', label: 'Kilómetro cúbico' },
                            { value: 'µg', label: 'Microgramo' },
                            { value: 'ng', label: 'Nanogramo' },
                            { value: 'mg', label: 'Miligramo' },
                            { value: 'ml', label: 'Mililitro' }
                          ]
                        }
                      ]}
                      onValueChange={(value) => {
                        editProduct(i, 'quantityUnit', value)
                      }
                      }
                      placeholder={''}
                    />

                  </label>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex-1 max-w-32 text-xs font-medium flex flex-col gap-2 items-start">
                    Valor Estimado*
                    <Input
                      className="font-normal"
                      type="number"
                      name={`valor-${i}`}
                      required
                      min={1}
                      defaultValue={product.estimatedCost ?? ''}
                      onChange={(e) => {
                        let value = parseInt(e.target.value)
                        if (Number.isNaN(value)) value = 0
                        editProduct(i, 'estimatedCost', value)
                      }}
                    />
                  </label>
                  <label className="flex-1 min-w-32 text-xs font-medium flex flex-col gap-2 items-start">
                    Moneda
                    <Select
                      className="font-normal flex-1 w-20"
                      name={`moneda-${i}`}
                      placeholder="Moneda"
                      required
                      defaultValue={product.estimatedCostCurrency ?? 'ars'}
                      options={[
                        {
                          items: [
                            {
                              value: 'ars',
                              label: 'ARS'
                            },
                            {
                              value: 'usd',
                              label: 'USD'
                            }
                          ]
                        }
                      ]}
                      onValueChange={(value) => {
                        editProduct(i, 'estimatedCostCurrency', value)
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex-1 text-xs font-medium flex flex-col gap-2 items-start">
                    Notas de producto
                    <Input
                      className="font-normal"
                      type="text"
                      name={`productNotes-${i}`}
                      defaultValue={product.productNotes ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        editProduct(i, 'productNotes', value)
                      }}
                    />
                  </label>
                </div>
                <Button
                  type="button"
                  className="mt-8 self-end"
                  variant="destructive"
                  onClick={() => removeProduct(i)}
                >
                  Eliminar Producto
                </Button>
              </div>
              {i !== arr.length - 1 && <Separator />}
            </React.Fragment>
          )
        })}
      </div>
      <div className="flex flex-col gap-6 p-5">
        <h3 className="font-semibold text-2xl text-nowrap">Adjuntar Archivos</h3>
        <Dropzone onChange={handleFileDrop} />
      </div>
      <Button
        type="submit"
        className="mt-8"
        disabled={
          !deliveryPointId ||
          !shippingDateString ||
          !finalClient ||
          !products.length ||
          !finalAddress ||
          isShippingDateInvalid ||
          isUploading
        }
      >
        PRESUPUESTAR
      </Button>
    </form>
  )
}