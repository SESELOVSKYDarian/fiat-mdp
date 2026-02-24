"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function parseAuthError(error) {
  const raw = decodeURIComponent(String(error || "")).trim();
  if (!raw || raw === "CredentialsSignin") return "Mail o contraseña inválidos.";
  if (raw.includes("No existe un usuario")) return "No existe un usuario con ese mail.";
  if (raw.includes("contraseña")) return "La contraseña es incorrecta.";
  if (raw.includes("Demasiados intentos")) return "Demasiados intentos. Probá de nuevo en un minuto.";
  if (raw.toLowerCase().includes("mail") || raw.toLowerCase().includes("complet")) return "Completá mail y contraseña.";
  return "No se pudo iniciar sesión. Intentá nuevamente.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMsg("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    setLoading(false);

    if (res?.error) {
      setMsg(parseAuthError(res.error));
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json().catch(() => ({}));
    const role = sessionData?.user?.role;
    if (role === "ADMIN" || email.trim().toLowerCase() === "admin") {
      router.push("/admin");
      return;
    }
    router.push("/perfil");
  }

  return (
    <main className="auth-main">
      <section className="auth-shell">
        <aside className="auth-editorial gsap-reveal">
          <div>
            <p className="auth-kicker">Acceso oficial</p>
            <h1 className="auth-title">Iniciá sesión y participá</h1>
            <p className="auth-copy">
              Accedé a sorteos exclusivos de Copa Argentina x Fiat, seguí tus participaciones y consultá resultados.
            </p>
          </div>
          <ul className="auth-bullets">
            <li>Experiencia premium para clientes Fiat Giama</li>
            <li>Sorteos activos con fechas y resultados oficiales</li>
            <li>Panel personal con tus participaciones</li>
          </ul>
        </aside>

        <div className="auth-panel gsap-reveal">
          <div className="auth-card">
            <h2 className="auth-heading">Iniciar sesión</h2>
            <p className="auth-subheading">Ingresá con tu mail y contraseña para continuar.</p>

            <form onSubmit={submit} className="auth-form">
              <label className="auth-field">
                Mail
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  placeholder="tuemail@dominio.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="auth-field">
                Contraseña
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  placeholder="Ingresá tu contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <div className="auth-actions">
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Entrar"}
                </button>
                <Link href="/registro" className="auth-link">
                  ¿No tenés cuenta? Creá tu registro
                </Link>
              </div>
              {msg && (
                <div className="auth-alert auth-alert-error" role="alert" aria-live="polite">
                  <span className="auth-alert-icon" aria-hidden="true">
                    !
                  </span>
                  <p className="auth-alert-text">{msg}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
