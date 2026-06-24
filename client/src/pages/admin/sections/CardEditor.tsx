import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../admin.module.css';
import { getCard, createCard, updateCard } from '../../../api/content';
import { errorMessage } from '../../../api/client';
import ImageGalleryManager from '../components/ImageGalleryManager';
import type { CardResource, GalleryImage, Lang } from '../../../api/types';

interface Props {
  resource: CardResource;
  label: string;
  hasImage?: boolean;
  // Enables the multi-image gallery manager (used by the Gallery section).
  multiImage?: boolean;
}

interface FormState {
  title_ro: string;
  title_ru: string;
  title_en: string;
  description_ro: string;
  description_ru: string;
  description_en: string;
  date: string;
  to: string;
  order: string;
  published: boolean;
  img: string;
  file: File | null;
  images: GalleryImage[];
}

const emptyForm: FormState = {
  title_ro: '',
  title_ru: '',
  title_en: '',
  description_ro: '',
  description_ru: '',
  description_en: '',
  date: '',
  to: '',
  order: '0',
  published: true,
  img: '',
  file: null,
  images: [],
};

const LANGS: { code: Lang; name: string }[] = [
  { code: 'ro', name: 'Română' },
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
];

const CardEditor: React.FC<Props> = ({ resource, label, hasImage = true, multiImage = false }) => {
  const { lang = 'ro', id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const base = `/${lang}/admin`;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    let active = true;
    (async () => {
      try {
        const { data } = await getCard(resource, id!);
        if (!active) return;
        setForm({
          title_ro: data.title_ro,
          title_ru: data.title_ru,
          title_en: data.title_en,
          description_ro: data.description_ro,
          description_ru: data.description_ru,
          description_en: data.description_en,
          date: data.date,
          to: data.to,
          order: String(data.order),
          published: data.published,
          img: data.img,
          file: null,
          images: data.images || [],
        });
      } catch (err) {
        setError(errorMessage(err, 'Failed to load'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [resource, id, isNew]);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  // An item needs at least one title to be meaningful on the public site.
  const hasTitle = !!(form.title_ro.trim() || form.title_ru.trim() || form.title_en.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasTitle) {
      setError('Add a title in at least one language before saving.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title_ro', form.title_ro);
      fd.append('title_ru', form.title_ru);
      fd.append('title_en', form.title_en);
      fd.append('description_ro', form.description_ro);
      fd.append('description_ru', form.description_ru);
      fd.append('description_en', form.description_en);
      fd.append('date', form.date);
      fd.append('to', form.to);
      fd.append('order', form.order || '0');
      fd.append('published', String(form.published));
      if (form.file) fd.append('image', form.file);
      if (multiImage) fd.append('images', JSON.stringify(form.images));

      if (isNew) await createCard(resource, fd);
      else await updateCard(resource, id!, fd);

      navigate(`${base}/${resource}`);
    } catch (err) {
      setError(errorMessage(err, 'Failed to save'));
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.muted}>Loading…</p>;

  return (
    <div>
      <div className={styles.breadcrumb}>
        <button className={styles.back} onClick={() => navigate(`${base}/${resource}`)}>
          ← {label}
        </button>
        <span className={styles.crumb_sep}>/</span>
        <span>{isNew ? `New ${label.replace(/s$/, '')}` : 'Edit'}</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.editor_grid} onSubmit={handleSubmit}>
        <div className={styles.editor_main}>
          <div className={styles.lang_tabs}>
            {LANGS.map((l) => (
              <button
                type="button"
                key={l.code}
                className={`${styles.lang_tab} ${
                  activeLang === l.code ? styles.lang_tab_active : ''
                }`}
                onClick={() => setActiveLang(l.code)}
              >
                {l.code}
              </button>
            ))}
            <span className={styles.lang_name}>{LANGS.find((l) => l.code === activeLang)?.name}</span>
          </div>

          <div className={styles.field}>
            <label>
              Title ({activeLang}) <span className={styles.req}>*</span>
            </label>
            <input
              className={`${styles.input} ${!hasTitle ? styles.input_error : ''}`}
              value={form[`title_${activeLang}` as keyof FormState] as string}
              onChange={(e) => set({ [`title_${activeLang}`]: e.target.value } as Partial<FormState>)}
            />
            {!hasTitle && (
              <p className={styles.field_error}>Required — fill in at least one language.</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Description ({activeLang})</label>
            <textarea
              className={styles.textarea}
              rows={5}
              value={form[`description_${activeLang}` as keyof FormState] as string}
              onChange={(e) =>
                set({ [`description_${activeLang}`]: e.target.value } as Partial<FormState>)
              }
            />
          </div>

          {multiImage && (
            <div className={styles.field}>
              <label>Gallery images</label>
              <ImageGalleryManager
                value={form.images}
                onChange={(images) => set({ images })}
              />
              <p className={styles.hint}>
                Add, remove and reorder images — saved to Cloudinary when you click Save.
              </p>
            </div>
          )}
        </div>

        <aside className={styles.editor_side}>
          <div className={styles.side_card}>
            <div className={styles.side_title}>Publish</div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set({ published: e.target.checked })}
              />
              <span>{form.published ? 'Visible on site' : 'Hidden (draft)'}</span>
            </label>
            <div className={styles.form_actions}>
              <button className={styles.btn} type="submit" disabled={saving || !hasTitle}>
                {saving ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
              </button>
            </div>
            {!hasTitle && <p className={styles.hint}>A title is required to save.</p>}
          </div>

          {hasImage && (
            <div className={styles.side_card}>
              <div className={styles.side_title}>Image</div>
              {(form.file || form.img) && (
                <img
                  className={styles.side_image}
                  src={form.file ? URL.createObjectURL(form.file) : form.img}
                  alt="preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => set({ file: e.target.files?.[0] ?? null })}
              />
              <p className={styles.hint}>Uploaded to Cloudinary on save.</p>
            </div>
          )}

          <div className={styles.side_card}>
            <div className={styles.side_title}>Meta</div>
            <div className={styles.field}>
              <label>Date</label>
              <input
                className={styles.input}
                placeholder="15.05.2025"
                value={form.date}
                onChange={(e) => set({ date: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Link (to)</label>
              <input
                className={styles.input}
                placeholder="/project/slug or https://…"
                value={form.to}
                onChange={(e) => set({ to: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Order</label>
              <input
                className={styles.input}
                type="number"
                value={form.order}
                onChange={(e) => set({ order: e.target.value })}
              />
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default CardEditor;
