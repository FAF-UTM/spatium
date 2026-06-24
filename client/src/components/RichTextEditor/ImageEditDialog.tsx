// Editing popup for a single <img> inside the editor. Mutates the live DOM node
// and calls onChange() so the parent can re-emit HTML + refresh overlays.
// Works for standalone images and images inside a .gallery block.
import React, { useRef, useState } from 'react';
import styles from './RichTextEditor.module.css';
import { uploadImage } from '../../api/content';
import { errorMessage } from '../../api/client';

interface Props {
  img: HTMLImageElement;
  onChange: () => void;
  onClose: () => void;
}

const WIDTHS = [
  { label: 'Auto', value: '' },
  { label: '25%', value: '25%' },
  { label: '50%', value: '50%' },
  { label: '75%', value: '75%' },
  { label: '100%', value: '100%' },
];

const ImageEditDialog: React.FC<Props> = ({ img, onChange, onClose }) => {
  const [, force] = useState(0);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gallery = img.closest('.gallery') as HTMLElement | null;
  const galleryImgs = gallery
    ? (Array.from(gallery.querySelectorAll(':scope > img')) as HTMLImageElement[])
    : [];
  const galleryIndex = gallery ? galleryImgs.indexOf(img) : -1;

  const apply = (fn: () => void) => {
    fn();
    onChange();
    force((n) => n + 1);
  };

  // Derived current state.
  const alt = img.getAttribute('alt') || '';
  const width = img.style.width || '';
  const rounded = !!img.style.borderRadius;
  const shadow = !!img.style.boxShadow;
  const linkEl = img.closest('a') as HTMLAnchorElement | null;
  const href = linkEl?.getAttribute('href') || '';
  const currentAlign =
    img.style.cssFloat === 'left'
      ? 'left'
      : img.style.cssFloat === 'right'
        ? 'right'
        : img.style.display === 'block'
          ? 'center'
          : 'none';

  const setAlign = (a: string) =>
    apply(() => {
      img.style.cssFloat = '';
      img.style.display = '';
      img.style.margin = '';
      if (a === 'left') {
        img.style.cssFloat = 'left';
        img.style.margin = '0 16px 8px 0';
      } else if (a === 'right') {
        img.style.cssFloat = 'right';
        img.style.margin = '0 0 8px 16px';
      } else if (a === 'center') {
        img.style.display = 'block';
        img.style.margin = '8px auto';
      }
    });

  const setLink = (value: string) =>
    apply(() => {
      const a = img.closest('a') as HTMLAnchorElement | null;
      if (value) {
        if (a) a.setAttribute('href', value);
        else {
          const na = document.createElement('a');
          na.setAttribute('href', value);
          na.setAttribute('target', '_blank');
          na.setAttribute('rel', 'noopener noreferrer');
          img.replaceWith(na);
          na.appendChild(img);
        }
      } else if (a) {
        a.replaceWith(img);
      }
    });

  const moveInGallery = (dir: -1 | 1) =>
    apply(() => {
      if (!gallery) return;
      if (dir < 0 && img.previousElementSibling) {
        gallery.insertBefore(img, img.previousElementSibling);
      } else if (dir > 0 && img.nextElementSibling) {
        gallery.insertBefore(img.nextElementSibling, img);
      }
    });

  const removeFromGallery = () =>
    apply(() => {
      if (!gallery || !gallery.parentNode) return;
      img.style.width = '';
      img.style.height = '';
      gallery.parentNode.insertBefore(img, gallery.nextSibling);
      if (!gallery.querySelector('img')) gallery.remove();
    });

  const deleteImg = () => {
    const g = img.closest('.gallery');
    img.remove();
    if (g && !g.querySelector('img')) g.remove();
    onChange();
    onClose();
  };

  const replace = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { image } = await uploadImage(file);
      apply(() => {
        img.src = image.url;
      });
    } catch (err) {
      setError(errorMessage(err, 'Replace failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.dialog} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.dialog_head}>
          <h3>Edit image{gallery ? ` · gallery ${galleryIndex + 1}/${galleryImgs.length}` : ''}</h3>
          <button className={styles.dialog_x} onClick={onClose}>
            ✕
          </button>
        </div>

        <img src={img.src} alt="" className={styles.dialog_preview} />
        {error && <div className={styles.dialog_error}>{error}</div>}

        {gallery && (
          <div className={styles.dialog_section}>
            <span className={styles.dialog_label}>Position in gallery</span>
            <div className={styles.dialog_btnrow}>
              <button onClick={() => moveInGallery(-1)} disabled={galleryIndex <= 0}>
                ◀ Move left
              </button>
              <button
                onClick={() => moveInGallery(1)}
                disabled={galleryIndex === galleryImgs.length - 1}
              >
                Move right ▶
              </button>
              <button onClick={removeFromGallery}>Take out of gallery</button>
            </div>
          </div>
        )}

        {!gallery && (
          <>
            <div className={styles.dialog_section}>
              <span className={styles.dialog_label}>Width</span>
              <div className={styles.dialog_btnrow}>
                {WIDTHS.map((w) => (
                  <button
                    key={w.label}
                    className={width === w.value ? styles.dialog_on : ''}
                    onClick={() =>
                      apply(() => {
                        img.style.width = w.value;
                        img.style.height = w.value ? 'auto' : '';
                      })
                    }
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.dialog_section}>
              <span className={styles.dialog_label}>Alignment</span>
              <div className={styles.dialog_btnrow}>
                {['left', 'center', 'right', 'none'].map((a) => (
                  <button
                    key={a}
                    className={currentAlign === a ? styles.dialog_on : ''}
                    onClick={() => setAlign(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className={styles.dialog_section}>
          <span className={styles.dialog_label}>Style</span>
          <div className={styles.dialog_btnrow}>
            <label className={styles.dialog_check}>
              <input
                type="checkbox"
                checked={rounded}
                onChange={(e) => apply(() => (img.style.borderRadius = e.target.checked ? '8px' : ''))}
              />
              Rounded
            </label>
            <label className={styles.dialog_check}>
              <input
                type="checkbox"
                checked={shadow}
                onChange={(e) =>
                  apply(
                    () =>
                      (img.style.boxShadow = e.target.checked
                        ? '0 4px 14px rgba(0,0,0,0.18)'
                        : '')
                  )
                }
              />
              Shadow
            </label>
          </div>
        </div>

        <div className={styles.dialog_section}>
          <span className={styles.dialog_label}>Alt text (accessibility / SEO)</span>
          <input
            className={styles.dialog_input}
            defaultValue={alt}
            placeholder="Describe the image…"
            onBlur={(e) => apply(() => img.setAttribute('alt', e.target.value))}
          />
        </div>

        <div className={styles.dialog_section}>
          <span className={styles.dialog_label}>Link (wrap image in a link)</span>
          <input
            className={styles.dialog_input}
            defaultValue={href}
            placeholder="https://…  (leave empty to remove)"
            onBlur={(e) => setLink(e.target.value.trim())}
          />
        </div>

        <div className={styles.dialog_actions}>
          <button
            className={styles.dialog_ghost}
            onClick={() => replaceRef.current?.click()}
            disabled={busy}
          >
            {busy ? 'Uploading…' : 'Replace image'}
          </button>
          <button className={styles.dialog_danger} onClick={deleteImg}>
            Delete image
          </button>
          <button className={styles.dialog_primary} onClick={onClose}>
            Done
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              replace(e.target.files?.[0] ?? null);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageEditDialog;
