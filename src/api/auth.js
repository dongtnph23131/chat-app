import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const authApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://chat-app-poly.onrender.com/api' }),
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (user) => ({
                url: '/signup',
                body: user,
                method: 'POST'
            })
        }),
        signin: builder.mutation({
            query: (user) => ({
                url: '/signin',
                method: 'POST',
                body: user
            })
        })
    })
})

export const { useSignupMutation,useSigninMutation } = authApi

export default authApi