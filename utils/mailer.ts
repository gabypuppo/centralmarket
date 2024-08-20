import type { MailDataRequired } from '@sendgrid/mail'
import sgMail, { ResponseError } from '@sendgrid/mail'
import { getMailWithUserId, type User } from '@/db/users'
import { createVerificationToken } from '@/db/verificationTokens'

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

  const msgBuyer: MailDataRequired = {
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'El pedido #' + orderId + ' tiene un comprador asignado',
      title: 'Comprador asignado',
      message:
        'Se ha asignado un comprador al pedido. Puedes ver los detalles en el siguiente link',
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
        'Se ha asignado un comprador al pedido. Puedes ver los detalles en el siguiente link',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msg)
  await sendEmail(msgBuyer)
}


export const sendMailBudgetApproved = async ( orderId: number, createdBy: number, assignedBuyerId: number) => {
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
        subject: 'Presupuesto aprobado para el pedido #' + orderId,
        title: 'Presupuesto aprobado',
        message: 'Tu presupuesto ha sido aprobado',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    const msgBuyer: MailDataRequired = {
        to: emailUser,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Presupuesto aprobado para el pedido #' + orderId,
        title: 'Presupuesto aprobado',
        message: 'Tu presupuesto ha sido aprobado',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    await sendEmail(msgBuyer)
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
        subject: 'Nueva pregunta para el pedido #' + orderId,
        title: 'Nueva pregunta',
        message: 'Se ha realizado una nueva pregunta en tu pedido',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from: 'verify@em9140.centralmarket.com.ar'
    }

    const msgBuyer: MailDataRequired = {
        to: emailBuyer,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Nueva pregunta para el pedido #' + orderId,
        title: 'Nueva pregunta',
        message: 'Se ha realizado una nueva pregunta en tu pedido',
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
        to: emailBuyer,
        templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
        dynamicTemplateData: {
        subject: 'Fecha de envío modificada del pedido #' + orderId,
        title: 'Fecha de envío modificada',
        message: 'La fecha de envío ha sido modificada',
        order_url: 'https://central-market.vercel.app/app/orders/' + orderId
        },
        from:  'verify@em9140.centralmarket.com.ar'
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
    await sendEmail(msg)

}

export const sendMailOrderCreated = async (
    orderId: number,
    createdBy: number,
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
        subject: 'Pedido creado #' + orderId,
        title: 'Pedido creado #' + orderId,
        message: 'Tu pedido ha sido creado',
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
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Orden cancelada',
      title: 'Orden cancelada',
      message: 'Tu orden ha sido cancelada',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  const msgBuyer: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Orden cancelada',
      title: 'Orden cancelada',
      message: 'Tu orden ha sido cancelada',
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
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Actualización de pedido',
      title: 'Se ha actualizado tu pedido',
      message: 'Tu pedido ha vuelto a presupuestos en progreso',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  const msgBuyer: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Actualización de pedido',
      title: 'Se ha actualizado tu pedido',
      message: 'Tu pedido ha vuelto a presupuestos en progreso',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msgBuyer)
  await sendEmail(msg)
}

export const sendMailBudgetsToRewiew = async (
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
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Los presupuestos ya estan listos para revisar!',
      title: 'Actualización de presupuestos',
      message: 'Tienes presupuestos para revisar',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  const msgBuyer: MailDataRequired = {
    to: emailUser,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Los presupuestos ya estan listos para revisar!',
      title: 'Actualización de presupuestos',
      message: 'Tienes presupuestos para revisar',
      order_url: 'https://central-market.vercel.app/app/orders/' + orderId
    },
    from: 'verify@em9140.centralmarket.com.ar'
  }
  await sendEmail(msgBuyer)
  await sendEmail(msg)
}

export const sendMailOrderInformationComplete = async (
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
    to: emailBuyer,
    templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
    dynamicTemplateData: {
      subject: 'Información del pedido completada',
      title: 'Información del pedido completada',
      message: 'La información del pedido ha sido completada',
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
