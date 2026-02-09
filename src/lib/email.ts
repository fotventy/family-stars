/**
 * Отправка писем. Если задан RESEND_API_KEY — используем Resend.
 * Иначе письма не отправляются (логируем в консоль в dev).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Семейные Звёздочки <onboarding@resend.dev>";

export interface SendInviteParams {
  to: string;
  memberName: string;
  familyName: string;
  firstLoginUrl: string;
  expiresInDays: number;
}

export async function sendInviteEmail(params: SendInviteParams): Promise<{ ok: boolean; error?: string }> {
  const { to, memberName, familyName, firstLoginUrl, expiresInDays } = params;

  const subject = `Приглашение в семью «${familyName}» — Семейные Звёздочки`;
  const html = `
    <p>Здравствуйте${memberName ? `, ${memberName}` : ""}!</p>
    <p>Вас пригласили в семью <strong>${familyName}</strong> в приложении Семейные Звёздочки.</p>
    <p>Перейдите по ссылке ниже, чтобы задать пароль и войти в семью. Ссылка действительна <strong>${expiresInDays} дней</strong>.</p>
    <p><a href="${firstLoginUrl}" style="color: #6366f1; font-weight: 600;">Войти в семью →</a></p>
    <p style="word-break: break-all; font-size: 12px; color: #666;">Если кнопка не работает, скопируйте ссылку: ${firstLoginUrl}</p>
    <p style="margin-top: 24px; font-size: 12px; color: #888;">Это письмо отправлено автоматически. Если вы не ожидали приглашения, просто проигнорируйте его.</p>
  `.trim();

  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.log("[email] RESEND_API_KEY не задан. Письмо не отправлено:", { to, subject });
    }
    return { ok: false, error: "Email не настроен" };
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
      return { ok: false, error: `Ошибка отправки: ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] Send failed:", e);
    return { ok: false, error: e instanceof Error ? e.message : "Ошибка отправки" };
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
