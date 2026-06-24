// Admin dashboard shell: protected sidebar layout that renders the management
// sections via nested routes. Mounted at /:lang/admin/* in routesConfig.
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import styles from './admin.module.css';
import { useAuth } from '../../context/AuthContext';
import Dashboard from './sections/Dashboard';
import CardList from './sections/CardList';
import CardEditor from './sections/CardEditor';
import PagesList from './sections/PagesList';
import PageEditor from './sections/PageEditor';
import UsersManager from './sections/UsersManager';
import Account from './sections/Account';

const Admin: React.FC = () => {
  const { lang = 'ro' } = useParams();
  const navigate = useNavigate();
  const { user, loading, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Gate the whole area on an authenticated admin.
  useEffect(() => {
    if (loading) return;
    if (!user) navigate(`/${lang}/login`, { replace: true });
    else if (!isAdmin) navigate(`/${lang}/`, { replace: true });
  }, [loading, user, isAdmin, lang, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate(`/${lang}/login`, { replace: true });
  };

  if (loading || !isAdmin) {
    return <div className={styles.admin_loading}>Loading…</div>;
  }

  const base = `/${lang}/admin`;
  const navItems = [
    { to: base, label: 'Dashboard', end: true },
    { to: `${base}/news`, label: 'News' },
    { to: `${base}/projects`, label: 'Projects' },
    { to: `${base}/gallery`, label: 'Gallery' },
    { to: `${base}/pages`, label: 'Pages' },
    { to: `${base}/users`, label: 'Users' },
    { to: `${base}/account`, label: 'Account' },
  ];

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebar_open : ''}`}>
        <div className={styles.brand}>
          SPATIUM<span className={styles.brand_admin}>admin</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.nav_link} ${isActive ? styles.nav_link_active : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebar_footer}>
          <a href={`/${lang}/`} className={styles.view_site}>
            ← View site
          </a>
          <button className={styles.logout} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <span className={styles.topbar_user}>
            {user?.name || user?.username || user?.email}
          </span>
        </header>

        <div className={styles.content}>
          <Routes>
            <Route index element={<Dashboard />} />

            <Route path="news" element={<CardList resource="news" label="News" hasImage />} />
            <Route path="news/new" element={<CardEditor resource="news" label="News" hasImage />} />
            <Route path="news/:id" element={<CardEditor resource="news" label="News" hasImage />} />

            <Route
              path="projects"
              element={<CardList resource="projects" label="Projects" hasImage />}
            />
            <Route
              path="projects/new"
              element={<CardEditor resource="projects" label="Projects" hasImage />}
            />
            <Route
              path="projects/:id"
              element={<CardEditor resource="projects" label="Projects" hasImage />}
            />

            <Route
              path="gallery"
              element={<CardList resource="gallery" label="Gallery" hasImage />}
            />
            <Route
              path="gallery/new"
              element={<CardEditor resource="gallery" label="Gallery" hasImage multiImage />}
            />
            <Route
              path="gallery/:id"
              element={<CardEditor resource="gallery" label="Gallery" hasImage multiImage />}
            />

            <Route path="pages" element={<PagesList />} />
            <Route path="pages/new" element={<PageEditor />} />
            <Route path="pages/:id" element={<PageEditor />} />

            <Route path="users" element={<UsersManager />} />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>

      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
    </div>
  );
};

export default Admin;
