export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-brand">
          <img src="/fiatlogo.png" alt="Logo Fiat" className="site-footer-logo" />
          <div>
            <p className="site-footer-title">FIAT GIAMA MAR DEL PLATA</p>
            <p className="site-footer-copy">© Copyright Stellantis 2026</p>
          </div>
        </div>

        <div className="site-footer-social">
          <a href="https://www.facebook.com/GiamaAutos/" target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.5 8.5V6.8c0-.7.5-.8.8-.8h2.1V2.7l-2.9-.1c-3.2 0-3.9 2.4-3.9 4v1.9H7v3.7h2.6v9.1h3.9v-9.1h2.6l.4-3.7h-3z" />
            </svg>
          </a>
          <a href="https://www.instagram.com/giama_fiat/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4zm8.8 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
          </a>
          <a href="https://wa.me/92236338200" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 3.5A11.8 11.8 0 0 0 2.8 18.2L2 22l3.9-1a11.8 11.8 0 0 0 5.6 1.4h.1A11.8 11.8 0 0 0 20.5 3.5zM12 20.4a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-2.3.6.6-2.2-.2-.4A9.8 9.8 0 1 1 12 20.4zm5.5-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.8.2s-.9.9-1 .9c-.2 0-.4 0-.7-.2a8 8 0 0 1-2.4-2.1c-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.4 0-.5l-.8-2c-.2-.4-.4-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.5 1 2.6c.2.2 2 3.1 4.9 4.4.7.3 1.2.5 1.6.7.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
