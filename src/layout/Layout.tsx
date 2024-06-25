import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from 'next/router' instead of 'next/navigation'
import { apiRoot } from '@/app/api/api';
import { ToastContainer, toast } from 'react-toastify';
import Header from './Header/Header';

export default function Layout({ children }: any) {
	const router = useRouter();
	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	useEffect(() => {
		if (!token) {
			router.push('/login');
		} else {
			
		}
	}, []);

	useEffect(() => {}, []);

	return (
		<>
			<Header />
			{children}
		</>
	);
}
