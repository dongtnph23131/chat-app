import React, { useState } from 'react'
import SideDrawer from '../components/SideDrawer'
import { Input } from 'antd'
import { useSearchUserQuery } from '../api/user'
import Skeleton from 'react-loading-skeleton'
const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [search, setSearch] = useState()
  const { data, isLoading } = useSearchUserQuery(search)
  const [isSearch, setIsSearch] = useState(false)
  const showIsSearch = () => {
    setIsSearch(true)
  }
  const onChangeSearch = (event) => {
    if (event.target.value === "") {
      setSearch()
      return
    }
    setSearch(event.target.value);
  }
  return (
    <div className='w-full'>
      <SideDrawer showIsSearch={showIsSearch} />
      {isSearch ? <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Search user</h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button onClick={() => setIsSearch(false)} type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                        <span className="absolute -inset-0.5"></span>
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <div className='flex'>
                        <Input onChange={onChangeSearch} className='mr-3' />
                      </div>
                      <ul role="list" className="my-6 divide-y divide-gray-200">
                        {isLoading ? <Skeleton count={5} /> : <>{data.data && data.data?.map((item, index) => {
                          return item._id !== user._id && <div key={index} className='h-[70px] w-full bg-gray-300 rounded-[10px] pt-[10px] pl-[10px] flex mt-3'>
                            <img src={item.avatar} className='w-[50px] h-[50px] rounded-full' />
                            <div className='ml-[20px] inline-block'>
                              <p className='mb-1'>{item.name}</p>
                              <div className='flex'>
                                <span className='font-bold flex'>Email :</span>
                                <p>{item.email}</p>
                              </div>
                            </div>
                          </div>
                        })}</>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> : ""}
    </div>
  )
}

export default HomePage