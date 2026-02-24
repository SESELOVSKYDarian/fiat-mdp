"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Stepper, { Step } from "@/components/Stepper";

const initial = {
  fullName: "",
  dni: "",
  city: "",
  email: "",
  phone: "",
  password: ""
};

export default function RegistroPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");
  const [loading, setLoading] = useState(false);

  const canNextStep1 = useMemo(() => form.fullName && form.dni && form.city, [form]);
  const canNextStep2 = useMemo(() => form.email && form.password.length >= 4, [form]);
  const canProceed = currentStep === 1 ? canNextStep1 : currentStep === 2 ? canNextStep2 : !loading;
  const nextText = currentStep === 2 ? "Revisar" : "Siguiente";

  function updateField(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function completeRegistration() {
    if (loading) return;
    setLoading(true);
    setMsg("");
    setMsgType("error");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setMsgType("error");
      setMsg(data.error || "No se pudo registrar.");
      return;
    }

    const login = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false
    });
    if (login?.error) {
      setLoading(false);
      setMsgType("error");
      setMsg("Registro correcto, pero no se pudo iniciar sesión automáticamente.");
      return;
    }

    setMsgType("success");
    setMsg("Registro completado. Redirigiendo a sorteos...");
    setForm(initial);
    setLoading(false);
    setTimeout(() => {
      router.push("/sorteos");
    }, 450);
  }

  return (
    <main className="auth-main">
      <section className="auth-shell">
        <aside className="auth-editorial gsap-reveal">
          <div>
            <p className="auth-kicker">Alta de usuario</p>
            <h1 className="auth-title">Registro premium en 3 pasos</h1>
            <p className="auth-copy">
              Completá tus datos para participar de sorteos oficiales y administrar tus participaciones desde tu perfil.
            </p>
          </div>
          <ul className="auth-bullets">
            <li>Datos personales y contacto en flujo guiado</li>
            <li>Acceso inmediato al cerrar el registro</li>
            <li>Seguimiento de sorteos y resultados oficiales</li>
          </ul>
        </aside>

        <div className="auth-panel gsap-reveal">
          <div className="auth-card">
            <h2 className="auth-heading">Registro</h2>
            <p className="auth-subheading">Paso {currentStep} de 3</p>

            <Stepper
              initialStep={1}
              onStepChange={setCurrentStep}
              onFinalStepCompleted={completeRegistration}
              backButtonText="Anterior"
              nextButtonText={nextText}
              nextButtonProps={{ disabled: !canProceed || loading }}
              backButtonProps={{ disabled: loading }}
            >
              <Step>
                <div className="grid-2">
                  <label className="auth-field">
                    Nombre y apellido
                    <input className="auth-input" name="fullName" value={form.fullName} onChange={updateField} required />
                  </label>
                  <label className="auth-field">
                    DNI
                    <input className="auth-input" name="dni" value={form.dni} onChange={updateField} required />
                  </label>
                  <label className="auth-field auth-field-full">
                    Localidad
                    <input className="auth-input" name="city" value={form.city} onChange={updateField} required />
                  </label>
                </div>
              </Step>

              <Step>
                <div className="grid-2">
                  <label className="auth-field">
                    Mail
                    <input className="auth-input" type="email" name="email" value={form.email} onChange={updateField} required />
                  </label>
                  <label className="auth-field">
                    Teléfono
                    <input className="auth-input" name="phone" value={form.phone} onChange={updateField} />
                  </label>
                  <label className="auth-field auth-field-full">
                    Contraseña
                    <input
                      className="auth-input"
                      type="password"
                      name="password"
                      value={form.password}
                      minLength={4}
                      onChange={updateField}
                      required
                    />
                  </label>
                </div>
              </Step>

              <Step>
                <div className="auth-review">
                  <h3>Confirmación</h3>
                  <p>
                    <strong>Nombre:</strong> {form.fullName}
                  </p>
                  <p>
                    <strong>Mail:</strong> {form.email}
                  </p>
                  <p>
                    <strong>Ciudad:</strong> {form.city}
                  </p>
                </div>
              </Step>
            </Stepper>

            {msg && (
              <div
                className={`auth-alert ${msgType === "success" ? "auth-alert-success" : "auth-alert-error"} auth-alert-spaced`}
                role="alert"
                aria-live="polite"
              >
                <span className="auth-alert-icon" aria-hidden="true">
                  {msgType === "success" ? "✓" : "!"}
                </span>
                <p className="auth-alert-text">{msg}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
