// Typed helpers around the CMS endpoints.
import { request } from './client';
import type {
  Card,
  CardResource,
  ItemResponse,
  ListResponse,
  Page,
  User,
} from './types';

// ---- Cards (news / projects / gallery) ----------------------------------

export function listCards(resource: CardResource, all = false): Promise<ListResponse<Card>> {
  return request<ListResponse<Card>>(`/${resource}${all ? '?all=true' : ''}`, { auth: all });
}

export function createCard(resource: CardResource, body: FormData): Promise<ItemResponse<Card>> {
  return request<ItemResponse<Card>>(`/${resource}`, { method: 'POST', body, auth: true });
}

export function updateCard(
  resource: CardResource,
  id: string,
  body: FormData
): Promise<ItemResponse<Card>> {
  return request<ItemResponse<Card>>(`/${resource}/${id}`, { method: 'PUT', body, auth: true });
}

export function deleteCard(resource: CardResource, id: string): Promise<{ success: true }> {
  return request(`/${resource}/${id}`, { method: 'DELETE', auth: true });
}

export function getCard(resource: CardResource, id: string): Promise<ItemResponse<Card>> {
  return request<ItemResponse<Card>>(`/${resource}/${id}`);
}

// Partial JSON update — used for inline toggles (publish) and reordering.
export function patchCard(
  resource: CardResource,
  id: string,
  body: Partial<Card>
): Promise<ItemResponse<Card>> {
  return request<ItemResponse<Card>>(`/${resource}/${id}`, {
    method: 'PUT',
    body,
    auth: true,
  });
}

// ---- Image upload (Cloudinary) ------------------------------------------

export interface UploadResponse {
  success: true;
  image: { url: string; publicId: string };
}

export function uploadImage(file: File): Promise<UploadResponse> {
  const fd = new FormData();
  fd.append('image', file);
  return request<UploadResponse>('/upload', { method: 'POST', body: fd, auth: true });
}

// ---- Pages ---------------------------------------------------------------

export function listPages(all = false): Promise<ListResponse<Page>> {
  return request<ListResponse<Page>>(`/pages${all ? '?all=true' : ''}`, { auth: all });
}

export function getPageByLink(link: string): Promise<ItemResponse<Page>> {
  return request<ItemResponse<Page>>(`/pages/by-link/${link.replace(/^\/+/, '')}`);
}

export function getPage(id: string): Promise<ItemResponse<Page>> {
  return request<ItemResponse<Page>>(`/pages/${id}`);
}

export function patchPage(id: string, body: Partial<Page>): Promise<ItemResponse<Page>> {
  return request<ItemResponse<Page>>(`/pages/${id}`, { method: 'PUT', body, auth: true });
}

export function createPage(body: Partial<Page>): Promise<ItemResponse<Page>> {
  return request<ItemResponse<Page>>('/pages', { method: 'POST', body, auth: true });
}

export function updatePage(id: string, body: Partial<Page>): Promise<ItemResponse<Page>> {
  return request<ItemResponse<Page>>(`/pages/${id}`, { method: 'PUT', body, auth: true });
}

export function deletePage(id: string): Promise<{ success: true }> {
  return request(`/pages/${id}`, { method: 'DELETE', auth: true });
}

// ---- Users ---------------------------------------------------------------

export function listUsers(): Promise<ListResponse<User>> {
  return request<ListResponse<User>>('/users', { auth: true });
}

export function createUser(body: {
  name?: string;
  username?: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}): Promise<ItemResponse<User>> {
  return request<ItemResponse<User>>('/users', { method: 'POST', body, auth: true });
}

export function updateUser(id: string, body: Partial<User>): Promise<ItemResponse<User>> {
  return request<ItemResponse<User>>(`/users/${id}`, { method: 'PUT', body, auth: true });
}

export function setUserPassword(id: string, password: string): Promise<{ success: true }> {
  return request(`/users/${id}/password`, { method: 'PUT', body: { password }, auth: true });
}

export function deleteUser(id: string): Promise<{ success: true }> {
  return request(`/users/${id}`, { method: 'DELETE', auth: true });
}

// ---- Self ----------------------------------------------------------------

export function changeOwnPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: true }> {
  return request('/auth/change-password', {
    method: 'PUT',
    body: { currentPassword, newPassword },
    auth: true,
  });
}
