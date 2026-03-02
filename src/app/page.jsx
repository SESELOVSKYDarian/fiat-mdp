import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
const prizeCards = [
  {
    title: "Ejemplo 1",
    subtitle: "El premio mayor te espera",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDat3GY6DMISAQd0Ye_zXTdr6P2NBN5UkNi-oQDD0CmXjwbvKvCxU6ccR9iftuiP0jKoid3hninX4X4AHMdl9kAe4aM-sGuP0FPucEjQZF_21Vx7-cHvOFNdY3Df5qppengX6pv2XGiC5mWTfROYUdr4u0Rd60T7mNeN-83YRZKJ9VuuADjI7qgXOMugHzZ3YbOR6Ajn9LW6Enn6axKxNfGtpSnv2GmgODKS2_brb3cpObmO7Cl66Bzl1JKx_08y49jxqHQk8yY1rS3",
  },
  {
    title: "Ejemplo 2",
    subtitle: "Viví la final desde el palco",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIdsGJc5o3bFNE9Hhq6nBwkZjx5nhKeuUr9AYKZBtTms4ZAeDXNaXWpt-Kq6aK1N5MDMJ8oDpLAmUsiXAU_4BEWwA9PXnfa-OZ_HmglIRG9O6IF59NdzcTkV0iG-zcPlWVE7CW2TH8Zx8qOCzInh4zTJHBLAxv6oFc5zuB8G_9EcRgNx1ekaa2Hib2ekdVZ39ultOcHk_-YER8lqSktF6ziY1ws-YMLdF4IYE-cU9sbCRYn0e-xw6MLeRxsRr8ZoYvHiCyPrmFeeH_",
  },
  {
    title: "Ejemplo 3",
    subtitle: "Indumentaria oficial Fiat x Copa",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD75bkcVPZMdRZ1VxtjQeDEFJ5d6jWJ2Jco6WJgm0gnOGEh9scr-1p9-wdjM-3CM77rSxtvKMlAPmNZOKjFDDy6tGYo1LU_8qhChoLybZfR-Wym6p7HfDVcCzIShZ6E9aiVuD_n9o64bIx2CZJ-rEZJdQfLFWnXBgxRmJmyc2K2VU3BO0ql6T4WaXVovzp0rHKQj9_tUUxwXcjoUhBA8DGK-DhD2er_Ae0lqH8_lS2hT7KSsn5Ad0al5gpUKl4uPYB-yUUsj8t6qZP1",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="legacy-hero gsap-reveal">
        <div className="legacy-hero-content" data-speed="0.95">
          <h1 className="impact-title legacy-title-xl gsap-reveal-text">
            Viví la pasión y{" "}
            <span style={{ color: "#36c3f2" }}>ganá con Fiat</span>
          </h1>
          <p className="legacy-subtitle gsap-reveal-text">
            La Copa Argentina se vive diferente arriba de un Fiat. Participá por
            experiencias únicas, premios exclusivos y el auto de tus sueños.
          </p>
          <div className="legacy-btn-row gsap-reveal-text">
            <Link href="/registro" className="legacy-btn-hero-primary">
              Registrate ahora
            </Link>
            <Link href="/login" className="legacy-btn-hero-secondary">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <section className="legacy-steps gsap-reveal">
        <div className="container">
          <h2 className="impact-title legacy-section-title gsap-reveal-text">
            ¿Cómo participar?
          </h2>
          <div className="legacy-step-underline" />
          <div className="legacy-steps-grid">
            <SpotlightCard
              className="legacy-step-card gsap-reveal"
              spotlightColor="rgba(54, 195, 242, 0.22)"
            >
              <div className="legacy-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm0 2.1c-2.9 0-7 1.5-7 4.2V21h11.2v-2H7v-.8c0-1.2 2.5-2.3 5-2.3 1 0 1.9.2 2.8.5l1.5-1.5c-1.3-.5-2.7-.8-4.3-.8zm7.7.1-4 4-1.7-1.7-1.4 1.4 3.1 3.1 5.4-5.4-1.4-1.4z" />
                </svg>
              </div>
              <p className="impact-title legacy-step-num">01</p>
              <h3>Registrate en el portal</h3>
              <p>
                Creá tu perfil oficial y vinculá tus datos para empezar a sumar
                chances en cada partido.
              </p>
            </SpotlightCard>
            <SpotlightCard
              className="legacy-step-card gsap-reveal"
              spotlightColor="rgba(249, 237, 61, 0.16)"
            >
              <div className="legacy-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H7v2H5.5a.5.5 0 0 0-.5.5v1H3v5h2v1a.5.5 0 0 0 .5.5H7v2H5.5A2.5 2.5 0 0 1 3 15.5V8.5zm18 0v7a2.5 2.5 0 0 1-2.5 2.5H17v-2h1.5a.5.5 0 0 0 .5-.5v-1h2v-5h-2v-1a.5.5 0 0 0-.5-.5H17V6h1.5A2.5 2.5 0 0 1 21 8.5zM9 8h6v8H9V8zm2 2v4h2v-4h-2z" />
                </svg>
              </div>
              <p className="impact-title legacy-step-num">02</p>
              <h3>Participá en sorteos</h3>
              <p>
                Sumate a las promociones vigentes durante los encuentros de la
                Copa Argentina.
              </p>
            </SpotlightCard>
            <SpotlightCard
              className="legacy-step-card gsap-reveal"
              spotlightColor="rgba(237, 26, 107, 0.18)"
            >
              <div className="legacy-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M7 4h10v3h3v3c0 2.7-1.9 5-4.5 5.6A4.7 4.7 0 0 1 12 18a4.7 4.7 0 0 1-3.5-2.4C5.9 15 4 12.7 4 10V7h3V4zm2 2v3H6v1c0 1.4.9 2.6 2.1 3 .4-1 1.2-1.8 2.2-2.3V6H9zm6 0h-1v4.7c1 .5 1.8 1.3 2.2 2.3 1.2-.4 2.1-1.6 2.1-3V9h-3V6zM9 20h6v2H9v-2z" />
                </svg>
              </div>
              <p className="impact-title legacy-step-num">03</p>
              <h3>Conocé resultados oficiales</h3>
              <p>
                Revisá los ganadores publicados y seguí participando en cada
                nuevo sorteo disponible.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <section className="legacy-prizes gsap-reveal">
        <div className="container">
          <h2 className="impact-title legacy-section-title gsap-reveal-text">
            Premios <span style={{ color: "#36c3f2" }}>exclusivos</span>
          </h2>
          <div className="legacy-prizes-grid">
            {prizeCards.map((card) => (
              <article
                key={card.title}
                className="legacy-prize-card gsap-reveal"
                style={{ "--prize-image": `url("${card.image}")` }}
              >
                <div className="legacy-prize-bg" />
                <div className="legacy-prize-overlay">
                  <h3 className="impact-title legacy-prize-title">
                    {card.title}
                  </h3>
                  <p>{card.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="legacy-home-cta gsap-reveal">
        <h3 className="impact-title legacy-section-title gsap-reveal-text">
          ¿Qué estás esperando?
        </h3>
        <p className="gsap-reveal-text">Registrate hoy y empezá a ganar</p>
        <Link href="/registro" className="legacy-btn-inline">
          Registrate ahora
        </Link>
      </section>
    </main>
  );
}
