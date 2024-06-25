import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// const md5 = require('md5')

const token =
	typeof window !== 'undefined' ? localStorage.getItem('token') : null;

let mykeys;

export const bookApi = createApi({
	reducerPath: 'bookApi',
	tagTypes: ['News'],
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://my-blog-api-nine.vercel.app/api',
	}),
	endpoints: (builder) => ({
		registerUser: builder.mutation({
			query: (userData) => ({
				url: '/news',
				method: 'POST',
				body: userData,
			}),
		}),
		addBook: builder.mutation({
			query: (bookData) => ({
				url: '/news',
				method: 'POST',
				body: bookData,
				headers: {
					Key: `${mykeys?.key}`,
					// "Sign": `${md5("POST" + "/books" + JSON.stringify({ isbn: `${bookData.isbn}` }) + mykeys?.secret)}`
				},
			}),

			invalidatesTags: ['News'],
		}),

		editBookStatus: builder.mutation({
			query: ({ id, book, status }) => ({
				url: `/news/${id}`,
				method: 'PATCH',
				body: { status, book },
				headers: {
					Key: `${mykeys?.key}`,
					// "Sign": `${md5(`PATCH${'/books/' + id}${JSON.stringify({book: {...book}, status: status})}` + mykeys?.secret)}`
				},
			}),
			invalidatesTags: ['News'],
		}),
		deleteBook: builder.mutation({
			query: (bookId) => ({
				url: `/news/${bookId}`,
				method: 'DELETE',
				headers: {
					Key: `${mykeys?.key}`,
					// "Sign": `${md5("DELETE" + `/books/${bookId}` + mykeys?.secret)}`
				},
			}),
			invalidatesTags: ['News'],
		}),
		getAllBooks: builder.query({
			query: () => ({
				url: '/news',
				method: 'GET',
			}),
			providesTags: (result) => {
				console.log(
					result,
					'get bolgan datani korvolasz kn datani return qilishiz kerak'
				);
				console.log(result ? 'bor ' : 'yoqqqqqqqqq');
				return result
					? result?.map((el) => {
							console.log({ type: 'News', el }, 'ell');
							return { type: 'News', el };
					  })
					: [];
			},
		}),
		getMySelf: builder.query({
			query: () => ({
				url: '/',
				method: 'GET',
				headers: {
					Key: `${mykeys?.key}`,
					// "Sign": `${md5("get".toUpperCase() + "/myself" + mykeys?.secret)}`
				},
			}),
			providesTags: (result) => {
				console.log(result, 'res my selg');
				return result ? result.map((el) => ({ type: 'News', el })) : [];
				// return result ? result.map(({ id }) => ({ type: 'News', id })) : [];
			},
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useAddBookMutation,
	useEditBookStatusMutation,
	useDeleteBookMutation,
	useGetAllBooksQuery,
	useGetMySelfQuery,
} = bookApi;
