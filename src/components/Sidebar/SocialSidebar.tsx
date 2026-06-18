import { Github, Twitter, Linkedin, Phone, Mail, LifeBuoy, AtSign, X, Heart } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { SOCIAL_LINKS, type SocialLink } from '@/utils/constants';

const ICONS: Record<SocialLink['kind'], React.ReactNode> = {
  github: <Github size={18} />,
  twitter: <Twitter size={18} />,
  linkedin: <Linkedin size={18} />,
  phone: <Phone size={18} />,
  gmail: <Mail size={18} />,
  support: <LifeBuoy size={18} />,
  outlook: <AtSign size={18} />,
};

const ACCENTS: Record<SocialLink['kind'], string> = {
  github: '#24292f',
  twitter: '#000000',
  linkedin: '#0a66c2',
  phone: '#16a34a',
  gmail: '#ea4335',
  support: '#d4af37',
  outlook: '#0072c6',
};

export function SocialSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI();

  if (!sidebarOpen) return null;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-app-border bg-app-surface animate-fade-in">
      <div className="flex items-center justify-between border-b border-app-border px-4 py-3">
        <h2 className="text-sm font-semibold">
          Follow Sanskar on<span className="gold-text">:-</span>
        </h2>
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close contact sidebar"
          className="rounded-md p-1 text-app-muted hover:bg-app-surface-2 hover:text-app-text"
        >
          <X size={16} />
        </button>
      </div>

      <div className="thin-scroll flex-1 space-y-2 overflow-y-auto p-3">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group flex items-center gap-3 rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ backgroundColor: ACCENTS[link.kind] }}
            >
              {ICONS[link.kind]}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-app-text">{link.label}</span>
              <span className="block truncate text-xs text-app-muted">{link.display}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="border-t border-app-border px-4 py-3 text-center text-xs text-app-muted">
        <span className="inline-flex items-center gap-1">
          Built with <Heart size={12} className="text-red-500" /> by Sanskar
        </span>
      </div>
    </aside>
  );
}
