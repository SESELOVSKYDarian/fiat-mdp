"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/sorteos", label: "Sorteos" }
];

export default function Navbar() {
  const pathname = usePathname();
  const { data } = useSession();
  const [open, setOpen] = useState(false);

  const authHref = data?.user ? "/perfil" : "/login";
  const authLabel = data?.user ? "Mi perfil" : "Iniciar sesión";

  return (
    <header className="navbar-wrap">
      <div className="navbar-inner">
        <Link href="/" className="brand-logos" aria-label="Inicio" onClick={() => setOpen(false)}>
          <img src="/calogo.png" className="logo-copa" alt="Logo Copa Argentina" />
          <img src="/fiatlogo.png" className="logo-fiat" alt="Logo Fiat" />
        </Link>

        <nav className="desktop-nav" aria-label="Principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "active" : ""}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href={authHref} className="auth-cta">
          {authLabel}
        </Link>

        <button
          type="button"
          className={`menu-btn ${open ? "is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          <span className="menu-icon" aria-hidden="true">
            <span className="menu-btn-line" />
            <span className="menu-btn-line" />
            <span className="menu-btn-line" />
          </span>
        </button>
      </div>

      <button
        type="button"
        className={`mobile-overlay ${open ? "open" : ""}`}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />

      <div id="mobile-nav" className={`mobile-panel ${open ? "mobile-open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link mobile-nav-link ${pathname === link.href ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {!data?.user && (
          <Link href="/login" className="auth-cta mobile-auth" onClick={() => setOpen(false)}>
            Iniciar sesión
          </Link>
        )}
        {data?.user && (
          <Link href={authHref} className="auth-cta mobile-auth" onClick={() => setOpen(false)}>
            {authLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
