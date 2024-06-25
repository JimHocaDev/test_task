'use client';
import Link from 'next/link';
import Image from 'next/image';
import defaultImg from 'public/images/admin.png';
import { useEffect, useRef, useState } from 'react';
import { SkeletonDemo } from '@/components/Skeleton/Skeleton';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';

import { Modal } from '@/components/Modal/Modal';
import { ToastContainer, toast } from 'react-toastify';
import { Pagination } from '@/components/Pagination/Pagination';
import { useParams, useRouter } from 'next/navigation'; // Import from 'next/router' instead of 'next/navigation'
import { apiRoot } from '@/app/api/api';
import { useDispatch, useSelector } from 'react-redux';

export default function Page() {
	const group: any = useSelector((state: any) => state.group);
	const [data, setData] = useState<any>([]);
	const [OneData, setOneData] = useState<any>([]);
	const [activePage, setActivePage] = useState(1);
	const { id } = useParams();

	// Modals state
	const [Create, setCreate] = useState<any>(false);
	const [EditModal, setEditModal] = useState<any>(false);
	const [DeleteModal, setDeleteModal] = useState<any>(false);
	const [DeleteId, setDeleteId] = useState<any>(false);

	// Refs
	const nameRef = useRef<any>();
	const phoneRef = useRef<any>();

	const editnameRef = useRef<any>();
	const editphoneRef = useRef<any>();

	const router = useRouter();
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

	const getOneFunc = async (student: any) => {
		setOneData(student);
		setEditModal(true);
		setDeleteId(student?._id);
	};
	// Create
	const createFunc = async (evt: any) => {
		evt.preventDefault();
		const req = {
			full_name: nameRef?.current?.value,
			phone_number: phoneRef?.current?.value,
			group_id: id
		};

		const resp = await apiRoot
			.post('students', req, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.message);
			});

		if (resp?.status === 201) {
			toast.success('Succesfully created');
			setCreate(false);
			getFunc();
			nameRef.current.value = '';
			phoneRef.current.value = '';
		}
	};

	// edit
	const editFunc = async (evt: any) => {
		evt.preventDefault();

		const req = {
			full_name: editnameRef?.current?.value || OneData?.full_name,
			phone_number: editphoneRef?.current?.value || OneData?.phone_number,
			group_id: id
		};


		const resp = await apiRoot
			.patch(`student/${DeleteId}`, req, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.message);
			});

		if (resp?.status === 200) {
			setEditModal(false);
			toast.success('Succesfully edited');
			getFunc();
		}
	};
	// Delete
	async function deleteFunc(evt: any) {
		evt.preventDefault();
		const res = await apiRoot.delete(`student/${DeleteId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res?.status === 200) {
			toast.success('Successfully deleted ');
			setDeleteModal(false);
			getFunc();
		} else {
			toast.error('Something went wrong, please try again');
		}
	}

	useEffect(() => {
		getFunc();
	}, [activePage]);

	return (
		<>
			<div className='flex items-center  justify-center  gap-[30px] mb-[15px] '>
				<button
					className='bg-red-500 flex items-center gap-2 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => router.push('/')}
				>
					<FaArrowLeftLong size={15} className=' my_animate  ' />
					Ortga
				</button>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => setCreate(true)}
				>
					Student Qo'shish
				</button>
			</div>

			<div className='grid lg:grid-cols-4 max-lg:grid-cols-2  max-sm:grid-cols-1  gap-3 py-3'>
				{data.students?.length ? (
					data.students?.map((item: any) => (
						<div
							key={item?.id}
							className='flex flex-col relative dark:bg-famousCourcesBg bg-slate-300  text-black  dark:text-white shadow-[0_1px_3px_0_rgba(0, 0, 0, 0.1),_0_1px_2px_0_rgba(0, 0, 0, 0.06)] rounded-md  pl-4 pr-4 pb-4 max-lg:w-[90%] max-sm:w-[100%] w-[100%] max-lg:m-auto  '
						>
							<Image
								className='h-[180px]  w-full object-contain rounded-lg transition ease-in-out hover:opacity-75'
								src={defaultImg}
								// src={item?.img ? `${baseMediaUrl}/images/${item?.img}`:defaultImg}
								alt='Picture of the User'
								width={1000}
								height={1000}
							/>
							<h6 className='pt-[10px] text-[20px] font-bold text-black dark:text-white'>

								{item?.full_name?.length > 25 ? item?.full_name?.slice(0, 23) + ".." : item?.full_name}
							</h6>
							<h6 className='pt-[10px] text-[16px] font-bold text-black dark:text-white'>
								Tel: {item?.phone_number
								}
							</h6>

							<div className='flex justify-between items-center mb-[38px] '>

								<h6 className=' text-[16px] font-bold text-black dark:text-white'>
									Guruh:	{data?.group_name}
								</h6>

								<div className=' flex items-center gap-2  '>
									<RiDeleteBin5Fill
										size={25}
										onClick={() => {
											setDeleteId(item?._id);
											setDeleteModal(true);
										}}
										className=' text-red-600 hover:text-red-700  cursor-pointer h-[30px] '
									/>
									<FaEdit
										size={25}
										onClick={() => {
											getOneFunc(item);
										}}
										className=' text-yellow-400 hover:text-yellow-500 cursor-pointer h-[30px] '
									/>
								</div>
							</div>

							<Link
								href={`/student/${item?._id}`}
								className=' text-center text-black dark:text-white   bg-green-500 hover:bg-green-700 w-[88%] absolute bottom-[10px] font-bold py-2 px-2 rounded'
							>

								Davomat statistikasi
							</Link>

						</div>
					))
				) : (
					<SkeletonDemo />
				)}
			</div>

			{data?.data?.length && (
				<Pagination
					activePage={activePage}
					setActivePage={setActivePage}
					totalPage={data?.pageCount}
				/>
			)}

			{/* create modal  */}

			<Modal
				width={'900px'}
				title={'Create User'}
				modal={Create}
				setModal={setCreate}
			>
				<div className=' md:p-5 '>
					<form
						className='flex flex-col items-center gap-3 justify-center'
						onSubmit={createFunc}
					>
						{/* <label
							htmlFor='dropzone-file'
							className=' relative flex flex-col items-center justify-center w-full h-[60px] md:h-[60px] border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
						>
							<div className='flex flex-col items-center justify-center pt-3 pb-3'>
								<svg
									className='w-6 h-4 mb-2 mt-2 text-gray-500 dark:text-gray-400'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 20 16'
								>
									<path
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
									/>
								</svg>

								<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
									<span className='font-semibold'>Click to upload</span> and img
								</p>
							</div>
							<input
								id='dropzone-file'
								type='file'
								className='hidden'
								// accept="image/*" 
								accept=".png, .jpg, .jpeg"
								// onChange={(evnt: any) => createImg(evnt?.target?.files?.[0])}
							/>
						</label> */}



						<input
							className='w-full p-2 border rounded  border-gray-500 outline-none   dark:focus:border-blue-500  focus:border-blue-500  dark:bg-gray-700 bg-transparent '
							placeholder="Familiya, Ism"
							type='text'
							ref={nameRef}
						/>
						<input
							className='w-full p-2 border rounded  border-gray-500 outline-none   dark:focus:border-blue-500  focus:border-blue-500  dark:bg-gray-700 bg-transparent '
							placeholder="998 97-777-07-07"
							type='text'
							ref={phoneRef}
						/>


						<div className='flex gap-x-2'>
							<button
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								type='submit'
							>
								Qo'shish
							</button>
							<button
								className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
								type='button'
								onClick={() => setCreate(false)}
							>
								Bekor qilish
							</button>
						</div>
					</form>
				</div>
			</Modal>

			{/* edit modal  */}

			<Modal
				width={'900px'}
				title={'Edit User'}
				modal={EditModal}
				setModal={setEditModal}
			>
				<div className=' md:p-5 '>
					<form
						className='flex flex-col items-center gap-3 justify-center'
						onSubmit={editFunc}
					>
						{/* <label
							htmlFor='dropzone-file-edit'
							className=' relative flex flex-col items-center justify-center w-full h-[95px] md:h-[165px] border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
						>
							<div className='flex flex-col items-center justify-center pt-3 pb-4'>
								{OneData?.user_image ? (
									<Image
										width={10000}
										height={10000}
										className='w-[100%] object-cover h-[90px] md:h-[160px] rounded-lg absolute left-0 top-0 mb-4 text-gray-500 dark:text-gray-400'
										src={`${baseMediaUrl}/images/${OneData?.user_image}`}
										alt='img'
									/>
								) : (
									<svg
										className='w-8 h-6 mb-4 text-gray-500 dark:text-gray-400'
										aria-hidden='true'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 20 16'
									>
										<path
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
										/>
									</svg>
								)}
								<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
									<span className='font-semibold'>Click to upload</span> and
									edit img
								</p>
							</div>
							<input
								id='dropzone-file-edit'
								type='file'
								className='hidden'
								onChange={(evt: any) => editImg(evt?.target?.files?.[0])}
							/>
						</label> */}


						<input
							className='w-full p-2 border rounded  border-gray-500 outline-none   dark:focus:border-blue-500  focus:border-blue-500  dark:bg-gray-700 bg-transparent '
							placeholder="Familiya, Ism"
							type='text'
							ref={editnameRef}
							defaultValue={OneData?.full_name}
						/>
						<input
							className='w-full p-2 border rounded  border-gray-500 outline-none   dark:focus:border-blue-500  focus:border-blue-500  dark:bg-gray-700 bg-transparent '
							placeholder="998 97-777-07-07"
							type='text'
							ref={editphoneRef}
							defaultValue={OneData?.phone_number}
						/>


						<div className='flex gap-x-2'>
							<button
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								type='submit'
								onClick={editFunc}
							>
								Add
							</button>
							<button
								className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
								type='button'
								onClick={() => setEditModal(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</Modal>

			{/* delete modal  */}

			<Modal
				width={' w-[85%] md:w-[600px] '}
				title={'Delete student'}
				modal={DeleteModal}
				setModal={setDeleteModal}
			>
				<div className=' md:p-5 '>
					<form
						className='flex flex-col items-center gap-3 justify-center'
						onSubmit={deleteFunc}
					>
						<h2 className='mb-2 text-[22px] text-gray-500 dark:text-gray-400'>
							{' '}
							Sz bu talabani o'chirmoqchimisz?{' '}
						</h2>
						<div className='flex gap-x-2'>
							<button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
								Ha
							</button>
							<button
								type='button'
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								onClick={() => setDeleteModal(false)}
							>
								Yo'q
							</button>
						</div>
					</form>
				</div>
			</Modal>

			<ToastContainer />
		</>
	);
}
