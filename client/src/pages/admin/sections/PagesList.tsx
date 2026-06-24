import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../admin.module.css';
import { listPages, deletePage, patchPage } from '../../../api/content';
import { ApiError } from '../../../api/client';
import type { Page } from '../../../api/types';
import Toggle from '../components/Toggle';

type Filter = 'all' | 'live' | 'draft';

const PagesList: React.FC = () => {
  const { lang = 'ro' } = useParams();
  const base = `/${lang}/admin`;
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPages(true);
      setPages(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pages.filter((p) => {
      if (filter === 'live' && !p.published) return false;
      if (filter === 'draft' && p.published) return false;
      if (!q) return true;
      return [p.title_en, p.title_ro, p.title_ru, p.link, p.type]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(q));
    });
  }, [pages, search, filter]);

  const togglePublish = async (p: Page) => {
    setPages((prev) => prev.map((x) => (x._id === p._id ? { ...x, published: !x.published } : x)));
    try {
      await patchPage(p._id, { published: !p.published });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update');
      load();
    }
  };

  const remove = async (p: Page) => {
    if (!window.confirm(`Delete page "/${p.link}"?`)) return;
    try {
      await deletePage(p._id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  };

  const liveCount = pages.filter((p) => p.published).length;

  return (
    <div>
      <div className={styles.section_head}>
        <div>
          <h1 className={styles.section_title}>Pages</h1>
          <p className={styles.subtle}>
            {pages.length} total · {liveCount} live · {pages.length - liveCount} drafts
          </p>
        </div>
        <Link className={styles.btn} to={`${base}/pages/new`}>
          + Add Page
        </Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar_row}>
        <input
          className={styles.search}
          placeholder="Search pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {(['all', 'live', 'draft'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`${styles.filter} ${filter === f ? styles.filter_active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className={styles.muted}>Loading…</p>
      ) : visible.length === 0 ? (
        <p className={styles.muted}>No pages.</p>
      ) : (
        <div className={styles.list}>
          {visible.map((p) => (
            <div key={p._id} className={styles.list_row}>
              <Link to={`${base}/pages/${p._id}`} className={styles.list_main}>
                <div className={styles.list_title}>{p.title_en || p.title_ro || p.link}</div>
                <div className={styles.list_meta}>
                  /{p.link}
                  {p.type && ` · ${p.type}`}
                </div>
              </Link>
              <a
                className={styles.preview_link}
                href={`/${lang}/${p.link}`}
                target="_blank"
                rel="noreferrer"
                title="Open on site"
              >
                ↗
              </a>
              <Toggle
                checked={p.published}
                onChange={() => togglePublish(p)}
                labelOn="Live"
                labelOff="Hidden"
              />
              <div className={styles.list_actions}>
                <Link className={styles.icon_btn} to={`${base}/pages/${p._id}`}>
                  Edit
                </Link>
                <button
                  className={`${styles.icon_btn} ${styles.icon_btn_danger}`}
                  onClick={() => remove(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagesList;
