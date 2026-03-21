export const FLAGS = {
  content_hub_enabled: true,
} as const;

export function isEnabled(flag: keyof typeof FLAGS): boolean {
  return FLAGS[flag];
}
