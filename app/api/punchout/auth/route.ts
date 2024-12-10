import * as xml2js from 'xml2js'
import jwt from 'jsonwebtoken'
import { createUser, getUser } from '@/db/users'
import { getOrganizationByDomain } from '@/db/organizations'
import { generateRandomPassword } from '@/utils'

export async function POST(request: Request) {
  const data = await request.text()
  const xlmData = await xml2js.parseStringPromise(data)

  console.log(JSON.stringify(xlmData))

  const organizationDomain =
    xlmData.cXML.Header[0].Sender[0].Credential[0].Identity[0]
  const sharedSecret =
    xlmData.cXML.Header[0].Sender[0].Credential[0].SharedSecret[0]

  const organization = await getOrganizationByDomain(organizationDomain)

  const payloadID = xlmData.cXML['$'].payloadID

  if (
    !organization ||
    sharedSecret !== process.env.SANOFI_PUNCHOUT_SHARED_SECRET
  ) {
    const res = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
      <cXML version="1.2.014" xml:lang="en-US" payloadID="${payloadID}" timestamp="${new Date().toISOString()}">
        <Response>
          <Status code="401">Unathorized: Unrecognized SenderID</Status>
        </Response>
      </cXML>`
    console.error(res)
    return new Response(res, { headers: { 'content-type': 'application/xml' }, })
  }

  const userData = xlmData.cXML.Request[0].PunchOutSetupRequest[0].Extrinsic
  const email =
    userData.find((v: any) => v['$']?.name === 'UserEmail')?.['_'] ??
    'sanofi@sanofi-staging.com'

  if (!email) {
    const res = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
      <cXML version="1.2.014" xml:lang="en-US" payloadID="${payloadID}" timestamp="${new Date().toISOString()}">
        <Response>
          <Status code="401">Unathorized: UserEmail is Missing</Status>
        </Response>
      </cXML>`
    console.error(res)
    return new Response(res, { headers: { 'content-type': 'application/xml' }, })
  }

  let user

  user = await getUser(email)

  if (!user) {
    const password = generateRandomPassword()
    const firstName = userData.find((v: any) => v['$']?.name === 'FirstName')?.[
      '_'
    ]
    const lastName = userData.find((v: any) => v['$']?.name === 'LastName')?.[
      '_'
    ]
    await createUser(email, password, firstName, lastName)
    user = await getUser(email)
  }

  if (user?.organizationId !== organization.id) {
    const res = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
      <cXML version="1.2.014" xml:lang="en-US" payloadID="${payloadID}" timestamp="${new Date().toISOString()}">
        <Response>
          <Status code="401">Unathorized: UserEmail is Missing</Status>
        </Response>
      </cXML>`
    console.error(res)

    return new Response(res, { headers: { 'content-type': 'application/xml' }, })
  }

  const punchout = {
    payloadID,
    buyerCookie: xlmData.cXML.Request[0].PunchOutSetupRequest[0].BuyerCookie[0],
    checkoutRedirectTo:
      xlmData.cXML.Request[0].PunchOutSetupRequest[0].BrowserFormPost[0].URL[0],
  }
  const token = jwt.sign({ ...user, punchout }, process.env.AUTH_SECRET ?? '', {
    expiresIn: '1h',
    issuer: process.env.AUTH_ISSUER,
  })
  const url = `${process.env.API_BASE_URL}/auth/punchout?token=${token}`

  const res = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
    <cXML version="1.2.014" xml:lang="en-US" payloadID="${payloadID}" timestamp="${new Date().toISOString()}">
      <Response>
        <Status code="200" text="OK" />
        <PunchOutSetupResponse>
          <StartPage>
            <URL>${url}</URL>
          </StartPage>
        </PunchOutSetupResponse>
      </Response>
    </cXML>`
  console.log(res)

  return new Response(res, { headers: { 'content-type': 'application/xml' } })
}
