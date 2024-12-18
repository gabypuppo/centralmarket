"use server";

import { getUser, type PunchoutData, setUserOrganization } from "@/db/users";
import {
  sendMailBudgetApproved,
  sendMailBudgetsToRewiew,
  sendMailBuyerSelected,
  sendMailGoBackToBudgetsInProgress,
  sendMailModifyShippingDate,
  sendMailNewQuestion,
  sendMailOrderArrived,
  sendMailOrderCancelled,
  sendMailOrderCreated,
  sendMailOrderCreatedCentralMarket,
  sendMailOrderInformationComplete,
  sendMailOrderInformationIncomplete,
  sendMailOrderRejected,
  sendMailProductUpdated,
  sendMailValidation,
} from "./mailer";
import {
  createOrderWithProducts,
  type OrderProduct,
  type Order,
  addBudgets,
  getBudgets,
  removeBudget,
  updateOrder,
  type OrderBudget,
  updateBudget,
  addAttachments,
  getAttachments,
  type OrderHistory,
  addHistory,
  getHistory,
  deleteCreatedByInOrders,
  removeFile,
  getProductsByOrderId,
} from "@/db/orders";
import { auth } from "@/auth";
import {
  createDeliveryPoint,
  createOrganization,
  deleteDeliveryPoint,
  type Organization,
  type DeliveryPoint,
  removeOrganization,
} from "@/db/organizations";

export async function getUserAction() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await getUser(session?.user.email!);
  return { ...user, punchout: session.user.punchout };
}

export async function sendMailBuyerSelectedAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date,
) {
  await sendMailBuyerSelected(orderId, createdBy, assignedBuyerId, createdAt);
}

export async function sendMailBudgetApprovedAction(
  orderId: number,
  assignedBuyerId: number,
  createdAt: string,
) {
  await sendMailBudgetApproved(orderId, assignedBuyerId, createdAt);
}

export async function sendMailNewQuestionAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
) {
  await sendMailNewQuestion(orderId, createdBy, assignedBuyerId);
}

export async function sendMailOrderArrivedAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date,
) {
  await sendMailOrderArrived(orderId, createdBy, assignedBuyerId, createdAt);
}

export async function sendMailModifyShippingDateAction(
  orderId: number,
  createdBy: number,
  createdAt: Date,
) {
  await sendMailModifyShippingDate(orderId, createdBy, createdAt);
}
export async function sendMailOrderCreatedAction(
  orderId: number,
  createdBy: number,
  products: OrderProduct[],
  createdAt: Date,
) {
  await sendMailOrderCreated(orderId, createdBy, products, createdAt);
}

export async function sendMailOrderCreatedCentralMarketAction(
  orderId: number,
  products: OrderProduct[],
  createdAt: Date,
) {
  await sendMailOrderCreatedCentralMarket(orderId, products, createdAt);
}

export async function sendMailProductUpdatedAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
) {
  await sendMailProductUpdated(orderId, createdBy, assignedBuyerId);
}

export async function sendMailOrderRejectedAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
) {
  await sendMailOrderRejected(orderId, createdBy, assignedBuyerId);
}

export async function sendMailOrderCancelledAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date,
) {
  await sendMailOrderCancelled(orderId, createdBy, assignedBuyerId, createdAt);
}

export async function sendMailValidationAction(
  userId: number,
  mail: string,
  firstName: string,
) {
  await sendMailValidation(userId, mail, firstName);
}
export async function sendMailGoBackToBudgetsInProgressAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date,
) {
  await sendMailGoBackToBudgetsInProgress(
    orderId,
    createdBy,
    assignedBuyerId,
    createdAt,
  );
}

export async function sendMailBudgetsToRewiewAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date,
) {
  await sendMailBudgetsToRewiew(orderId, createdBy, assignedBuyerId, createdAt);
}
export async function sendMailOrderInformationCompleteAction(
  orderId: number,
  createdBy: number,
  assignedBuyerId: number,
  createdAt: Date,
  products: OrderProduct[],
) {
  await sendMailOrderInformationComplete(
    orderId,
    createdBy,
    assignedBuyerId,
    createdAt,
    products,
  );
}

