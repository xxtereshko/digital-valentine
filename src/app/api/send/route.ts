import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { email, message } = body;

  try {
    // TODO: get from .env
    const transporter = nodemailer.createTransport({
      host: "127.0.0.1",
      port: 1025234,
      secure: false,
    });

    // TODO: get from .env
    const mailOptions = {
      from: "norepl@example.com",
      to: email,
      subject: "Тебе валентинка",
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ email, message });
  } catch (error) {
    return Response.json({ status: 500, message: JSON.stringify(error) });
  }
}
