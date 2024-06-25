'use client';

import { useEffect, useState } from 'react';
import { SingleSkeleton } from '@/components/Skeleton/Skeleton';
import { TbCheck } from 'react-icons/tb';
import { TbChecks } from 'react-icons/tb';
import { ToastContainer, toast } from 'react-toastify';
import { apiRoot } from '@/app/api/api';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

function getDate() {
	const today = new Date();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();
	const date = today.getDate();
	const hours = today.getHours();
	const minutes = today.getMinutes();

	return `${month}/${date}/${year}-${hours}:${minutes} `;
}

export default function Page() {
	const [data, setData] = useState<any>([]);
	const [studentsId, setStudentsId] = useState<any>([]);
	const [todayAttendenceData, setTodayAttendenceData] = useState<any>({});
	const [studentObj, setStudentObj] = useState<any>({});

	const { id } = useParams();
	const router = useRouter();
	// Modals state
	// const attendenceStore =
	// 	typeof window !== 'undefined'
	// 		? localStorage.getItem('attendenceState') == 'true'
	// 			? true
	// 			: false
	// 		: false;
	const [attendencesState, setAttendencesState] = useState<any>(false);
	// Refs

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	const getFunc = async () => {
		const resp = await apiRoot.get(`group/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (resp?.status === 200) {
			setData(resp?.data);
		}
	};

	const handleCheckStudents = async () => {
		const studentsUniqueId = new Set(studentsId);
		const req = {
			group_id: id,
			students: Array.from(studentsUniqueId),
		};

		const resp = await apiRoot
			.post(`attendences`, req, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.catch((err: any) => {
				if (typeof err?.response?.data?.message == 'object') {
					toast.error(err?.response?.data?.message);
				} else {
					toast.error(err?.response?.data?.message);
				}
			});

		if (resp?.status === 201) {
			localStorage.setItem('attendenceState', 'true');
			setAttendencesState(true);
			toast.success('Muvaffaqiyatli davomat qilindi');
			if (typeof window !== 'undefined') {
				localStorage.setItem('todayAttendenceData', JSON.stringify(resp?.data));
				setTodayAttendenceData(resp?.data);
				setStudentsId([]);
			}
		}
	};

	const handleDeliteCheckStudents = async () => {
		const resp = await apiRoot
			.delete(`attendences/${todayAttendenceData?._id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.catch((err: any) => {
				if (typeof err?.response?.data?.message == 'object') {
					toast.error(err?.response?.data?.message);
				} else {
					toast.error(err?.response?.data?.message);
				}
			});

		if (resp?.status === 200) {
			localStorage.setItem('attendenceState', 'false');
			setAttendencesState(false);
			toast.success('Muvaffaqiyatli Ochirildi');
		}
	};
	const storeStatus = (id: string, status: string) => {
		setStudentObj((prev: any) => {
			const obj = { ...prev, [id]: status };
			if (typeof window !== 'undefined') {
				localStorage.setItem('storeStatus', JSON.stringify(obj));
			}
			return obj;
		});
	};

	useEffect(() => {
		const todayAttendence = localStorage.getItem('todayAttendenceData');
		const todayStoreStatus = localStorage.getItem('storeStatus');
		console.log(
			todayAttendence,
			'todayAttendence',
			todayStoreStatus,
			'todayStoreStatus'
		);

		if (typeof window !== 'undefined' && todayAttendence && todayStoreStatus) {
			const data = JSON.parse(
				localStorage.getItem('todayAttendenceData') || ' '
			);
			setTodayAttendenceData(data);
			const storeStatus = JSON.parse(
				localStorage.getItem('storeStatus') || ' '
			);
			setStudentObj(storeStatus);
		}
	}, []);
	useEffect(() => {
		getFunc();
		(async () => {
			const studentsUniqueId = new Set(studentsId);
			console.log(studentsUniqueId, "studentssssssssssssssssss");
			const req = {
				group_id: id,
				students: Array.from(studentsUniqueId),
			};
			await apiRoot
				.post(`attendences`, req, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.catch((err: any) => {
					if (
						err?.response?.data?.message ==
							'Attendance already recorded for this group today' &&
						err.response?.status == 400
					) {
						toast.error("Bugunlik sana uchun davomat qilinib bolgan !");
						setAttendencesState(true);
					} 
				});
		})();
	}, []);

	return (
		<>
			<div className='flex  max-[550px]:flex-col  justify-center items-center   gap-[30px] mb-[15px] '>
				<button
					className='bg-red-500 flex items-center gap-2 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => router.push('/')}
				>
					<FaArrowLeftLong size={15} className=' my_animate  ' />
					Ortga
				</button>
				<h3 className=' text-[22px]  dark:text-white text-black text-center '>
					Davomat qilish
				</h3>
			</div>

			{data?.students?.length ? (
				<div className='p-1 w-full overflow-x-auto px-0'>
					<table
						className='w-full min-w-[600px]  text-left'
						aria-disabled={attendencesState}
					>
						<thead>
							<tr className=''>
								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Full Name
									</p>
								</th>

								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Date
									</p>
								</th>
								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Guruh raqami
									</p>
								</th>
								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Yo'qlama
									</p>
								</th>
								<th className='border-y border-gray-500 bg-blue-gray-50/50 p-4'>
									<p className='block antialiased font-sans text-sm text-blue-gray-900 font-bold leading-none '>
										Status
									</p>
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.students?.map((el: any, indx: number) => (
								<tr key={el?._id}>
									<td className='p-4 border-b border-gray-500'>
										<p className='block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold'>
											{el?.full_name}
										</p>
									</td>

									<td className='p-4 border-b border-gray-500'>
										<p className='block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal'>
											{getDate()}
										</p>
									</td>
									<td className='p-4 border-b border-gray-500'>
										{data?.group_name}{' '}
									</td>
									<td className='p-4 border-b border-gray-500'>
										<div className='flex items-center gap-3'>
											<button
												className={`${
													attendencesState
														? 'bg-green-500  opacity-10 '
														: 'bg-green-500 hover:bg-green-700'
												} flex items-center gap-1  text-white font-bold py-2 px-3 rounded `}
												onClick={() => {
													setStudentsId((prev: any) =>
														Array.from(new Set([...prev, el?._id]))
													);

													storeStatus(el?._id, 'Keldi');
												}}
												disabled={attendencesState}
											>
												{true ? <TbCheck size={18} /> : <TbChecks size={18} />}
											</button>

											<button
												className={`${
													attendencesState
														? 'bg-red-500  opacity-10 '
														: 'bg-red-500 hover:bg-red-700'
												} flex items-center gap-1  text-white font-bold py-2 px-3 rounded `}
												onClick={() => {
													const filtredArr = studentsId.filter(
														(student: string) => student !== el?._id
													);
													setStudentsId((prev: any) =>
														Array.from(new Set([...filtredArr]))
													);
													storeStatus(el?._id, 'Kelmadi');
												}}
												disabled={attendencesState}
											>
												{true ? <IoClose size={18} /> : ''}
											</button>
										</div>
									</td>

									<td className='p-4  border-b border-gray-500'>
										<p className='min-w-[61px]'>{studentObj[el?._id]}</p>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<SingleSkeleton />
			)}

			<div className='flex gap-3 justify-center  mt-6 '>
				<button
					className='bg-blue-500 flex items-center gap-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={handleCheckStudents}
				>
					Saqlash
				</button>

				<button
					className='bg-red-500 flex items-center disabled:opacity-30 gap-2  text-white font-bold py-2 px-4 rounded'
					onClick={handleDeliteCheckStudents}
					// disabled={true}
				>
					O'chirish
				</button>
			</div>

			<ToastContainer />
		</>
	);
}
