import { prisma } from '@/lib/prisma'

// Lets one login see and manage another login's data (e.g. a shared support
// inbox that should act on the main account's automations/gallery) without
// giving it a separate, empty account. Configured as "alias:owner" pairs,
// comma-separated: SHARED_ACCOUNT_ALIASES="support@x.com:owner@x.com".
const aliasMap = new Map<string, string>()
for (const pair of (process.env.SHARED_ACCOUNT_ALIASES || '').split(',')) {
  const [alias, owner] = pair.split(':').map((s) => s.trim().toLowerCase())
  if (alias && owner) aliasMap.set(alias, owner)
}

type SessionUser = { id: string; email?: string | null }

// Resolves the Prisma user whose data this session should actually read and
// write: the logged-in user themselves, unless their email is aliased to
// another account's owner, in which case it's that owner's user row.
export async function resolveAccountUser(sessionUser: SessionUser): Promise<{ id: string; email: string }> {
  const loginEmail = sessionUser.email?.toLowerCase() || ''
  const ownerEmail = aliasMap.get(loginEmail)

  if (ownerEmail) {
    const owner = await prisma.user.findUnique({
      where: { email: ownerEmail },
      select: { id: true, email: true },
    })
    if (owner) return owner
  }

  return { id: sessionUser.id, email: sessionUser.email || '' }
}
