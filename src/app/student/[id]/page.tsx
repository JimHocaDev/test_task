'use client';
import { useEffect, useState } from 'react';
import { SingleSkeleton } from '@/components/Skeleton/Skeleton';

import { ToastContainer } from 'react-toastify';
import { apiRoot } from '@/app/api/api';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FaArrowLeftLong } from 'react-icons/fa6';
function formatDate(dateString: string) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Oy 0 dan boshlanadi, shuning uchun +1 qilamiz
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	// Kerakli formatga otazish
	return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default function Page() {
	const [data, setData] = useState<any>({});
	const [fetchData ,setFetchData] = useState<any>(false);
	const { id } = useParams();
	const router = useRouter();
	// Modals state

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	const getFunc = async () => {
		const resp = await apiRoot.get(`student/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (resp?.status === 200) {
			setFetchData(true);
			setData(resp?.data);
		}
	};

	useEffect(() => {
		getFunc();
	}, []);

	

	return (
		<>
			<div className='flex  max-[550px]:flex-col  justify-center items-center   gap-[30px] mb-[15px] '>
				<button
					className='bg-red-500 flex items-center gap-2 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => router.back()}
				>
					<FaArrowLeftLong size={15} className=' my_animate  ' />
					Ortga
				</button>
				<h3 className=' text-[22px]  dark:text-white text-black text-center '>
					Student davomati
				</h3>
			</div>

			{data?.attendences?.length ? (
				<div className='p-1 w-full overflow-x-auto px-0'>
					<table className='w-full min-w-[600px]  text-left'>
						<thead>
							<tr className=''>
								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Ism
									</p>
								</th>

								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Darsga kelmagan kun
									</p>
								</th>
								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Telefon raqam
									</p>
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.attendences?.map((el: any, indx: number) => (
								<tr key={el?._id}>
									<td className='p-4 border-b border-gray-500'>
										<p className='block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold'>
											{data?.full_name}
										</p>
									</td>

									<td className='p-4 border-b border-gray-500'>
										<p className='block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal'>
											{formatDate(el?.createdAt)}
										</p>
									</td>
									<td className='p-4 border-b border-gray-500'>
										{data?.phone_number}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) :( ! fetchData  ?(<SingleSkeleton/>): (
				<h3 className=' text-[22px]  dark:text-white text-black text-center '>
					Talaba <b>{data?.full_name}  </b>biror marta ham dars qoldirmagan 
				</h3>
			))}
			

			<ToastContainer />
		</>
	);
}
