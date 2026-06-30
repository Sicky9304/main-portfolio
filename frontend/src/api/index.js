/**
 * API Service Layer
 * Centralized API calls with error handling and base URL config.
 */

const API_BASE = '/api';

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Something went wrong',
      response.status,
      data.details || null
    );
  }

  return data;
}

// ─── Public API Functions ─────────────────────────

export async function fetchProjects() {
  const res = await request('/projects?featured=true');
  return res.data;
}

export async function fetchProject(slug) {
  const res = await request(`/projects/${slug}`);
  return res.data;
}

export async function fetchProfile() {
  const res = await request('/profile');
  return res.data;
}

export async function fetchServices() {
  const res = await request('/services');
  return res.data;
}

export async function fetchTestimonials() {
  const res = await request('/testimonials');
  return res.data;
}

export async function submitContact(formData) {
  const res = await request('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return res;
}

export async function createProject(projectData, adminPasscode) {
  return await request('/projects', {
    method: 'POST',
    headers: { 'x-admin-token': adminPasscode },
    body: JSON.stringify(projectData),
  });
}

export async function updateProject(slug, projectData, adminPasscode) {
  return await request(`/projects/${slug}`, {
    method: 'PUT',
    headers: { 'x-admin-token': adminPasscode },
    body: JSON.stringify(projectData),
  });
}

export async function deleteProject(slug, adminPasscode) {
  return await request(`/projects/${slug}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': adminPasscode },
  });
}

export async function updateProfile(profileData, adminPasscode) {
  return await request('/profile', {
    method: 'PUT',
    headers: { 'x-admin-token': adminPasscode },
    body: JSON.stringify(profileData),
  });
}

export async function uploadImage(base64File, adminPasscode) {
  return await request('/upload', {
    method: 'POST',
    headers: { 'x-admin-token': adminPasscode },
    body: JSON.stringify({ file: base64File }),
  });
}

export { ApiError };
