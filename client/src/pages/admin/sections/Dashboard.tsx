import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../admin.module.css';
import { listCards, listPages, listUsers } from '../../../api/content';

interface Counts {
  news: number;
  projects: number;
  gallery: number;
  pages: number;
  users: number;
}

const Dashboard: React.FC = () => {
  const { lang = 'ro' } = useParams();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [news, projects, gallery, pages, users] = await Promise.all([
          listCards('news', true),
          listCards('projects', true),
          listCards('gallery', true),
          listPages(true),
          listUsers(),
        ]);
        if (active) {
          setCounts({
            news: news.data.length,
            projects: projects.data.length,
            gallery: gallery.data.length,
            pages: pages.data.length,
            users: users.data.length,
          });
        }
      } catch {
        if (active) setCounts({ news: 0, projects: 0, gallery: 0, pages: 0, users: 0 });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const base = `/${lang}/admin`;
  const cards = [
    { label: 'News', value: counts?.news, to: `${base}/news` },
    { label: 'Projects', value: counts?.projects, to: `${base}/projects` },
    { label: 'Gallery', value: counts?.gallery, to: `${base}/gallery` },
    { label: 'Pages', value: counts?.pages, to: `${base}/pages` },
    { label: 'Users', value: counts?.users, to: `${base}/users` },
  ];

  return (
    <div>
      <div className={styles.section_head}>
        <h1 className={styles.section_title}>Dashboard</h1>
      </div>

      <div className={styles.stats}>
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className={styles.stat_card}>
            <div className={styles.stat_value}>{c.value ?? '—'}</div>
            <div className={styles.stat_label}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div className={styles.panel}>
        <p className={styles.muted}>
          Manage all site content from the menu on the left. Add, edit and delete News,
          Projects, Gallery items and dynamic Pages — each supports Romanian, Russian and
          English. Images are uploaded to Cloudinary automatically. Use the Users section to
          add team members and the Account section to change your password.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
