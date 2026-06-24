// Modal for building an image-gallery block: upload several images, reorder /
// remove them, choose column count and styling, then insert the HTML block.
import React, { useRef, useState } from 'react';
import styles from './RichTextEditor.module.css';
import { uploadImage } from '../../api/content';
import { errorMessage } from '../../api/client';

interface Props {
  onClose: () => void;
  onInsert: (html: string) => void;
}

const GAP = 10; // px — matches the public .gallery gap

const GalleryInsertDialog: React.FC<Props> = ({ onClose, onInsert }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [columns, setColumns] = useState(3);
  const [rounded, setRounded] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (files: FileList | null) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setBusy(true);
    setError(null);
    setProgress({ done: 0, total: list.length });
    const added: string[] = [];
    try {
      for (let i = 0; i < list.length; i++) {
        const { image } = await uploadImage(list[i]);
        added.push(image.url);
        setProgress({ done: i + 1, total: list.length });
      }
    } catch (err) {
      setError(errorMessage(err, 'Upload failed'));
    } finally {
      setUrls((prev) => [...prev, ...added]);
      setBusy(false);
      setProgress(null);
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= urls.length) return;
    const next = [...urls];
    [next[i], next[t]] = [next[t], next[i]];
    setUrls(next);
  };
  const removeAt = (i: number) => setUrls((u) => u.filter((_, idx) => idx !== i));

  const insert = () => {
    if (!urls.length) return;
    const colW = `calc((100% - ${(columns - 1) * GAP}px) / ${columns})`;
    const imgStyle = `width:${colW};object-fit:cover;${rounded ? 'border-radius:8px;' : ''}`;
    const imgs = urls.map((u) => `<img src="${u}" alt="" style="${imgStyle}" />`).join('');
    onInsert(`<div class="gallery" style="gap:${GAP}px;">${imgs}</div><p></p>`);
    onClose();
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.dialog} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.dialog_head}>
          <h3>Insert image gallery</h3>
          <button className={styles.dialog_x} onClick={onClose}>
            ✕
          </button>
        </div>

        <p className={styles.dialog_info}>
          Upload several images and they’ll be inserted as a responsive gallery block
          (<code>&lt;div class="gallery"&gt;</code>). Reorder or remove before inserting, and
          choose how many columns to show.
        </p>

        <div className={styles.dialog_row}>
          <label>
            Columns
            <select value={columns} onChange={(e) => setColumns(Number(e.target.value))}>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <label className={styles.dialog_check}>
            <input
              type="checkbox"
              checked={rounded}
              onChange={(e) => setRounded(e.target.checked)}
            />
            Rounded corners
          </label>
          <button
            type="button"
            className={styles.dialog_add}
            onClick={() => fileRef.current?.click()}
            disabled={busy}
          >
            {busy && progress ? `Uploading ${progress.done}/${progress.total}…` : '+ Add images'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {error && <div className={styles.dialog_error}>{error}</div>}

        {urls.length === 0 ? (
          <p className={styles.dialog_empty}>No images yet.</p>
        ) : (
          <div className={styles.dialog_grid}>
            {urls.map((u, i) => (
              <div key={u + i} className={styles.dialog_tile}>
                <img src={u} alt="" />
                <div className={styles.dialog_tile_tools}>
                  <button onClick={() => move(i, -1)} disabled={i === 0} title="Move left">
                    ◀
                  </button>
                  <span>{i + 1}</span>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === urls.length - 1}
                    title="Move right"
                  >
                    ▶
                  </button>
                  <button className={styles.dialog_del} onClick={() => removeAt(i)} title="Remove">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.dialog_actions}>
          <button className={styles.dialog_primary} onClick={insert} disabled={!urls.length || busy}>
            Insert gallery ({urls.length})
          </button>
          <button className={styles.dialog_ghost} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryInsertDialog;
