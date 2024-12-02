import { sendFollowUps } from '@/utils/mailer'

export async function GET() {
  try {
    await sendFollowUps()
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Follow-ups processed'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: (err instanceof Error && err.message) ? err.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
