const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://padel-reservation-web-app.vercel.app';

export const API_BASE = API_BASE_URL.replace(/\/$/, '');
