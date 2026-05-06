import { NavLink, Outlet } from "react-router-dom";
import { WhatsAppShareButton } from "./WhatsAppShareButton";
import "../styles/app.css";

function LogoutButton() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        cursor: 'pointer',
        color: 'var(--muted)'
      }}
    >
      Logout
    </button>
  );
}

const nav = [
  { to: "/", label: "Home", labelHi: "होम", end: true },
  { to: "/dashboard", label: "Dashboard", labelHi: "डैशबोर्ड", end: false },
  { to: "/slogans", label: "Slogans", labelHi: "नारे", end: false },
  { to: "/premium", label: "Premium", labelHi: "प्रीमियम", end: false },
] as const;

function IconHome({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={active ? "var(--green-dark)" : "currentColor"} strokeWidth="2">
      <path d="M4 11.5L12 5l8 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDashboard({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={active ? "var(--green-dark)" : "currentColor"} strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconSlogans({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={active ? "var(--green-dark)" : "currentColor"} strokeWidth="2">
      <path d="M8 12h8M8 16h6" strokeLinecap="round" />
      <path d="M4 8l3-3 3 3M20 8l-3-3-3 3" strokeLinecap="round" />
    </svg>
  );
}

function IconPremium({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={active ? "var(--green-dark)" : "currentColor"} strokeWidth="2">
      <path d="M12 3l2.2 5h5l-4 3 1.5 5L12 15l-4.7 1 1.5-5-4-3h5L12 3z" strokeLinejoin="round" />
    </svg>
  );
}

const icons = [IconHome, IconDashboard, IconSlogans, IconPremium];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <NavLink className="brand-mini" to="/" aria-label="Chunav Mitra — Home">
          <span className="flag-dot" aria-hidden />
          <span className="brand-text">
            <strong>Chunav Mitra</strong>
            <span>Bihar Panchayat Elections 2026</span>
          </span>
        </NavLink>
        <div className="top-bar-end">
          <WhatsAppShareButton />
          <LogoutButton />
          <nav className="desktop-nav" aria-label="Main">
            {nav.map(({ to, label, end }) => (
              <NavLink
                key={to}
                className={({ isActive }) => `pill-link${isActive ? " primary" : ""}`}
                to={to}
                end={end}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="Quick navigation">
        {nav.map(({ to, labelHi, label, end }, i) => {
          const Icon = icons[i];
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span>
                    {labelHi} · {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
