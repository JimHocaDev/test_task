'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SkeletonDemo } from '@/components/Skeleton/Skeleton';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { PiStudentDuotone } from 'react-icons/pi';
import { FaUserCheck } from "react-icons/fa";
import { Modal } from '@/components/Modal/Modal';
import { ToastContainer, toast } from 'react-toastify';
import { Pagination } from '@/components/Pagination/Pagination';
import { useRouter } from 'next/navigation'; // Import from 'next/router' instead of 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { setGroupData } from '@/stores/groupSlice';
import { apiRoot } from '../api/api';

export default function Page() {
	const [data, setData] = useState<any>([]);
	const [OneData, setOneData] = useState<any>([]);
	const [activePage, setActivePage] = useState(1);

	// Modals state
	const [Create, setCreate] = useState<any>(false);
	const [EditModal, setEditModal] = useState<any>(false);
	const [DeleteModal, setDeleteModal] = useState<any>(false);
	const [DeleteId, setDeleteId] = useState<any>("");
	//store
	const group: any = useSelector((state: any) => state.group);
	const dispatch = useDispatch();
	// Refs
	const nameRef = useRef<any>();
	const editnameRef = useRef<any>();

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	const getFunc = async () => {
		// const resp = await apiRoot.get(`category?page=${activePage}&pageSize=9`);
		const resp = await apiRoot.get(`groups`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (resp?.status === 200) {
			setData(resp?.data);
		}
	};

	const getOneFunc = async (group: any) => {
		setDeleteId(group?._id);
		setOneData(group);
		setEditModal(true);
	};
	// Create
	const createFunc = async (evt: any) => {
		evt.preventDefault();

		const req = {
			group_name: nameRef?.current?.value,
		};

		const resp = await apiRoot
			.post('groups', req, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.catch((err: any) => {
				if ((typeof err?.response?.data?.message) == "object") {
					toast.error(err?.response?.data?.message?.[0]);
				} else {
					toast.error(err?.response?.data?.message);

				}
			});

		if (resp?.status === 201) {
			toast.success('Succesfully created');
			setCreate(false)
			getFunc();
			nameRef.current.value = ""

		}
	};

	// edit
	const editFunc = async (evt: any) => {
		evt.preventDefault();

		const req = {
			group_name: editnameRef?.current?.value || OneData?.group_name,
		};

		const resp = await apiRoot
			.patch(`group/${DeleteId}`, req, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.catch((err: any) => {

				if ((typeof err?.response?.data?.message) == "object") {
					toast.error(err?.response?.data?.message?.[0]);
				} else {
					toast.error(err?.response?.data?.message);

				}
			});

		if (resp?.status === 200) {
			setEditModal(false);
			toast.success('Succesfully edited');
			await getFunc();
		}
	};
	// Delete
	async function deleteFunc(evt: any) {
		evt.preventDefault();
		const res = await apiRoot.delete(`group/${DeleteId}`, {
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
				<h3 className=' text-[22px] dark:text-white text-black  '>Komilov M Guruhlari </h3>

				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => setCreate(true)}
				>
					Guruh qo'shish
				</button>
			</div>

			<div className='grid lg:grid-cols-3 max-lg:grid-cols-2  max-sm:grid-cols-1  gap-3 py-3'>

				{data?.length ? (
					data?.map((item: any) => (
						<div
							key={item?._id}
							className='flex flex-col relative dark:bg-famousCourcesBg bg-slate-300  text-black  dark:text-white shadow-[0_1px_3px_0_rgba(0, 0, 0, 0.1),_0_1px_2px_0_rgba(0, 0, 0, 0.06)] rounded-md  p-4 max-lg:w-[90%] max-sm:w-[100%] w-[100%] max-lg:m-auto'
						>

							<h6 className='pt-[10px] text-[22px] font-bold text-black dark:text-white'>
								{item?.group_name}
							</h6>

							<div className='flex justify-between items-center  my-2 '>
								<span className='flex gap-[5px] items-center text-[15px] text-black dark:text-famousCourcesDescsColor'>
									<PiStudentDuotone size={20} />
									Studentlar soni:	{item?.students?.length}
								</span>



								<div className=' flex items-center gap-2 right-[10px] '>
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

							<hr className='h-1 w-full bg-CoursesHr' />
							<div className='flex justify-between items-center pt-5'>
								<Link
									href={`/groups/${item?._id}`}
									className='flex gap-[15px] items-center text-black dark:text-white   bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
									onClick={() =>
										dispatch(setGroupData(item))
									}

								>
									<PiStudentDuotone size={20} />

									<button
										type='button'

									>
										Talabalar

									</button>
								</Link>

								<Link
									href={`/groups/attendance/${item?._id}`}
									className='flex gap-[15px] items-center text-black dark:text-white   bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
								>
									<FaUserCheck size={20} />
									<button
										type='button'
										className=''
									>
										Davomat

									</button>
									{/* <FaArrowRight size={20} className=' my_animate  ' /> */}
								</Link>
							</div>
						</div>
					))
				) : (
					<SkeletonDemo />
				)}

			</div>

			{
				data?.data?.length && <Pagination
					activePage={activePage}
					setActivePage={setActivePage}
					totalPage={data?.pageCount}

				/>
			}

			{/* create modal  */}

			<Modal
				width={'900px'}
				title={'Create groups'}
				modal={Create}
				setModal={setCreate}
			>
				<div className=' md:p-5 '>
					<form
						className='flex flex-col items-center gap-3 justify-center'
						onSubmit={createFunc}
					>

						<input
							className='w-full p-2 border rounded  border-gray-500 outline-none   dark:focus:border-blue-500  focus:border-blue-500  dark:bg-gray-700 bg-transparent '
							placeholder='guru nomi'
							type='text'
							ref={nameRef}
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
								Bekor Qilish
							</button>
						</div>
					</form>
				</div>
			</Modal>

			{/* edit modal  */}

			<Modal
				width={'900px'}
				title={'Edit groups'}
				modal={EditModal}
				setModal={setEditModal}
			>
				<div className=' md:p-5 '>
					<form
						className='flex flex-col items-center gap-3 justify-center'
						onSubmit={editFunc}
					>

						<input
							className='w-full p-2 border rounded  border-gray-500 outline-none   dark:focus:border-blue-500  focus:border-blue-500  dark:bg-gray-700 bg-transparent '
							placeholder='Guruh nomi'
							type='text'
							ref={editnameRef}
							defaultValue={OneData?.group_name}
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
								onClick={() => setEditModal(false)}
							>
								Bekor Qilish
							</button>
						</div>
					</form>
				</div>
			</Modal>

			{/* delete modal  */}

			<Modal
				width={' w-[85%] md:w-[600px] '}
				title={'Delete groups'}
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
							Sz bu guruhni o'chirmoqchimisz?{' '}
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
								Bekor Qilish
							</button>
						</div>
					</form>
				</div>
			</Modal>

			<ToastContainer />
		</>
	);
}
