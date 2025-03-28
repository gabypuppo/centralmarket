import type { MailDataRequired } from '@sendgrid/mail'
import sgMail, { ResponseError } from '@sendgrid/mail'
import { getMailWithUserId, getUserById, type User } from '@/db/users'
import { createVerificationToken } from '@/db/verificationTokens'
import { getOrdersNeedingFollowUp, updateOrder, type Order, type OrderProduct } from '@/db/orders'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const sendEmail = async (msg: MailDataRequired) => {
  try {
    return await sgMail.send(msg)
  } catch (err: any) {
    if (err instanceof Error || err instanceof ResponseError) {
      console.error(JSON.stringify(err))
    }
    console.error(err)
  }
}

export const sendMailBuyerSelected = async (
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date
) => {
  const user = await getMailWithUserId(createdBy)
  const buyer = await getMailWithUserId(assignedBuyerId)
  const emailUser = user?.email
  const emailBuyer = buyer?.email

  if (!emailUser || !emailBuyer) {
    console.error('No se pudo enviar el mail')
    return
  }

  const msgBuyer: MailDataRequired = {
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Comprador asignado - Solicitud #' + orderId,
      title: 'Comprador asignado',
      message:
        'La solicitud número ' + orderId + ' te ha sido asignada. <br><br> <b>Detalles de la solicitud:</b><br><ul><li>Numero de la solicitud: ' + orderId + '</li><li>Fecha de generación: ' + createdAt + '</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }

  const msg: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'El pedido #' + orderId + ' tiene un comprador asignado',
      title: 'Comprador asignado',
      message: 
        'La solicitud número ' + orderId + ' ha sido asignada a uno de nuestros compradores. <br><br> <b>Detalles de la solicitud:</b><br><ul><li>Numero de la solicitud: ' + orderId + '</li><li>Fecha de generación: ' + createdAt + '</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msg)
  await sendEmail(msgBuyer)
}


export const sendMailBudgetApproved = async ( orderId: number, assignedBuyerId: number, createdAt: string) => {
    const buyer = await getMailWithUserId(assignedBuyerId)
    const emailBuyer = buyer?.email

    if (!emailBuyer) {
        console.error('No se pudo enviar el mail')
        return
    }

    const msg: MailDataRequired = {
        to: emailBuyer,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Presupuesto aprobado para el pedido #' + orderId,
        title: 'Presupuesto aprobado',
        message: 'Tu presupuesto ha sido aprobado',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    await sendEmail(msg)

}

export const sendMailOrderArrived = async (orderId: number, createdBy: number, assignedBuyerId: number, createdAt: Date) => {
    const user = await getMailWithUserId(createdBy)
    const buyer = await getMailWithUserId(assignedBuyerId)
    const emailUser = user?.email
    const emailBuyer = buyer?.email
    
    if (!emailUser || !emailBuyer) {
        console.error('No se pudo enviar el mail')
        return
    }

    const msg: MailDataRequired = {
        to: emailUser,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Confirmación de Entrega de la Solicitud #' + orderId,
          title: 'Confirmación de Entrega de la Solicitud #' + orderId,
          message: 'Los materiales correspondientes a la solicitud' + orderId + ' han sido entregados exitosamente. <br> Detalles de la entrega: <br> <ul><li>Fecha de entrega: ' + createdAt + '</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    await sendEmail(msg)

}

export const sendMailNewQuestion = async (orderId: number, createdBy: number, assignedBuyerId: number) => {
    const user = await getMailWithUserId(createdBy)
    const buyer = await getMailWithUserId(assignedBuyerId)
    const emailUser = user?.email
    const emailBuyer = buyer?.email
    
    if (!emailUser || !emailBuyer) {
        console.error('No se pudo enviar el mail')
        return
    }
    
    const msg: MailDataRequired = {
        to: emailUser,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Nueva pregunta/respuesta para el pedido #' + orderId,
        title: 'Nueva pregunta/respuesta',
        message: 'Se ha realizado una nueva pregunta/respuesta en tu pedido',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    const msgBuyer: MailDataRequired = {
        to: emailBuyer,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Nueva pregunta/respuesta para el pedido #' + orderId,
        title: 'Nueva pregunta/respuesta',
        message: 'Se ha realizado una nueva pregunta/respuesta en tu pedido',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    await sendEmail(msgBuyer)
    await sendEmail(msg)

}
export const sendMailModifyShippingDate = async (
    orderId: number,
    createdBy: number,
    createdAt: Date
    ) => {
    const user = await getMailWithUserId(createdBy)
    const emailUser = user?.email

    if (!emailUser) {
        console.error('No se pudo enviar el mail')
        return
    }

    const msgBuyer: MailDataRequired = {
        to: emailUser,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Fecha de envío modificada del pedido #' + orderId,
        title: 'Fecha de envío modificada',
        message: 'La fecha de envío ha sido modificada',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    await sendEmail(msgBuyer)

}

export const sendMailOrderCreated = async (
    orderId: number,
    createdBy: number,
    products: OrderProduct[],
    createdAt: Date
    ) => {
    const user = await getMailWithUserId(createdBy)
    const emailUser = user?.email
    
    if (!emailUser) {
        console.error('No se pudo enviar el mail')
        return
    }
    
    const msgBuyer: MailDataRequired = {
        to: emailUser,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Solicitud generada - #' + orderId,
        title: 'Solicitud generada #' + orderId,
        message: 'Estimado cliente,<br> La solicitud #' + orderId + ' ha sido generada exitosamente. <br><b>Detalles de la solicitud:</b><br><ul><li>Numero de la solicitud: ' + orderId + '</li><li>Fecha de generación: ' + createdAt + '</li><li>Productos/Servicios solicitados: ' + products.map(product => product.product).join(', ') + '</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'

    }
    await sendEmail(msgBuyer)

}

export const sendMailOrderCreatedCentralMarket = async (
    orderId: number,
    products: OrderProduct[],
    createdAt: Date
    ) => {
    const msgBuyer: MailDataRequired = {
        to: 'soporte@centralmarket.com.ar',
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Solicitud generada - #' + orderId,
        title: 'Solicitud generada #' + orderId,
        message: 'Estimado,<br> La solicitud #' + orderId + ' se ha sido generada exitosamente. <br><b>Detalles de la solicitud:</b><br><ul><li>Numero de la solicitud: ' + orderId + '</li><li>Fecha de generación: ' + createdAt + '</li><li>Productos/Servicios solicitados: ' + products.map(product => product.product).join(', ') + '</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }
    await sendEmail(msgBuyer)
}


export const sendMailProductUpdated = async (
  orderId: number,
  createdBy: number,
  assignedBuyerId: number
) => {
  const user = await getMailWithUserId(createdBy)
  const buyer = await getMailWithUserId(assignedBuyerId)
  const emailUser = user?.email
  const emailBuyer = buyer?.email

  if (!emailUser || !emailBuyer) {
    console.error('No se pudo enviar el mail')
    return
  }

  const msg: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Producto actualizado',
      title: 'Un producto de tu orden #' + orderId + ' ha sido actualizado',
      message: 'Tu producto ha sido actualizado. Puedes ver los detalles en el siguiente link',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }

  const msgBuyer: MailDataRequired = {
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Producto actualizado',
      title: 'Un producto de tu orden #' + orderId + ' ha sido actualizado',
      message: 'Tu producto ha sido actualizado. Puedes ver los detalles en el siguiente link',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msgBuyer)
  await sendEmail(msg)
}

export const sendMailOrderRejected = async (
  orderId: number,
  createdBy: number,
  assignedBuyerId: number
) => {
  const user = await getMailWithUserId(createdBy)
  const buyer = await getMailWithUserId(assignedBuyerId)
  const emailUser = user?.email
  const emailBuyer = buyer?.email

  if (!emailUser || !emailBuyer) {
    console.error('No se pudo enviar el mail')
    return
  }

  const msg: MailDataRequired = {
    to: emailBuyer!,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Se ha generado una disputa para el pedido #' + orderId,
      title: 'Disputa pedido #' + orderId,
      message:
        'Para seguir con la disputa, responde este mail con la razón de la disputa. Por favor, adjunta imagenes, videos y tu problema bien detallado.  Nos pondremos en contacto contigo en breve.',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  const msgBuyer: MailDataRequired = {
    to: emailUser!,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Disputa generada para el pedido #' + orderId,
      title: 'Disputa pedido #' + orderId,
      message:
        'Se ha generado una disputa para el pedido. Puedes ver los detalles en el siguiente link',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  const msgSoporte: MailDataRequired = {
    to: 'soporte@centralmarket.com.ar',
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Disputa generada para el pedido #' + orderId,
      title: 'Disputa pedido #' + orderId,
      message:
        'Se ha generado una disputa para el pedido. Puedes ver los detalles en el siguiente link',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msgSoporte)
  await sendEmail(msgBuyer)
  await sendEmail(msg)
}

export const sendMailOrderCancelled = async (
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date
) => {
  const user = await getMailWithUserId(createdBy)
  const buyer = await getMailWithUserId(assignedBuyerId)
  const emailUser = user?.email
  const emailBuyer = buyer?.email

  if (!emailUser || !emailBuyer) {
    console.error('No se pudo enviar el mail')
    return
  }
  const msg: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Notificación de Cancelación de pedido',
      title: 'Notificación de Cancelación de pedido',
      message: 'Su solicitud ' + orderId + ' ha sido cancelada correctamente.<br>Detalles de la cancelación:<br><ul><li>Número de la solicitud: ' + orderId + '</li><li>Fecha de cancelación: ' + createdAt + '</li></ul><br>Ante cualquier duda, por favor, contactar con soporte@centralmarket.com.ar<br>',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  const msgBuyer: MailDataRequired = {
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Notificación de Cancelación de pedido',
      title: 'Notificación de Cancelación de pedido',
      message: 'La solicitud ' + orderId + ' ha sido cancelada correctamente.',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msgBuyer)
  await sendEmail(msg)
}

export const sendMailValidation = async (userId: number, mail: string, firstName: string) => {
  const token = await createVerificationToken(userId)

  const msg: MailDataRequired = {
    to: mail,
    templateId: 'd-448cb3dd8f11408a88fa0b64379cef20',
    dynamicTemplateData: {
      subject: 'Verifica tu cuenta!',
      title: 'Verifica tu cuenta!',
      message: firstName + ', por favor, verifica tu cuenta haciendo click en el siguiente link',
      link: 'https://central-market.vercel.app/auth/verify/' + token,
      confirmation_url: 'https://central-market.vercel.app/auth/verify/' + token
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }

  return await sendEmail(msg)
}

export const sendMailGoBackToBudgetsInProgress = async (
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date
) => {
  const user = await getMailWithUserId(createdBy)
  const buyer = await getMailWithUserId(assignedBuyerId)
  const emailUser = user?.email
  const emailBuyer = buyer?.email

  if (!emailUser || !emailBuyer) {
    console.error('No se pudo enviar el mail')
    return
  }

  const msgBuyer: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Actualización de la solicitud #' + orderId,
      title: 'Actualización de la solicitud #' + orderId,
      message: 'La solicitud #' + orderId + ' se encuentra bajo revisión y actualización de los presupuestos. <br> Detalles de la solicitud:<br><ul><li>Número de la solicitud: ' + orderId + '</li><li>Estado de pedido: Presupuestos en Re-Trabajo</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msgBuyer)
}

export const sendMailBudgetsToRewiew = async (
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date
) => {
  const user = await getMailWithUserId(createdBy)
  const buyer = await getMailWithUserId(assignedBuyerId)
  const emailUser = user?.email
  const emailBuyer = buyer?.email

  if (!emailUser || !emailBuyer) {
    console.error('No se pudo enviar el mail')
    return
  }

  const msg: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Presupuestos disponibles para la solicitud #' + orderId,
      title: 'Presupuestos disponibles para la solicitud #' + orderId,
      message: 'Los prepuestos han sido cargados exitosamente en nuestra plataforma. <br> Detalles de la solicitud:<br><ul><li>Número de la solicitud: ' + orderId + '</li><li>Fecha de generación: ' + createdAt + '</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }

  await sendEmail(msg)
}

export const sendMailOrderInformationComplete = async (
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date,
  products: OrderProduct[]
) => {
  const user = await getMailWithUserId(createdBy)
  const buyer = await getMailWithUserId(assignedBuyerId)
  const emailUser = user?.email
  const emailBuyer = buyer?.email

  if (!emailUser || !emailBuyer) {
    console.error('No se pudo enviar el mail')
    return
  }

  const msg: MailDataRequired = {
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Solicitud #' + orderId + 'confirmada',
      title: 'Solicitud #' + orderId + 'confirmada',
      message: 'La solicitud #' + orderId + ' ha sido confirmada y esta en proceso de cotización.<br>Detalles de la solicitud:<br><ul><li>Número de la solicitud: ' + orderId + '</li><li>Fecha de generación: ' + createdAt + '</li><li>Productos/Servicios solicitados: ' + products.map(product => product.product).join(', ') + '</li></ul><br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  const msgBuyer: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Información del pedido completada',
      title: 'Información del pedido completada',
      message: 'La información del pedido ha sido completada',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msgBuyer)
  await sendEmail(msg)
}

export const sendMailOrderInformationIncomplete = async (
  orderId: number,
  createdBy: number,
  createdAt: Date,
) => {
  const user = await getMailWithUserId(createdBy)
  const emailUser = user?.email

  if (!emailUser) {
    console.error('No se pudo enviar el mail')
    return
  }

  const msgUser: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'La solicitud #' + orderId + ' tiene una nueva pregunta',
      title: 'La solicitud #' + orderId + ' tiene una nueva pregunta',
      message: '',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }

  await sendEmail(msgUser)
}

export const sendRecoveryEmail = async (user: User) => {
  const token = await createVerificationToken(user.id)

  const otherMsg: MailDataRequired = {
    to: user.email!,
    from: 'verify@em9140.centralmarket.com.ar',
    subject: 'Recupera tu contraseña de CentralMarket',
    text: `Continua al siguiente link para cambiar tu contraseña: https://central-market.vercel.app/auth/recover/${token}?email=${user.email}`
  }

  await sendEmail(otherMsg)
}

export const sendFollowUpEmail = async (order: Order) => {
  if (!order.createdBy) return

  const user = await getUserById(order.createdBy)
  if (!user?.email) return

  const msg: MailDataRequired = {
    to: user.email,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Tu pedido espera cambios - Solicitud #' + order.id,
      title: 'Seguimiento de tu pedido',
      message: 'Este es un recordatorio automático sobre el pedido #' + order.id + '.' 
      + ((order.orderStatus === 'ADDITIONAL_INFORMATION_PENDING' || order.orderStatus === 'BUDGETS_TO_REVIEW') ? 
        ('<br>Actualmente, está pendiente completar el siguiente paso: <b>'+ (order.orderStatus === 'ADDITIONAL_INFORMATION_PENDING' ? 'Información adicional pendiente': 'Presupuestos cargados') + '</b>.') : '') +
        '<br><br>Para continuar con el proceso, por favor realiza esta acción lo antes posible.' +
        '<br>Puede acceder a su solicitud y seguir su progreso en http://www.centralmarket.com.ar.<br><br>Si tiene alguna consulta, dejar la misma en la parte de <b>Preguntas</b> de la solicitud.<br>',
      order_url: 'https://central-market.vercel.app/app/orders/' + order.id
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }

  return await sendEmail(msg)
}

export const sendFollowUps = async () => {
  const { needOneDay, needThreeDays } = await getOrdersNeedingFollowUp()

  const sendOneDayFUPPromises = needOneDay.map((order) => async () => {
    await sendFollowUpEmail(order)
    await updateOrder({ id: order.id, followUpMail1DaySent: true })
  })

  const sendThreeDayFUPPromises = needThreeDays.map((order) => async () => {
    await sendFollowUpEmail(order)
    await updateOrder({ id: order.id, followUpMail3DaySent: true })
  })
  
  await Promise.all([...sendOneDayFUPPromises, ...sendThreeDayFUPPromises])
}