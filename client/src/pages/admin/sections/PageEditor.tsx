import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../admin.module.css';
import { getPage, createPage, updatePage } from '../../../api/content';
import { errorMessage } from '../../../api/client';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';
import type { Lang } from '../../../api/types';

interface FormState {
  link: string;
  type: string;
  title_ro: string;
  title_ru: string;
  title_en: string;
  content_ro: string;
  content_ru: string;
  content_en: string;
  published: boolean;
}

const emptyForm: FormState = {
  link: '',
  type: '',
  title_ro: '',
  title_ru: '',
  title_en: '',
  content_ro: '',
  content_ru: '',
  content_en: '',
  published: true,
};

const LANGS: { code: Lang; name: string }[] = [
  { code: 'ro', name: 'Română' },
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
];

const PageEditor: React.FC = () => {
  const { lang = 'ro', id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const base = `/${lang}/admin`;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  // A page is only functional if it has a valid routable slug.
  const validate = (): boolean => {
    const link = form.link.trim();
    if (!link) {
      setLinkError('A page link (slug) is required.');
      return false;
    }
    if (!/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/i.test(link)) {
      setLinkError('Use only letters, numbers, hyphens and slashes (e.g. project/my-page).');
      return false;
    }
    setLinkError(null);
    return true;
  };

  const hasTitle = !!(form.title_ro || form.title_ru || form.title_en);
  const canSave = !!form.link.trim() && hasTitle;

  useEffect(() => {
    if (isNew) return;
    let active = true;
    (async () => {
      try {
        const { data } = await getPage(id!);
        if (!active) return;
        setForm({
          link: data.link,
          type: data.type,
          title_ro: data.title_ro,
          title_ru: data.title_ru,
          title_en: data.title_en,
          content_ro: data.content_ro,
          content_ru: data.content_ru,
          content_en: data.content_en,
          published: data.published,
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
  }, [id, isNew]);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      setError('Please fix the highlighted fields before saving.');
      return;
    }
    if (!hasTitle) {
      setError('Add a title in at least one language so the page is usable.');
      return;
    }

    setSaving(true);
    try {
      if (isNew) await createPage({ ...form, link: form.link.trim() });
      else await updatePage(id!, { ...form, link: form.link.trim() });
      navigate(`${base}/pages`);
    } catch (err) {
      setError(errorMessage(err, 'Failed to save page'));
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.muted}>Loading…</p>;

  return (
    <div>
      <div className={styles.breadcrumb}>
        <button className={styles.back} onClick={() => navigate(`${base}/pages`)}>
          ← Pages
        </button>
        <span className={styles.crumb_sep}>/</span>
        <span>{isNew ? 'New page' : `/${form.link}`}</span>
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
            <span className={styles.lang_name}>
              {LANGS.find((l) => l.code === activeLang)?.name}
            </span>
          </div>

          <div className={styles.field}>
            <label>Title ({activeLang})</label>
            <input
              className={styles.input}
              value={form[`title_${activeLang}` as keyof FormState] as string}
              onChange={(e) =>
                set({ [`title_${activeLang}`]: e.target.value } as Partial<FormState>)
              }
            />
          </div>

          <div className={styles.field}>
            <label>Content ({activeLang})</label>
            <RichTextEditor
              key={activeLang}
              value={form[`content_${activeLang}` as keyof FormState] as string}
              onChange={(html) =>
                set({ [`content_${activeLang}`]: html } as Partial<FormState>)
              }
              placeholder="Write the page content…"
            />
          </div>
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
              <button className={styles.btn} type="submit" disabled={saving || !canSave}>
                {saving ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
              </button>
            </div>
            {!canSave && (
              <p className={styles.hint}>A slug and at least one title are required.</p>
            )}
          </div>

          <div className={styles.side_card}>
            <div className={styles.side_title}>Settings</div>
            <div className={styles.field}>
              <label>
                Link / slug <span className={styles.req}>*</span>
              </label>
              <input
                className={`${styles.input} ${linkError ? styles.input_error : ''}`}
                placeholder="project/trafficking-escape"
                value={form.link}
                onChange={(e) => {
                  set({ link: e.target.value });
                  if (linkError) setLinkError(null);
                }}
                required
              />
              {linkError ? (
                <p className={styles.field_error}>{linkError}</p>
              ) : (
                <p className={styles.hint}>No leading slash, no language prefix.</p>
              )}
            </div>
            <div className={styles.field}>
              <label>Type</label>
              <input
                className={styles.input}
                placeholder="Project / News / Event"
                value={form.type}
                onChange={(e) => set({ type: e.target.value })}
              />
            </div>
            {form.link && (
              <a
                className={styles.preview_full}
                href={`/${lang}/${form.link}`}
                target="_blank"
                rel="noreferrer"
              >
                Open /{lang}/{form.link} ↗
              </a>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
};

export default PageEditor;
