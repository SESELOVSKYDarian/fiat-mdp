"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const media = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAHHYq8KiRKUhRfddGd9g6Q_Mrxejx1ZVGR9ohc1u-M--a5FUSgQM8d9RDN8Mb-fZlvisB_2i8mhswbJ9P8QrzKaK-qDACEfOwU-NoLgM83UalRwKygFu3vRW068kboPDWFDtTwqNXPg0xQ1iohhkKnKlZjBwFW1AK-VdysXd-13Xlq1oa_mjEgnzNlc_moSuQIp3lX5G9bpFt3w682Yml1ndSMpOzI9BZ4eDSj0ORLWBMAKo7MB2y2mpkOIi1E0F5V_FBI3eYRtYGK",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDIECOj5Ug3daB7MHPxQ9OS7imF4YUQbvXsbWBwvxWdp6hbLT1q0eOEiVqRhS0Gi4ZjsMbLGmbSDlbKNQZTT0CibB7gOkfrkafRGor30GcOb5StPX-Ev16GaM9c6_fVR3Cx0OmJkKSNFQa_nOgn48Vp0HaeDnCoAvtOvD8EmWzpZU6psyA7DFEJwdbx41vJoDXCbW9FYsEVIUCO5S5QuMxnQKv--EZFe8l-kLE2QmOD8FDIM0iosM7_GrpFO0lCEZQvY_b6hdi_O5dp",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Wln7Q0B0Ji_kiaEPVQVvh-TUbBN9s97stA7CI7VqiJQHZRluiqME6JZT834wc568VPeHLUr5pDsuo_uFJDPF-0dEYkvko-RhCWBHqP2gWDrG0QUb9S-Q9ddpHuUHlzgD1QZ_4nt8tRAMsY2FHAFDWTOpbqd5CiZYcoxoFdk29pBjU9MvOnWHa7K9WfyJV40JVx7DXbiAmGpC6SGkfIdes6oFbisBVNqV7djTaWIYJ_cCX0oJrJogrSH8eCLsXUSiicZBaqLgcjHR",
];

const initialForm = {
  raffleId: "",
  reason: "",
  hasFiatGiama: "no",
  plate: "",
};

