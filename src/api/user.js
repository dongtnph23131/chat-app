import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const userApi=createApi({
    reducerPath:'user',
    baseQuery:fetchBaseQuery({baseUrl:'https://chat-app-poly.onrender.com/api'}),
    endpoints:(builder)=>({
        searchUser:builder.query({
            query:(search)=>`/search/user?search=${search}`
        })
    })
})
export const {useSearchUserQuery}=userApi

export default userApi