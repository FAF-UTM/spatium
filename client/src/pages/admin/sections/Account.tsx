import React, { useState } from 'react';
import styles from '../admin.module.css';
import { changeOwnPassword } from '../../../api/content';
import { ApiError } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';

const Account: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (newPassword !== confirm) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await changeOwnPassword(currentPassword, newPassword);
      setCurrent('');
      setNew('');
      setConfirm('');
      setNotice('Password changed successfully');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.section_head}>
        <h1 className={styles.section_title}>Account</h1>
      </div>

      <div className={styles.panel}>
        <div className={styles.field}>
          <label>Signed in as</label>
          <div>
            <strong>{user?.username || user?.name}</strong>{' '}
            <span className={styles.muted}>({user?.email})</span> · role: {user?.role}
          </div>
        </div>
      </div>

      <form className={styles.panel} onSubmit={handleSubmit} style={{ maxWidth: 460 }}>
        <h2 className={styles.stat_label} style={{ marginTop: 0 }}>
          Change password
        </h2>
        {error && <div className={styles.error}>{error}</div>}
        {notice && <div className={styles.success}>{notice}</div>}

        <div className={styles.field}>
          <label>Current password</label>
          <input
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label>New password</label>
          <input
            className={styles.input}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Confirm new password</label>
          <input
            className={styles.input}
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <div className={styles.form_actions}>
          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Change password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Account;
