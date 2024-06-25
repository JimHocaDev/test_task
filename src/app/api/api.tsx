import axios from 'axios';

export const baseUrlImg = 'https://tutors-back.vercel.app';
export const baseMediaUrl = 'https://library-backend.uz/uploads/';
export const baseUrl = 'https://tutors-back.vercel.app/api/';
export const apiRoot = axios.create({
	// baseURL: `http://localhost:2002/api/`,
	baseURL: `https://attendance-nine-flax.vercel.app/api/`,
	// withCredentials: true,
	
});



