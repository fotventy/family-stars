/**
 * Email sending. Uses Resend when RESEND_API_KEY is set.
 * Invite emails are localized by locale (interface language).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Family Stars <onboarding@resend.dev>";

import type { Locale } from "@/lib/i18n";
import { getMessage } from "@/lib/i18n";
import en from "@/messages/en";
import ru from "@/messages/ru";
import de from "@/messages/de";
import fr from "@/messages/fr";
import it from "@/messages/it";
import es from "@/messages/es";
import zh from "@/messages/zh";
import pt from "@/messages/pt";
import ja from "@/messages/ja";
import ko from "@/messages/ko";

const inviteMessages: Record<Locale, Record<string, string>> = {
  en, ru, de, fr, it, es, zh, pt, ja, ko,
};

function getInviteMessage(locale: Locale, key: string): string {
  const messages = inviteMessages[locale] ?? inviteMessages.en;
  return getMessage(messages, key);
}

export interface SendInviteParams {
  to: string;
  memberName: string;
  familyName: string;
  firstLoginUrl: string;
  expiresInDays: number;
  /** Interface language for the invite email content. Default "en". */
  locale?: Locale;
}

export async function sendInviteEmail(params: SendInviteParams): Promise<{ ok: boolean; error?: string }> {
  const { to, memberName, familyName, firstLoginUrl, expiresInDays, locale: localeParam } = params;
  const locale: Locale = localeParam ?? "en";
  const msg = (key: string) => getInviteMessage(locale, key);

  const nameSuffix = memberName ? `, ${memberName}` : "";
  const subject = msg("email.invite.subject").replace(/\{\{familyName\}\}/g, familyName);
  const greeting = (memberName ? msg("email.invite.greeting") : msg("email.invite.greetingNoName")).replace(/\{\{name\}\}/g, nameSuffix);
  const intro = msg("email.invite.intro")
    .replace(/\{\{familyName\}\}/g, `<strong>${familyName}</strong>`);
  const cta = msg("email.invite.cta")
    .replace(/\{\{days\}\}/g, `<strong>${expiresInDays}</strong>`);
  const button = msg("email.invite.button");
  const linkHint = msg("email.invite.linkHint").replace(/\{\{url\}\}/g, firstLoginUrl);
  const footer = msg("email.invite.footer");

  const html = `
    <p>${greeting}</p>
    <p>${intro}</p>
    <p>${cta}</p>
    <p><a href="${firstLoginUrl}" style="color: #6366f1; font-weight: 600;">${button}</a></p>
    <p style="word-break: break-all; font-size: 12px; color: #666;">${linkHint}</p>
    <p style="margin-top: 24px; font-size: 12px; color: #888;">${footer}</p>
  `.trim();

  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.log("[email] RESEND_API_KEY not set. Invite not sent:", { to, subject });
    }
    return { ok: false, error: "Email not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error:", res.status, body);
      return { ok: false, error: `Send failed: ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] Send failed:", e);
    return { ok: false, error: e instanceof Error ? e.message : "Send failed" };
  }
}

const RESET_EXPIRES_HOURS = 1;

export interface SendPasswordResetParams {
  to: string;
  userName: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail(params: SendPasswordResetParams): Promise<{ ok: boolean; error?: string }> {
  const { to, userName, resetUrl } = params;
  const subject = "Password reset — Family Stars";
  const html = `
    <p>Hi${userName ? `, ${userName}` : ""}!</p>
    <p>You requested a password reset for Family Stars.</p>
    <p><a href="${resetUrl}" style="color: #6366f1; font-weight: 600;">Reset password</a></p>
    <p style="word-break: break-all; font-size: 12px; color: #666;">If the button doesn't work, copy the link: ${resetUrl}</p>
    <p style="margin-top: 24px; font-size: 12px; color: #888;">This link expires in ${RESET_EXPIRES_HOURS} hour(s). If you didn't request this, you can ignore this email.</p>
  `.trim();

  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.log("[email] RESEND_API_KEY not set. Password reset email not sent:", { to, subject });
    }
    return { ok: false, error: "Email not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error:", res.status, body);
      return { ok: false, error: `Send failed: ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] Send failed:", e);
    return { ok: false, error: e instanceof Error ? e.message : "Send failed" };
  }
}
