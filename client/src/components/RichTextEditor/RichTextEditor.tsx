// A dependency-free WYSIWYG HTML editor built on contentEditable +
// document.execCommand. Outputs HTML compatible with the public site's
// dangerouslySetInnerHTML rendering. Images (standalone or inside a
// .gallery block) get a floating edit badge that opens an image-editing popup;
// the gallery button opens a builder dialog.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './RichTextEditor.module.css';
import { uploadImage } from '../../api/content';
import GalleryInsertDialog from './GalleryInsertDialog';
import ImageEditDialog from './ImageEditDialog';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface Overlay {
  el: HTMLImageElement;
  top: number;
  left: number;
}

const FONT_SIZES = [
  { label: 'Small', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Medium', value: '4' },
  { label: 'Large', value: '5' },
  { label: 'X-Large', value: '6' },
  { label: 'Huge', value: '7' },
];

const BLOCKS = [
  { label: 'Paragraph', value: 'P' },
  { label: 'Heading 1', value: 'H1' },
  { label: 'Heading 2', value: 'H2' },
  { label: 'Heading 3', value: 'H3' },
  { label: 'Quote', value: 'BLOCKQUOTE' },
];

const RichTextEditor: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const rafRef = useRef(0);

  const [busy, setBusy] = useState(false);
  const [sourceMode, setSourceMode] = useState(false);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [editImg, setEditImg] = useState<HTMLImageElement | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  const emit = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  // Recompute the position of an edit badge over each image's top-right corner.
  const refreshOverlays = useCallback(() => {
    const wrap = wrapRef.current;
    const editor = editorRef.current;
    if (!wrap || !editor || sourceMode) {
      setOverlays([]);
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const imgs = Array.from(editor.querySelectorAll('img')) as HTMLImageElement[];
    setOverlays(
      imgs.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top - wrapRect.top + 6, left: r.right - wrapRect.left - 30 };
      })
    );
  }, [sourceMode]);

  const scheduleRefresh = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(refreshOverlays);
  }, [refreshOverlays]);

  // Sync external value into the editor without clobbering the caret while typing.
  useEffect(() => {
    if (sourceMode) return;
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
      scheduleRefresh();
    }
  }, [value, sourceMode, scheduleRefresh]);

  // Keep badges aligned as content/images/size change.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const mo = new MutationObserver(scheduleRefresh);
    mo.observe(editor, { childList: true, subtree: true, attributes: true });
    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(editor);
    window.addEventListener('resize', scheduleRefresh);
    scheduleRefresh();
    return () => {
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', scheduleRefresh);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleRefresh]);

  const saveSelection = () => {
    const sel = window.getSelection();
    savedRange.current = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
  };
  const restoreSelection = () => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    if (['fontSize', 'foreColor', 'hiliteColor'].includes(command)) {
      document.execCommand('styleWithCSS', false, 'true');
    }
    document.execCommand(command, false, arg);
    emit();
  };

  const insertHTML = (html: string) => {
    restoreSelection();
    document.execCommand('insertHTML', false, html);
    emit();
    scheduleRefresh();
  };

  const handleLink = () => {
    saveSelection();
    const url = window.prompt('Link URL (https://… or /internal-path):', 'https://');
    if (!url) return;
    restoreSelection();
    exec('createLink', url);
  };

  const openImage = () => {
    saveSelection();
    imageInput.current?.click();
  };

  const onImagePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const { image } = await uploadImage(file);
      insertHTML(`<img src="${image.url}" alt="" style="max-width:100%;border-radius:8px;" />`);
    } catch {
      window.alert('Image upload failed');
    } finally {
      setBusy(false);
    }
  };

  const Btn = ({
    cmd,
    arg,
    title,
    children,
  }: {
    cmd: string;
    arg?: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      className={styles.tool}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd, arg)}
    >
      {children}
    </button>
  );

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.toolbar}>
        <select
          className={styles.select}
          title="Text style"
          onChange={(e) => {
            exec('formatBlock', e.target.value);
            e.target.selectedIndex = 0;
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Style
          </option>
          {BLOCKS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          title="Font size"
          onChange={(e) => {
            exec('fontSize', e.target.value);
            e.target.selectedIndex = 0;
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Size
          </option>
          {FONT_SIZES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <span className={styles.divider} />
        <Btn cmd="bold" title="Bold (Ctrl+B)">
          <b>B</b>
        </Btn>
        <Btn cmd="italic" title="Italic (Ctrl+I)">
          <i>I</i>
        </Btn>
        <Btn cmd="underline" title="Underline (Ctrl+U)">
          <u>U</u>
        </Btn>
        <Btn cmd="strikeThrough" title="Strikethrough">
          <s>S</s>
        </Btn>

        <label className={styles.color} title="Text color" onMouseDown={(e) => e.preventDefault()}>
          A
          <input type="color" onChange={(e) => exec('foreColor', e.target.value)} defaultValue="#231f20" />
        </label>

        <span className={styles.divider} />
        <Btn cmd="insertUnorderedList" title="Bulleted list">
          •
        </Btn>
        <Btn cmd="insertOrderedList" title="Numbered list">
          1.
        </Btn>
        <Btn cmd="justifyLeft" title="Align left">
          ⬅
        </Btn>
        <Btn cmd="justifyCenter" title="Align center">
          ⬌
        </Btn>
        <Btn cmd="justifyRight" title="Align right">
          ➡
        </Btn>

        <span className={styles.divider} />
        <button
          type="button"
          className={styles.tool}
          title="Insert link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
        >
          🔗
        </button>
        <Btn cmd="unlink" title="Remove link">
          ⛓
        </Btn>
        <button
          type="button"
          className={styles.tool}
          title="Insert image"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openImage}
        >
          🖼
        </button>
        <button
          type="button"
          className={styles.tool}
          title="Insert image gallery"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            saveSelection();
            setShowGallery(true);
          }}
        >
          🖼+
        </button>

        <span className={styles.divider} />
        <Btn cmd="removeFormat" title="Clear formatting">
          ✕
        </Btn>
        <Btn cmd="undo" title="Undo">
          ↶
        </Btn>
        <Btn cmd="redo" title="Redo">
          ↷
        </Btn>

        <button
          type="button"
          className={`${styles.tool} ${styles.source} ${sourceMode ? styles.source_on : ''}`}
          title="Edit HTML source"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setSourceMode((s) => !s)}
        >
          {'</>'}
        </button>
        {busy && <span className={styles.busy}>uploading…</span>}
      </div>

      {sourceMode ? (
        <textarea
          className={styles.source_area}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <>
          <div
            ref={editorRef}
            className={styles.editor}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              emit();
              scheduleRefresh();
            }}
            onBlur={emit}
            data-placeholder={placeholder || 'Start writing…'}
          />
          {/* Floating edit badges over each image. */}
          {overlays.map((o, i) => (
            <button
              key={i}
              type="button"
              className={styles.img_badge}
              style={{ top: o.top, left: o.left }}
              title="Edit image"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setEditImg(o.el)}
            >
              i
            </button>
          ))}
        </>
      )}

      <input ref={imageInput} type="file" accept="image/*" hidden onChange={onImagePicked} />

      {showGallery && (
        <GalleryInsertDialog
          onClose={() => setShowGallery(false)}
          onInsert={(html) => insertHTML(html)}
        />
      )}
      {editImg && (
        <ImageEditDialog
          img={editImg}
          onChange={() => {
            emit();
            scheduleRefresh();
          }}
          onClose={() => setEditImg(null)}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
