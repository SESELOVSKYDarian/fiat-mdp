"use client";

import { useMemo, useState } from "react";

const emptyRaffle = {
  title: "",
  prize: "",
  participationDeadline: "",
  resultDate: ""
};

export default function AdminPanelClient({ initialRaffles, initialUsers, initialParticipations }) {
  const [raffles, setRaffles] = useState(initialRaffles || []);
  const [users, setUsers] = useState(initialUsers || []);
  const [participations, setParticipations] = useState(initialParticipations || []);
  const [newRaffle, setNewRaffle] = useState(emptyRaffle);
  const [editing, setEditing] = useState(
    Object.fromEntries(
      (initialRaffles || []).map((r) => [
        r.id,
        {
          participationDeadline: String(r.participationDeadline).slice(0, 16),
          resultDate: String(r.resultDate).slice(0, 16),
          status: r.status
        }
      ])
    )
  );
  const [activeTab, setActiveTab] = useState("users");
  const [selectedRaffleId, setSelectedRaffleId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const participationGroups = useMemo(
    () =>
      raffles.map((raffle) => ({
        raffle,
        items: participations.filter((p) => p.raffleId === raffle.id)
      })),
    [raffles, participations]
  );

  async function loadAll() {
    const [rafflesRes, usersRes, partsRes] = await Promise.all([
      fetch("/api/raffles", { cache: "no-store" }),
      fetch("/api/admin/users", { cache: "no-store" }),
      fetch("/api/admin/participations", { cache: "no-store" })
    ]);
    const [rafflesData, usersData, partsData] = await Promise.all([
      rafflesRes.json(),
      usersRes.json(),
      partsRes.json()
    ]);
    const nextRaffles = rafflesData.items || [];
    setRaffles(nextRaffles);
    setUsers(usersData.items || []);
    setParticipations(partsData.items || []);
    setEditing(
      Object.fromEntries(
        nextRaffles.map((r) => [
          r.id,
          {
            participationDeadline: r.participationDeadline.slice(0, 16),
            resultDate: r.resultDate.slice(0, 16),
            status: r.status
          }
        ])
      )
    );
  }

  async function createRaffle(event) {
    event.preventDefault();
    setLoading(true);
    setMsg("");
    const payload = {
      ...newRaffle,
      participationDeadline: new Date(newRaffle.participationDeadline).toISOString(),
      resultDate: new Date(newRaffle.resultDate).toISOString()
    };
    const res = await fetch("/api/raffles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "No se pudo crear el sorteo.");
      return;
    }
    setMsg("Sorteo creado.");
    setNewRaffle(emptyRaffle);
    loadAll();
  }

  async function pickWinnerManual(raffleId, participationId) {
    const res = await fetch(`/api/raffles/${raffleId}/pick-winner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "MANUAL", participationId })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "No se pudo elegir ganador manual.");
      return;
    }
    setMsg(`Ganador manual definido: ${data.winner?.fullName || "OK"}`);
    loadAll();
  }

  async function pickWinnerRandom() {
    if (!selectedRaffleId) {
      setMsg("Selecciona un sorteo para random.");
      return;
    }
    const res = await fetch(`/api/raffles/${selectedRaffleId}/pick-winner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "RANDOM" })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "No se pudo elegir ganador random.");
      return;
    }
    setMsg(`Ganador random definido: ${data.winner?.fullName || "OK"}`);
    loadAll();
  }

  async function saveRaffleUpdate(raffleId) {
    const row = editing[raffleId];
    if (!row) return;
    const res = await fetch(`/api/raffles/${raffleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participationDeadline: new Date(row.participationDeadline).toISOString(),
        resultDate: new Date(row.resultDate).toISOString(),
        status: row.status
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "No se pudo actualizar el sorteo.");
      return;
    }
    setMsg("Sorteo actualizado.");
    loadAll();
  }

  return (
    <main className="container">
      <section className="glass-card">
        <h1 className="hero-title" style={{ fontSize: "2.5rem" }}>
          Panel <span className="accent">admin</span>
        </h1>
        {msg && <p style={{ fontWeight: 700 }}>{msg}</p>}
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
          <button className="btn btn-outline" onClick={() => setActiveTab("users")} type="button">
            Usuarios
          </button>
          <button className="btn btn-outline" onClick={() => setActiveTab("raffles")} type="button">
            Sorteos
          </button>
          <button className="btn btn-outline" onClick={() => setActiveTab("parts")} type="button">
            Participaciones
          </button>
          <button className="btn btn-outline" onClick={() => setActiveTab("winners")} type="button">
            Ganadores
          </button>
        </div>
      </section>

      {activeTab === "raffles" && <section className="grid-2" style={{ marginTop: "1rem" }}>
        <article className="glass-card">
          <h2>Crear sorteo</h2>
          <form onSubmit={createRaffle} style={{ display: "grid", gap: "0.6rem" }}>
            <input
              className="input"
              placeholder="Título"
              value={newRaffle.title}
              onChange={(e) => setNewRaffle((s) => ({ ...s, title: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Premio"
              value={newRaffle.prize}
              onChange={(e) => setNewRaffle((s) => ({ ...s, prize: e.target.value }))}
            />
            <label>
              Fecha límite
              <input
                className="input"
                type="datetime-local"
                value={newRaffle.participationDeadline}
                onChange={(e) => setNewRaffle((s) => ({ ...s, participationDeadline: e.target.value }))}
              />
            </label>
            <label>
              Fecha resultado
              <input
                className="input"
                type="datetime-local"
                value={newRaffle.resultDate}
                onChange={(e) => setNewRaffle((s) => ({ ...s, resultDate: e.target.value }))}
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              Guardar sorteo
            </button>
          </form>
        </article>

        <article className="glass-card">
          <h2>Editar sorteos existentes</h2>
          <div style={{ display: "grid", gap: "0.7rem" }}>
            {raffles.map((raffle) => (
              <div key={raffle.id} className="glass-card">
                <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>{raffle.title}</p>
                <label>
                  Fecha límite
                  <input
                    className="input"
                    type="datetime-local"
                    value={editing[raffle.id]?.participationDeadline || ""}
                    onChange={(e) =>
                      setEditing((s) => ({
                        ...s,
                        [raffle.id]: { ...s[raffle.id], participationDeadline: e.target.value }
                      }))
                    }
                  />
                </label>
                <label>
                  Fecha resultado
                  <input
                    className="input"
                    type="datetime-local"
                    value={editing[raffle.id]?.resultDate || ""}
                    onChange={(e) =>
                      setEditing((s) => ({
                        ...s,
                        [raffle.id]: { ...s[raffle.id], resultDate: e.target.value }
                      }))
                    }
                  />
                </label>
                <label>
                  Estado
                  <select
                    className="select"
                    value={editing[raffle.id]?.status || "OPEN"}
                    onChange={(e) =>
                      setEditing((s) => ({
                        ...s,
                        [raffle.id]: { ...s[raffle.id], status: e.target.value }
                      }))
                    }
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="RESULT_PUBLISHED">RESULT_PUBLISHED</option>
                  </select>
                </label>
                <button className="btn btn-outline" type="button" onClick={() => saveRaffleUpdate(raffle.id)}>
                  Guardar cambios
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>}

      {activeTab === "users" && <section className="glass-card" style={{ marginTop: "1rem" }}>
        <h2>Usuarios registrados</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Mail</th>
                <th>DNI</th>
                <th>Ciudad</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.dni}</td>
                  <td>{user.city}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>}

      {activeTab === "winners" && <section className="glass-card" style={{ marginTop: "1rem" }}>
        <h2>Ganador aleatorio</h2>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          <select className="select" value={selectedRaffleId} onChange={(e) => setSelectedRaffleId(e.target.value)}>
            <option value="">Seleccionar sorteo</option>
            {raffles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
          <button className="btn btn-outline" type="button" onClick={pickWinnerRandom}>
            Elegir random
          </button>
        </div>
      </section>}

      {activeTab === "parts" && <section className="glass-card" style={{ marginTop: "1rem" }}>
        <h2>Participaciones y elección manual de ganador</h2>
        {participationGroups.map(({ raffle, items }) => (
          <div key={raffle.id} className="glass-card" style={{ marginBottom: "0.8rem" }}>
            <h3 style={{ marginTop: 0 }}>{raffle.title}</h3>
            <p>
              Premio: {raffle.prize} | Ganador actual: <strong>{raffle.winnerUserName || "Sin asignar"}</strong>
            </p>
            {items.length === 0 && <p>Sin participaciones por ahora.</p>}
            {items.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Participante</th>
                      <th>Motivo</th>
                      <th>Fiat/Patente</th>
                      <th>Validación</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((part) => (
                      <tr key={part.id}>
                        <td>
                          {part.userName}
                          <br />
                          <small>{part.userEmail}</small>
                        </td>
                        <td>{part.reason}</td>
                        <td>
                          {part.hasFiatGiama ? "Sí" : "No"} / {part.plate || "-"}
                        </td>
                        <td>{part.validationStatus}</td>
                        <td>
                          <button
                            className="btn btn-outline"
                            type="button"
                            onClick={() => pickWinnerManual(raffle.id, part.id)}
                          >
                            Elegir ganador
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </section>}
    </main>
  );
}
