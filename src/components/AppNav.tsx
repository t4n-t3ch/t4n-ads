import Link from 'next/link'

const LINKS = [
  { href: '/generate', label: 'Generate' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/subjects', label: 'Manage subjects' },
  { href: '/automations', label: 'Automations' },
]

export default function AppNav({ current }: { current?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {LINKS.filter((link) => link.href !== current).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-orange-400 hover:text-orange-300 whitespace-nowrap"
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