export async function sendMailOrderInformationIncompleteAction(
  orderId: number,
  createdBy: number,
  createdAt: Date,
) {
  await sendMailOrderInformationIncomplete(orderId, createdBy, createdAt);
}
export async function createOrganizationAction(
  organization: Pick<Organization, "name" | "domains">,
) {
  return await createOrganization({
    ...organization,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function removeOrganizationAction(organizationId: number) {
  return await removeOrganization(organizationId);
}

export async function setUserOrganizationAction(
  userId: number,
  organizationId: number | null,
) {
  await setUserOrganization(userId, organizationId);
}

export async function deleteCreatedByInOrdersAction(userId: number) {
  await deleteCreatedByInOrders(userId);
}

export async function createOrderWithProductsAction(
  orderPartial: Pick<
    Order,
    | "organizationId"
    | "createdBy"
    | "title"
    | "deliveryPointId"
    | "shippingMethod"
    | "notes"
    | "finalClient"
    | "shippingDate"
    | "finalAddress"
  >,
  products: Omit<OrderProduct, "id" | "orderId">[],
  punchout?: PunchoutData,
) {
  const order = await createOrderWithProducts(orderPartial, products);

  const productsData = await getProductsByOrderId(order.id);

  if (punchout?.payloadID) {
    await punchoutOrderMessage(punchout, order, productsData).catch(
      console.error,
    );
  }

  return order;
}

export async function getBudgetsAction(orderId: number) {
  return await getBudgets(orderId);
}

export async function updateOrderAction(
  order: Pick<Order, "id"> & Partial<Order>,
) {
  return await updateOrder(order);
}

export async function addBudgetsAction(orderId: number, formData: FormData) {
  const files = Array.from(formData.values()) as File[];

  await addBudgets(orderId, files);
}

export async function updateBudgetsAction(
  budget: Pick<OrderBudget, "id"> & Partial<OrderBudget>,
) {
  return await updateBudget(budget);
}

export async function removeBudgetAction(budgetId: number) {
  await removeBudget(budgetId);
}

export async function getAttachmentsAction(orderId: number) {
  return await getAttachments(orderId);
}

export async function addAttachmentsAction(
  orderId: number,
  formData: FormData,
) {
  const files = Array.from(formData.values()) as File[];

  return await addAttachments(orderId, files);
}

export async function createDeliveryPointAction(
  DeliveryPoint: Omit<DeliveryPoint, "id">,
) {
  return await createDeliveryPoint(DeliveryPoint);
}

export async function deleteDeliveryPointAction(DeliveryPointId: number) {
  return await deleteDeliveryPoint(DeliveryPointId);
}

export async function getHistoryAction(orderId: number) {
  return await getHistory(orderId);
}

export async function addHistoryAction(
  history: Omit<OrderHistory, "id" | "date">,
) {
  return await addHistory(history);
}

export async function removeFileAction(fileId: number) {
  return await removeFile(fileId);
}

async function punchoutOrderMessage(
  data: PunchoutData,
  order: Order,
  products: OrderProduct[],
) {
  const items = products.reduce((acc, product) => {
    const value = `<ItemIn quantity="${product.quantity}">
        <ItemID>
          <SupplierPartID>${order.id}</SupplierPartID>
          <SupplierPartAuxiliaryID>${product.id}</SupplierPartAuxiliaryID>
        </ItemID>
        <ItemDetail>
          <UnitPrice>
            <Money currency="${product.estimatedCostCurrency?.toUpperCase()}">${product.estimatedCost}</Money>
          </UnitPrice>
          <UnitOfMeasure>${product.quantityUnit}</UnitOfMeasure>
          <Description xml:lang="en-US">${product.product}</Description>
        </ItemDetail>
      </ItemIn>
      `;
    return acc + value;
  }, "");

  const total = products.reduce((acc, product) => {
    const productPrice = Number(product.estimatedCost);
    return acc + productPrice * Number(product.quantity);
  }, 0);

  const request = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
<cXML payloadID="${data.payloadID}" xml:lang="en-US" timestamp="${new Date().toISOString()}" version="1.2.014">
  <Header>
    <From>
      <Credential domain="${process.env.SANOFI_DOMAIN}">
        <Identity>${process.env.CENTRAL_MARKET_SANOFI_ID}</Identity>
      </Credential>
    </From>
    <To>
      <Credential domain="${process.env.SANOFI_DOMAIN}">
        <Identity>${process.env.SANOFI_DOMAIN}</Identity>
      </Credential>
    </To>
    <Sender>
     <Credential domain="${process.env.SANOFI_DOMAIN}">
        <Identity>${process.env.CENTRAL_MARKET_SANOFI_ID}</Identity>
        <SharedSecret>${process.env.SANOFI_PUNCHOUT_SHARED_SECRET}</SharedSecret>
      </Credential>
      <UserAgent>Coupa Procurement 1.0</UserAgent>
    </Sender>
  </Header>
  <Message deploymentMode="development">
    <PunchOutOrderMessage>
      <BuyerCookie>${data.buyerCookie}</BuyerCookie>
      <PunchOutOrderMessageHeader operationAllowed="create" quoteStatus="pending">
        <Total>
					<Money currency="${products[0]?.estimatedCostCurrency?.toUpperCase() ?? "ARS"}">${total}</Money>
				</Total>
      </PunchOutOrderMessageHeader>
      ${items}
    </PunchOutOrderMessage>
  </Message>
</cXML>`;

  console.log(request);
  console.log(data);

  await fetch(data.checkoutRedirectTo, {
    method: "post",
    body: request,
    headers: { "Content-Type": "application/xml" },
  })
    .then((r) => r.text())
    .then(console.log);
}
