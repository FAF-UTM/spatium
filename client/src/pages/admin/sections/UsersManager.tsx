import React, { useCallback, useEffect, useState } from 'react';
import styles from '../admin.module.css';
import {
  listUsers,
  createUser,
  deleteUser,
  setUserPassword,
  updateUser,
} from '../../../api/content';
import { ApiError } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import type { User } from '../../../api/types';

interface NewUserForm {
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

const emptyNewUser: NewUserForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
};

const UsersManager: React.FC = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewUserForm>(emptyNewUser);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listUsers();
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createUser({
        name: form.name || undefined,
        username: form.username || undefined,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setForm(emptyNewUser);
      setShowForm(false);
      flash('User created');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (u: User) => {
    const pwd = window.prompt(`New password for ${u.username || u.email} (min 8 chars):`);
    if (!pwd) return;
    try {
      await setUserPassword(u._id, pwd);
      flash('Password updated');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update password');
    }
  };

  const handleToggleRole = async (u: User) => {
    const next = u.role === 'admin' ? 'user' : 'admin';
    try {
      await updateUser(u._id, { role: next });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to change role');
    }
  };

  const handleDelete = async (u: User) => {
    if (!window.confirm(`Delete user ${u.username || u.email}?`)) return;
    try {
      await deleteUser(u._id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div>
      <div className={styles.section_head}>
        <h1 className={styles.section_title}>Users</h1>
        {!showForm && (
          <button className={styles.btn} onClick={() => setShowForm(true)}>
            + Add User
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {notice && <div className={styles.success}>{notice}</div>}

      {showForm && (
        <form className={styles.panel} onSubmit={handleCreate}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Name</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Username</label>
              <input
                className={styles.input}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Email *</label>
              <input
                className={styles.input}
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Password * (min 8)</label>
              <input
                className={styles.input}
                type="text"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Role</label>
              <select
                className={styles.select}
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as 'user' | 'admin' })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className={styles.form_actions}>
            <button className={styles.btn} type="submit" disabled={saving}>
              {saving ? 'Creating…' : 'Create user'}
            </button>
            <button
              className={styles.btn_ghost}
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyNewUser);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className={styles.muted}>Loading…</p>
      ) : (
        <div className={styles.list}>
          {users.map((u) => (
            <div key={u._id} className={styles.list_row}>
              <div className={styles.list_main}>
                <div className={styles.list_title}>
                  {u.username || u.name || u.email}
                  {me?._id === u._id && <span className={styles.muted}> (you)</span>}
                </div>
                <div className={styles.list_meta}>{u.email}</div>
              </div>
              <span
                className={`${styles.badge} ${
                  u.role === 'admin' ? styles.badge_on : styles.badge_off
                }`}
              >
                {u.role}
              </span>
              <div className={styles.list_actions}>
                <button className={styles.icon_btn} onClick={() => handleResetPassword(u)}>
                  Password
                </button>
                <button className={styles.icon_btn} onClick={() => handleToggleRole(u)}>
                  {u.role === 'admin' ? 'Make user' : 'Make admin'}
                </button>
                {me?._id !== u._id && (
                  <button
                    className={`${styles.icon_btn} ${styles.icon_btn_danger}`}
                    onClick={() => handleDelete(u)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersManager;
