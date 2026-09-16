"use server";

import { Resend } from "resend";
import { z } from "zod";
import { ContactFormSchema } from "./schemas";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type ContactFormInputs = z.infer<typeof ContactFormSchema>;

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);

  if (result.error) {
    return { error: result.error.format() };
  }

  try {
    const { name, email, message } = result.data;
    const recipient = process.env.CONTACT_EMAIL || "hello@example.com";
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("[Dev Mode Contact Form]:", { name, email, message, recipient });
      return { success: true };
    }

    const { data: resendData, error } = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      replyTo: [email],
      subject: `New message from ${name}!`,
      text: `Name:\n${name}\n\nEmail:\n${email}\n\nMessage:\n${message}`,
    });

    if (!resendData || error) {
      console.error("[sendEmail error]:", error?.message);
      throw new Error("Failed to send email!");
    }

    return { success: true };
  } catch (error) {
    console.error("[sendEmail catch]:", error);
    return { error };
  }
}
