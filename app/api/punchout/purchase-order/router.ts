import * as xml2js from 'xml2js'

export async function POST(request: Request) {
  const data = await request.text()
  const xlmData = await xml2js.parseStringPromise(data)
  console.log(xlmData.cXML.Header[0])
  console.log(xlmData.cXML.Request[0])
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.1.010/cXML.dtd">
<cXML version="1.1.007" xml:lang="en-US" payloadID="200303450803006749@b2b.euro.com" timestamp="2020-06-02T14:36:53-05:00">
  <Response>
    <Status code="200" text="OK" />
    <PunchOutSetupResponse>
      <StartPage>
        <URL>https://mygreatpunchoutsite.com/punchoutLogin.asp</URL>
      </StartPage>
    </PunchOutSetupResponse>
  </Response>
</cXML>`,
    { headers: { 'content-type': 'application/xml' } },
  )
}
