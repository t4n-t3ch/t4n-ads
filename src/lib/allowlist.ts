const allowedEmails = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

// Fails closed: with ALLOWED_EMAILS unset or empty, nobody is allowed through.
// This app sits on a public URL once deployed, so an unconfigured allowlist
// must not silently mean "open to anyone".
export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email || allowedEmails.length === 0) return false
  return allowedEmails.includes(email.toLowerCase())
}
