export type Locale =
  | "ru"
  | "en"
  | "fr"
  | "de"
  | "it"
  | "es"
  | "zh"
  | "pt"
  | "ja"
  | "ko";

export const LOCALES: Locale[] = [
  "ru",
  "en",
  "fr",
  "de",
  "it",
  "es",
  "pt",
  "zh",
  "ja",
  "ko",
];

export type Messages = Record<string, string>;

export function getMessage(messages: Messages, key: string): string {
  return messages[key] ?? key;
}
