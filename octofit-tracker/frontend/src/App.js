import './App.css';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import octofitLogo from './assets/octofitapp-small.png';

const navItems = [
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

function App() {
  return (
    <div className="app-shell py-4 py-lg-5">
      <div className="container">
        <header className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden app-hero">
          <div className="card-body p-4 p-lg-5 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3 hero-brand-wrap">
              <img
                src={octofitLogo}
                alt="OctoFit Tracker logo"
                className="app-logo"
              />
              <div>
                <h1 className="display-6 fw-bold mb-2">OctoFit Tracker</h1>
                <p className="mb-0 text-body-secondary">
                  Activity logs, workouts, teams, and leaderboard progress in one dashboard.
                </p>
              </div>
            </div>
            <a
              href="https://getbootstrap.com/docs/5.3/getting-started/introduction/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Build better UI
            </a>
          </div>
        </header>

        <nav className="navbar navbar-expand-lg app-nav shadow-sm rounded-4 mb-4">
          <div className="container-fluid px-3">
            <span className="navbar-brand fw-semibold">Navigation</span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#octofit-navbar"
              aria-controls="octofit-navbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="octofit-navbar">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
                {navItems.map((item) => (
                  <li className="nav-item" key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `nav-link rounded-pill px-3 ${isActive ? 'active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