export default function SorteosPage() {
  const { data: session } = useSession();
  const [raffles, setRaffles] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const activeRaffle = raffles.find((r) => r.id === form.raffleId);

  async function loadRaffles() {
    const res = await fetch("/api/raffles", { cache: "no-store" });
    const data = await res.json();
    setRaffles(data.items || []);
  }

  async function loadMine() {
    if (!session?.user) {
      setMyParticipations([]);
      return;
    }
    const res = await fetch("/api/me/participations", { cache: "no-store" });
    const data = await res.json();
    setMyParticipations(data.items || []);
  }

  useEffect(() => {
    loadRaffles();
  }, []);

  useEffect(() => {
    loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  function openParticipationModal(raffleId) {
    setForm({ ...initialForm, raffleId });
    setMsg("");
    setModalOpen(true);
  }

  function closeParticipationModal() {
    setModalOpen(false);
    setLoading(false);
  }

  async function submitParticipation(event) {
    event.preventDefault();
    if (!session?.user) {
      setMsg("Debes iniciar sesión para participar.");
      return;
    }
    if (!form.raffleId) {
      setMsg("Seleccioná un sorteo.");
      return;
    }

    setLoading(true);
    setMsg("");
    const res = await fetch(`/api/raffles/${form.raffleId}/participate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: form.reason,
        hasFiatGiama: form.hasFiatGiama === "si",
        plate: form.hasFiatGiama === "si" ? form.plate : null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "No se pudo registrar la participación.");
      return;
    }
    setMsg("Participación registrada.");
    setModalOpen(false);
    setForm(initialForm);
    loadMine();
  }

  return (
    <main className="container">
      <section className="legacy-sorteos-hero">
        <div className="legacy-sorteos-hero-content">
          <span className="legacy-pill">Exclusivo clientes Fiat</span>
          <h1 className="impact-title legacy-title-xl">
            Ganá tu lugar{" "}
            <span style={{ color: "#36c3f2" }}>en la historia</span>
          </h1>
          <p className="legacy-subtitle">
            Participá de los sorteos oficiales de la Copa Argentina. Premios
            increíbles todas las semanas para los verdaderos apasionados del
            fútbol.
          </p>
        </div>
      </section>

      <div className="legacy-tabs gsap-reveal">
        <div className="legacy-tab active">Activos ({raffles.length})</div>
        <div className="legacy-tab">Finalizados</div>
        <div className="legacy-tab">Mis participaciones</div>
      </div>

      <section className="legacy-sorteo-actions gsap-reveal">
        <article className="glass-card">
          <h2 className="impact-title gsap-reveal-text legacy-sorteos-title">
            Sorteos
          </h2>
          <div className="legacy-sorteos-grid">
            {raffles.map((raffle, idx) => (
              <article
                key={raffle.id}
                className="legacy-sweep-card gsap-reveal"
              >
                <div className="legacy-sweep-media">
                  <img src={media[idx % media.length]} alt={raffle.title} />
                  <span className="legacy-badge">Activo</span>
                  <span className="legacy-countdown">
                    Cierra:{" "}
                    {new Date(
                      raffle.participationDeadline,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="legacy-sweep-body">
                  <h3>{raffle.title}</h3>
                  <p className="legacy-sweep-prize">{raffle.prize}</p>
                  <p className="legacy-sweep-meta">
                    Cierre:{" "}
                    {new Date(raffle.participationDeadline).toLocaleString()}
                  </p>
                  <p className="legacy-sweep-meta">
                    Resultado: {new Date(raffle.resultDate).toLocaleString()}
                  </p>
                  {raffle.winnerUserName && (
                    <p className="legacy-sweep-winner">
                      Ganador: {raffle.winnerUserName}
                    </p>
                  )}
                  <button
                    type="button"
                    className="legacy-sweep-btn"
                    onClick={() => openParticipationModal(raffle.id)}
                  >
                    Participar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="glass-card gsap-reveal legacy-mine-section">
        <h3 className="legacy-mine-title">Mis participaciones</h3>
        {myParticipations.length === 0 && (
          <p>Aún no tenés ninguna participación.</p>
        )}
        {myParticipations.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Sorteo</th>
                  <th>Motivo</th>
                  <th>Fiat Giama</th>
                  <th>Patente</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {myParticipations.map((part) => (
                  <tr key={part.id}>
                    <td>{part.raffleTitle || part.raffleId}</td>
                    <td>{part.reason}</td>
                    <td>{part.hasFiatGiama ? "Sí" : "No"}</td>
                    <td>{part.plate || "-"}</td>
                    <td>{part.validationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <div
          className="legacy-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Participar en sorteo"
        >
          <div className="legacy-modal glass-card gsap-reveal">
            <div className="legacy-modal-head">
              <h3>Participar en sorteo</h3>
              <button
                type="button"
                className="btn btn-outline"
                onClick={closeParticipationModal}
              >
                Cerrar
              </button>
            </div>
            {activeRaffle && (
              <p className="legacy-modal-summary">
                Sorteo: <strong>{activeRaffle.title}</strong> | Premio:{" "}
                <strong>{activeRaffle.prize}</strong>
              </p>
            )}
            <form
              onSubmit={submitParticipation}
              className="legacy-participation-form"
            >
              <label>
                ¿Por qué deberías ganar?
                <textarea
                  className="textarea"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, reason: e.target.value }))
                  }
                />
              </label>
              <label>
                ¿Tenés auto Fiat Giama?
                <select
                  className="select"
                  value={form.hasFiatGiama}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, hasFiatGiama: e.target.value }))
                  }
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </label>
              {form.hasFiatGiama === "si" && (
                <label>
                  Patente
                  <input
                    className="input"
                    value={form.plate}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, plate: e.target.value }))
                    }
                    placeholder="AA123BB"
                  />
                </label>
              )}
              <div className="legacy-modal-actions">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Enviar confirmación"}
                </button>
              </div>
              {msg && <p className="legacy-status">{msg}</p>}
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
