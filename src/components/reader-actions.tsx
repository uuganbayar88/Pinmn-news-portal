'use client';
import { useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/schema';
import { dateLabel } from '@/lib/taxonomy';
import { Icon } from './icon';
const storageKey = 'pin:saved:v1';
const eventName = 'pin:saved-change';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(eventName, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(storageKey) ?? '[]';
  } catch {
    return '[]';
  }
}
function parseIds(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}
function useSavedIds() {
  return parseIds(useSyncExternalStore(subscribe, snapshot, () => '[]'));
}
function saveIds(ids: string[]) {
  localStorage.setItem(storageKey, JSON.stringify(ids));
  window.dispatchEvent(new Event(eventName));
}
export function SaveButton({ id }: { id: string }) {
  const ids = useSavedIds();
  const saved = ids.includes(id);
  const [error, setError] = useState('');
  return (
    <>
      <button
        className={'button button-outline ' + (saved ? 'is-saved' : '')}
        aria-pressed={saved}
        onClick={() => {
          try {
            saveIds(saved ? ids.filter((x) => x !== id) : [...ids, id]);
            setError('');
          } catch {
            setError('Энэ хөтөч дээр хадгалах боломжгүй байна.');
          }
        }}
      >
        <Icon name={saved ? 'check' : 'bookmark'} />
        {saved ? 'Хадгалсан' : 'Хадгалах'}
      </button>
      {error && <span role="status">{error}</span>}
    </>
  );
}
type SavedArticle = Pick<Article, 'id' | 'slug' | 'title' | 'publishedAt'> & {
  source: { name: string };
  href?: string;
};
export function SavedList({ articles }: { articles: SavedArticle[] }) {
  const ids = useSavedIds();
  const saved = articles.filter((a) => ids.includes(a.id));
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!ready) return <p role="status">Хадгалсан мэдээг ачаалж байна…</p>;
  if (!saved.length)
    return (
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="bookmark" size={32} />
        </span>
        <h2>Дараа унших мэдээгээ энд цуглуулаарай.</h2>
        <p>Мэдээний «Хадгалах» товчийг дарахад энэ хөтөч дээр хадгалагдана.</p>
        <Link className="button" href="/">
          Мэдээ үзэх <Icon name="arrow" />
        </Link>
      </div>
    );
  return (
    <div className="saved-list">
      {saved.map((a) => (
        <article className="saved-row" key={a.id}>
          <div>
            <span className="eyebrow">{dateLabel(a.publishedAt)}</span>
            <h2>
              <Link href={a.href ?? '/news/' + a.slug}>{a.title}</Link>
            </h2>
            <p>{a.source.name}</p>
          </div>
          <SaveButton id={a.id} />
        </article>
      ))}
    </div>
  );
}
export function ShareActions({ title, url }: { title: string; url: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Холбоос хуулагдлаа.');
    } catch {
      setStatus('Доорх холбоосыг сонгож хуулна уу.');
    }
  }
  async function nativeShare() {
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await copy();
    } catch (e) {
      if (!(e instanceof Error && e.name === 'AbortError'))
        setStatus('Хуваалцах боломжгүй байна. Холбоосыг хуулна уу.');
    }
  }
  return (
    <>
      <a
        className="button facebook-button"
        href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <b aria-hidden="true">f</b> Facebook
      </a>
      <button className="button button-outline" onClick={() => dialog.current?.showModal()}>
        <Icon name="share" /> Хуваалцах
      </button>
      <dialog
        ref={dialog}
        className="share-dialog"
        aria-labelledby="share-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-heading">
          <h2 id="share-title">Чухлыг нь хуваалцъя.</h2>
          <button className="icon-button" aria-label="Хаах" onClick={() => dialog.current?.close()}>
            <Icon name="close" />
          </button>
        </div>
        <p>{title}</p>
        <div className="share-options">
          <button className="button" onClick={copy}>
            <Icon name="link" /> Холбоос хуулах
          </button>
          <button className="button button-outline" onClick={nativeShare}>
            <Icon name="share" /> Бусад апп
          </button>
        </div>
        <label className="field-label" htmlFor="share-url">
          Мэдээний холбоос
        </label>
        <input id="share-url" readOnly value={url} onFocus={(e) => e.target.select()} />
        <div className="info-note">
          <strong>Instagram Story-д</strong>
          <p>Холбоосыг хуулж, Instagram-ийн Story → Link стикерт нэмээрэй.</p>
        </div>
        <p role="status" className="status-text">
          {status}
        </p>
      </dialog>
    </>
  );
}
