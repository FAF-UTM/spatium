// Manage an ordered list of gallery images: upload (to Cloudinary), delete,
// and reorder. Controlled component — owns no server state.
import React, { useRef, useState } from 'react';
import styles from './ImageGalleryManager.module.css';
import { uploadImage } from '../../../api/content';
import { errorMessage } from '../../../api/client';
import type { GalleryImage } from '../../../api/types';

interface Props {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

const ImageGalleryManager: React.FC<Props> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (files: FileList | null) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setBusy(true);
    setError(null);
    setProgress({ done: 0, total: list.length });
    const added: GalleryImage[] = [];
    try {
      for (let i = 0; i < list.length; i++) {
        const { image } = await uploadImage(list[i]);
        added.push({ url: image.url, publicId: image.publicId });
        setProgress({ done: i + 1, total: list.length });
      }
      onChange([...value, ...added]);
    } catch (err) {
      setError(errorMessage(err, 'Upload failed'));
      if (added.length) onChange([...value, ...added]); // keep what succeeded
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.count}>{value.length} image{value.length === 1 ? '' : 's'}</span>
        <button
          type="button"
          className={styles.add}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy && progress
            ? `Uploading ${progress.done}/${progress.total}…`
            : '+ Add images'}
        </button>
        <input
          ref={inputRef}
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

      {error && <div className={styles.error}>{error}</div>}

      {value.length === 0 ? (
        <p className={styles.empty}>No images yet. Click “Add images” to upload.</p>
      ) : (
        <div className={styles.grid}>
          {value.map((img, i) => (
            <div key={img.publicId || img.url} className={styles.tile}>
              <img src={img.url} alt="" className={styles.thumb} />
              <div className={styles.tools}>
                <button
                  type="button"
                  title="Move left"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  ◀
                </button>
                <span className={styles.pos}>{i + 1}</span>
                <button
                  type="button"
                  title="Move right"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                >
                  ▶
                </button>
                <button
                  type="button"
                  className={styles.del}
                  title="Remove"
                  onClick={() => removeAt(i)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGalleryManager;
