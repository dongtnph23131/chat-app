import React from 'react'

const Modal = ({user,closeModal}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
            <div className="w-4/12">
                <div className="px-6 py-3 h-10 bg-gray-600 text-left text-xs font-medium text-black uppercase tracking-wider rounded-tr-[20px] rounded-tl-[20px]">
                    <button onClick={closeModal} className="float-right">
                        <i className="fas fa-times" style={{ fontSize: 20 }} />
                    </button>
                </div>
                <div className="py-5 h-900 bg-gray-100 rounded-br-[20px] rounded-bl-[20px]">
                    <h1 className='text-2xl font-medium ml-[40%]'>{user.name}</h1>
                    <img src={user.avatar} className='w-[100px] h-[100px] rounded-full ml-[40%] my-4'/>
                    <h4 className='text-lg ml-[20%]'>Email: {user.email}</h4>
                </div>
            </div>
        </div>
    )
}

export default Modal