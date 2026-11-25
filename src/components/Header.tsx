import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onEditDocument: () => void;
}

const NAV_LINKS = [
  { href: '#solver', label: 'Question Solver' },
  { href: '#knowledge-base', label: 'Knowledge Base' },
  { href: '#rule-engine', label: 'Rule Engine' },
];

export function Header({ onEditDocument }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5 md:gap-8">
        <a
          href="#solver"
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          Library QA System
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              onEditDocument();
            }}
            className="min-h-[40px] sm:min-h-0 rounded-lg bg-rose-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Edit Document
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex md:hidden min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-4 py-2 md:hidden"
        >
          <div className="flex flex-col divide-y divide-slate-100">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-[44px] items-center text-sm font-medium text-slate-700 hover:text-rose-900"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
