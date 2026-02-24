"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function ProfileClient({ user }) {
  return (
    <main className="container">
      <section className="glass-card" style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 className="hero-title" style={{ fontSize: "2.4rem" }}>
          Mi <span className="accent">perfil</span>
        </h1>
        <p>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p>
          <strong>Mail:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <Link href="/sorteos" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Ver sorteos
          </Link>
          <button className="btn btn-outline" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
            Cerrar sesion
          </button>
        </div>
      </section>
    </main>
  );
}
