import axios from "axios";
import { API_BASE as API_BASE_URL } from "../../../config/api";

const API_BASE = API_BASE_URL;

// ─── Auth headers ─────────────────────────
const getAuthHeaders = (useJson = true) => {
  const userStr = localStorage.getItem("padel-user");
  const headers = {};

  if (!userStr) {
    return useJson ? { "Content-Type": "application/json" } : {};
  }

  try {
    const user = JSON.parse(userStr);
    const token = user.token || user.data?.token;

    if (!token) {
      console.error("Token not found in user object");
      return useJson ? { "Content-Type": "application/json" } : {};
    }

    if (useJson) {
      headers["Content-Type"] = "application/json";
    }

    headers["Authorization"] = `Bearer ${token}`;
    return headers;
  } catch (err) {
    console.error("Error parsing user from localStorage", err);
    return useJson ? { "Content-Type": "application/json" } : {};
  }
};

const isFileUpload = (data) => {
  if (!data?.imageFile) return false;

  return (
    (typeof File !== "undefined" && data.imageFile instanceof File) ||
    (typeof Blob !== "undefined" && data.imageFile instanceof Blob)
  );
};

const buildCourtPayload = (data) => {
  if (!isFileUpload(data)) {
    return data;
  }

  const formData = new FormData();
  formData.append("name", data.name ?? "");
  formData.append("location", data.location ?? "");
  formData.append("pricePerHour", String(data.pricePerHour ?? ""));

  if (data.description != null) {
    formData.append("description", data.description);
  }

  if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }

  if (data.imageFile) {
    formData.append("image", data.imageFile);
    formData.append("imageFile", data.imageFile);
    formData.append("file", data.imageFile);
  }

  return formData;
};


// ─── PUBLIC COURTS ─────────────────────────

export async function getPublicCourts(filters = {}) {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    const response = await axios.get(`${API_BASE}/courts`, {
      params,
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.courts || [];
  } catch (err) {
    console.log("ERROR:", err.message);
    throw err;
  }
}

// ─── COURT DETAILS ─────────────────────────

export async function getCourtById(id) {
  const response = await axios.get(`${API_BASE}/courts/${id}`);
  return response.data;
}

// ─── OWNER COURTS ─────────────────────────

export async function getOwnerCourts() {
  const response = await axios.get(`${API_BASE}/owner/courts`, {
    headers: getAuthHeaders(),
  });

  return response.data.courts || response.data;
}

export async function createCourt(data) {
  const payload = buildCourtPayload(data);
  const useJson = !(payload instanceof FormData);

  const response = await axios.post(
    `${API_BASE}/owner/courts`,
    payload,
    { headers: getAuthHeaders(useJson) }
  );

  return response.data;
}

export async function updateCourt(id, data) {
  const payload = buildCourtPayload(data);
  const useJson = !(payload instanceof FormData);

  const response = await axios.put(
    `${API_BASE}/owner/courts/${id}`,
    payload,
    { headers: getAuthHeaders(useJson) }
  );

  return response.data;
}

export async function deleteCourt(id) {
  const response = await axios.delete(
    `${API_BASE}/owner/courts/${id}`,
    { headers: getAuthHeaders() }
  );

  return response.data;
}