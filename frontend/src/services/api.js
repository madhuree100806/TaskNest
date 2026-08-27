const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// =========================
// TODOS
// =========================

export const getTodos = () => request("/todos");

export const createTodo = (todo) =>
  request("/todos", { method: "POST", body: JSON.stringify(todo) });

export const updateTodo = (id, todo) =>
  request(`/todos/${id}`, { method: "PUT", body: JSON.stringify(todo) });

export const deleteTodo = (id) =>
  request(`/todos/${id}`, { method: "DELETE" });

// =========================
// BIRTHDAYS
// =========================

export const getBirthdays = () => request("/birthdays");

export const createBirthday = (birthday) =>
  request("/birthdays", { method: "POST", body: JSON.stringify(birthday) });

export const updateBirthday = (id, birthday) =>
  request(`/birthdays/${id}`, { method: "PUT", body: JSON.stringify(birthday) });

export const deleteBirthday = (id) =>
  request(`/birthdays/${id}`, { method: "DELETE" });

// =========================
// RESOURCES
// =========================

export const getResources = () => request("/resources");

export const createResource = (resource) =>
  request("/resources", { method: "POST", body: JSON.stringify(resource) });

export const updateResource = (id, resource) =>
  request(`/resources/${id}`, { method: "PUT", body: JSON.stringify(resource) });

export const deleteResource = (id) =>
  request(`/resources/${id}`, { method: "DELETE" });

// =========================
// BAG CHECKLIST
// =========================

export const getBagItems = () => request("/bag");

export const createBagItem = (item) =>
  request("/bag", { method: "POST", body: JSON.stringify(item) });

export const updateBagItem = (id, item) =>
  request(`/bag/${id}`, { method: "PUT", body: JSON.stringify(item) });

export const deleteBagItem = (id) =>
  request(`/bag/${id}`, { method: "DELETE" });
