import * as xml2js from 'xml2js'

export async function POST(request: Request) {
  const data = await request.text()
  const xlmData = await xml2js.parseStringPromise(data)
  console.log(JSON.stringify(xlmData.cXML.Header[0], undefined, 2))
  console.log(JSON.stringify(xlmData.cXML.Request[0], undefined, 2))
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
    <cXML version="1.2.014" xml:lang="en-US" timestamp="${new Date().toISOString()}">
      <Response>
        <Status code="200" text="OK" />
      </Response>
    </cXML>`,
    { headers: { 'content-type': 'application/xml' } },
  )
}
