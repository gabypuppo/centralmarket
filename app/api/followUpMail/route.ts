import { sendFollowUps } from "@/utils/mailer";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    sendFollowUps(); 
    res.status(200).json({ success: true, message: "Follow-ups processed" });
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}