import { NextResponse } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Проверяет, что запрос к опасному админ-эндпоинту авторизован.
 * В продакшене без ADMIN_SECRET эндпоинты возвращают 404 (скрыты).
 * С ADMIN_SECRET нужен заголовок X-Admin-Key: <ADMIN_SECRET>.
 */
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  if (IS_PRODUCTION && !ADMIN_SECRET) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  const key = request.headers.get("X-Admin-Key");
  if (ADMIN_SECRET && key !== ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Forbidden", message: "Invalid or missing X-Admin-Key" },
      { status: 403 }
    );
  }
  return null;
}
