import axios from "axios";

const API_BASE = "http://localhost:5000";

const getAuthHeaders = () => {
  try {
    const userStr = localStorage.getItem("padel-user");
    if (!userStr) return { "Content-Type": "application/json" };
    const user = JSON.parse(userStr);
    const token = user.token || user.data?.token;
    if (!token) return { "Content-Type": "application/json" };
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } catch {
    return { "Content-Type": "application/json" };
  }
};

// ✅ FIXED: was /bookings/user/${userId}
export async function getMyBookings() {
  const response = await axios.get(`${API_BASE}/bookings/my-bookings`, {
    headers: getAuthHeaders(),
  });
  return response.data.bookings ?? response.data;
}

// ✅ FIXED: was /user/me
export async function getMyProfile() {
  const response = await axios.get(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return response.data.user ?? response.data;
}

// ✅ FIXED: was /user/me
export async function updateMyProfile(data) {
  const response = await axios.put(`${API_BASE}/auth/me`, data, {
    headers: getAuthHeaders(),
  });
  return response.data.user ?? response.data;
}

// ✅ FIXED: was /user/me/password
export async function updatePassword(data) {
  const response = await axios.put(`${API_BASE}/auth/me/password`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function submitReview({ courtId, rating, comment }) {
  const response = await axios.post(
    `${API_BASE}/reviews`,
    { courtId, rating, comment },
    { headers: getAuthHeaders() },
  );
  return response.data;
}

// ✅ FIXED: was PUT /bookings/:id/cancel (that route doesn't exist)
export async function cancelBooking(bookingId) {
  const response = await axios.delete(`${API_BASE}/bookings/${bookingId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

// For CourtDetails reviews section
export async function getCourtReviews(courtId) {
  const response = await axios.get(`${API_BASE}/reviews/court/${courtId}`);
  return response.data.reviews ?? response.data;
}

