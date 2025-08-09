import nodemailer from "nodemailer";
import { config } from "../config/env.js";

let transporter;
export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
  }
  return transporter;
}

export async function sendOrderEmail(to, subject, html) {
  const t = getTransporter();
  return t.sendMail({ from: config.smtp.from, to, subject, html });
}
