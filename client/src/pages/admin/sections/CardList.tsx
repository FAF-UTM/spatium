import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../admin.module.css';
import { listCards, deleteCard, patchCard } from '../../../api/content';
import { ApiError } from '../../../api/client';
import type { Card, CardResource } from '../../../api/types';
import Toggle from '../components/Toggle';

interface Props {
  resource: CardResource;
  label: string;
  hasImage?: boolean;
}

type Filter = 'all' | 'live' | 'draft';

const CardList: React.FC<Props> = ({ resource, label, hasImage = true }) => {
  const { lang = 'ro' } = useParams();
  const base = `/${lang}/admin`;
  const [items, setItems] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCards(resource, true);
      setItems(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (filter === 'live' && !it.published) return false;
      if (filter === 'draft' && it.published) return false;
      if (!q) return true;
      return [it.title_en, it.title_ro, it.title_ru, it.to]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(q));
    });
  }, [items, search, filter]);

  const togglePublish = async (it: Card) => {
    // Optimistic update.
    setItems((prev) =>
      prev.map((p) => (p._id === it._id ? { ...p, published: !p.published } : p))
    );
    try {
      await patchCard(resource, it._id, { published: !it.published });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update');
      load();
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    // Swap their order values and persist both.
    const newItems = [...items];
    newItems[index] = b;
    newItems[target] = a;
    setItems(newItems);
    try {
      await Promise.all([
        patchCard(resource, a._id, { order: b.order }),
        patchCard(resource, b._id, { order: a.order }),
      ]);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to reorder');
      load();
    }
  };

  const remove = async (it: Card) => {
    if (!window.confirm(`Delete "${it.title_en || it.title_ro || 'item'}"?`)) return;
    try {
      await deleteCard(resource, it._id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  };

  const liveCount = items.filter((i) => i.published).length;

  return (
    <div>
      <div className={styles.section_head}>
        <div>
          <h1 className={styles.section_title}>{label}</h1>
          <p className={styles.subtle}>
            {items.length} total · {liveCount} live · {items.length - liveCount} drafts
          </p>
        </div>
        <Link className={styles.btn} to={`${base}/${resource}/new`}>
          + Add {label.replace(/s$/, '')}
        </Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar_row}>
        <input
          className={styles.search}
          placeholder={`Search ${label.toLowerCase()}…`}
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
        <p className={styles.muted}>Nothing here yet.</p>
      ) : (
        <div className={styles.list}>
          {visible.map((it) => {
            // Reorder uses the unfiltered index for correctness.
            const realIndex = items.findIndex((x) => x._id === it._id);
            return (
              <div key={it._id} className={styles.list_row}>
                <div className={styles.reorder}>
                  <button
                    className={styles.reorder_btn}
                    title="Move up"
                    disabled={realIndex === 0 || filter !== 'all' || !!search}
                    onClick={() => move(realIndex, -1)}
                  >
                    ▲
                  </button>
                  <button
                    className={styles.reorder_btn}
                    title="Move down"
                    disabled={
                      realIndex === items.length - 1 || filter !== 'all' || !!search
                    }
                    onClick={() => move(realIndex, 1)}
                  >
                    ▼
                  </button>
                </div>

                {hasImage &&
                  (it.img ? (
                    <img className={styles.list_thumb} src={it.img} alt="" />
                  ) : (
                    <div className={styles.list_thumb} />
                  ))}

                <Link to={`${base}/${resource}/${it._id}`} className={styles.list_main}>
                  <div className={styles.list_title}>
                    {it.title_en || it.title_ro || it.title_ru || '(untitled)'}
                  </div>
                  <div className={styles.list_meta}>
                    {it.date && `${it.date} · `}
                    {it.to || 'no link'}
                  </div>
                </Link>

                <Toggle
                  checked={it.published}
                  onChange={() => togglePublish(it)}
                  labelOn="Live"
                  labelOff="Hidden"
                />

                <div className={styles.list_actions}>
                  <Link className={styles.icon_btn} to={`${base}/${resource}/${it._id}`}>
                    Edit
                  </Link>
                  <button
                    className={`${styles.icon_btn} ${styles.icon_btn_danger}`}
                    onClick={() => remove(it)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {(filter !== 'all' || search) && (
        <p className={styles.hint}>Reordering is available when no search/filter is applied.</p>
      )}
    </div>
  );
};

export default CardList;
