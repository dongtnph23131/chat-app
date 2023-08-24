// import React, { useEffect, useRef, useState } from 'react'
// import { yupResolver } from '@hookform/resolvers/yup';
// import { BsCameraFill } from "react-icons/bs"
// import * as yup from 'yup';
// import { useForm } from 'react-hook-form';
// import { NavLink, Navigate, useNavigate } from 'react-router-dom';
// import { useSigninMutation } from '../api/auth';
// import Swal from "sweetalert2"
// import * as faceapi from "face-api.js"
// import { GoSync } from 'react-icons/go';
// import { Button } from 'antd';
// import Webcam from 'react-webcam';
// const schema = yup.object().shape({
//     email: yup.string().email('Email chưa đúng địng dạng').required('Email không được để trống'),
//     password: yup.string().required('Password không được để trống').min(6, 'Password ít nhất 6 kí tự'),
// });
// const Login = () => {
//     const [isCammera, setIsCammera] = useState(false)
//     const [isWebcam, setIsWebcam] = useState(false)
//     const [img, setImg] = useState("")
//     const [acount, setAcount] = useState()
//     const [isLogin, setIsLogin] = useState(false)
//     const [token, setToken] = useState()
//     const { register, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(schema),
//     });
//     const navagate = useNavigate()
//     const [signin, { isLoading }] = useSigninMutation()
//     const canvasRef = useRef()
//     const imgRef = useRef(new Image());
//     useEffect(() => {
//         (async () => {
//             if (img) {
//                 await Promise.all([
//                     faceapi.loadSsdMobilenetv1Model('/models'),
//                     faceapi.loadFaceRecognitionModel('/models'),
//                     faceapi.loadFaceLandmarkModel('/models'),
//                 ]).then(imgHandle)
//             }
//         })()
//     }, [img])
//     const imgHandle = async () => {
//         const faceDescriptors = []
//         const descriptors = []
//         const image = await faceapi.fetchImage(acount.avatar)
//         const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
//         descriptors.push(detection.descriptor)
//         faceDescriptors.push(new faceapi.LabeledFaceDescriptors(acount.name, descriptors))
//         let faceMatcher;
//         setInterval(async () => {
//             const data = await faceapi
//                 .detectAllFaces(imgRef.current)
//                 .withFaceLandmarks()
//                 .withFaceDescriptors();
//             faceMatcher = new faceapi.FaceMatcher(faceDescriptors, 0.4)
//             canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(imgRef.current)
//             faceapi.matchDimensions(canvasRef.current, {
//                 width: 800,
//                 height: 700
//             })
//             const resixed = faceapi.resizeResults(data, {
//                 width: 800,
//                 height: 700
//             })
//             for (const item of resixed) {
//                 const box = item.detection.box
//                 const drawBox = new faceapi.draw.DrawBox(box, {
//                     label: faceMatcher.findBestMatch(item.descriptor) || null
//                 })
//                 drawBox.draw(canvasRef.current)
//                 if (drawBox.options.label._label === acount.name) {
//                     setIsCammera(false)
//                 }
//             }

//         }, 1000)
//     }
//     const onSubmit = async (data) => {
//         const acount = await signin(data)
//         if (!acount.error) {
//             setIsCammera(true)
//             setAcount(acount.data.user)
//             setToken(acount.data.token)

//         }
//         else {
//             Swal.fire({
//                 icon: 'error',
//                 title: acount.error.data.message
//             })
//         }
//     }
//     return (
//         <>{isCammera ? <>
//             <h1 className='ml-[40%] font-bold text-3xl mt-5'>Nhận diện khuôn mặt</h1>
//             <div
//                 className='flex justify-center items-center mt-5'>
//                 {img ? <>
//                     <img ref={imgRef} src={img} />
//                     <canvas ref={canvasRef} style={{ position: 'absolute', width: 800, height: 700 }}></canvas>
//                 </> : <> <Webcam
//                     className='w-1/2 h-[500px] relative'
//                     audio={false}
//                     height={720}
//                     screenshotFormat="image/jpeg"
//                     width={1280}
//                 >
//                     {({ getScreenshot }) => (
//                         <button
//                             onClick={() => {
//                                 const imageSrc = getScreenshot()
//                                 setImg(imageSrc);
//                             }}
//                         >
//                             <BsCameraFill className='text-5xl absolute top-[65%] left-[50%]' />
//                         </button>
//                     )}
//                 </Webcam></>}
//             </div> </> : <div className='bg-gray-100 min-h-screen flex items-center justify-center'>
//             <div className='bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5'>
//                 <div className='sm:w-1/2 px-16'>
//                     <h2 className='font-bold text-2xl text-[#002D74]'>Đăng nhập tài khoản</h2>
//                     <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
//                         <input className='p-2 mt-8 rounded-xl border ' type='text' placeholder='Email' {...register('email')} />
//                         <p className='text-red-400'>{errors.email ? errors?.email.message : ""}</p>
//                         <input className='p-2 mt-8 rounded-xl border ' type='password' placeholder='Mật khẩu' {...register('password')} />
//                         <p className='text-red-400'>{errors.password ? errors?.password.message : ""}</p>
//                         <button className='bg-[#002D74] rounded-2xl text-white py-2 mt-4 hover:scale-105 duration-300' type='submit'>
//                             {isLoading ? <GoSync className='animate-spin ml-[50%]' /> : 'Đăng nhập'}</button>

//                     </form>
//                     <div className='mt-5 text-xs flex justify-between items-center'>
//                         <p>Don't have an acount?</p>
//                         <NavLink to={'/signup'}><button className='py-2 px-5 bg-white border rounded-xl'>Register</button></NavLink>
//                     </div>
//                 </div>
//                 <div className='w-1/2'>
//                     <img src='https://i.imgur.com/SfVMNiF.png' />
//                 </div>
//             </div>
//         </div>}</>
//     )
// }

// export default Login
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSigninMutation} from '../api/auth';
import Swal from "sweetalert2"
import { GoSync } from 'react-icons/go';
const schema = yup.object().shape({
    email: yup.string().email('Email chưa đúng địng dạng').required('Email không được để trống'),
    password: yup.string().required('Password không được để trống').min(6, 'Password ít nhất 6 kí tự'),
});
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const navagate = useNavigate()
    const [signin, { isLoading }] = useSigninMutation()
    const onSubmit =async (data) => {
        const acount = await signin(data)
        if (!acount.error) {
            Swal.fire(
                'Good job!',
                'Đăng nhập thành công',
                'success'
            )
            localStorage.setItem('user',JSON.stringify(acount.data.user))
            localStorage.setItem('token',JSON.stringify(acount.data.token))
            setTimeout(() => {
                navagate('/')
            }, 1000)
        }
        else {
            Swal.fire({
                icon: 'error',
                title: acount.error.data.message
            })
        }
    }
    return (
        <div className='bg-gray-100 min-h-screen flex items-center justify-center'>
            <div className='bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5'>
                <div className='sm:w-1/2 px-16'>
                    <h2 className='font-bold text-2xl text-[#002D74]'>Đăng nhập tài khoản</h2>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <input className='p-2 mt-8 rounded-xl border ' type='text' placeholder='Email' {...register('email')} />
                        <p className='text-red-400'>{errors.email ? errors?.email.message : ""}</p>
                        <input className='p-2 mt-8 rounded-xl border ' type='password' placeholder='Mật khẩu' {...register('password')} />
                        <p className='text-red-400'>{errors.password ? errors?.password.message : ""}</p>
                        <button className='bg-[#002D74] rounded-2xl text-white py-2 mt-4 hover:scale-105 duration-300' type='submit'>
                            {isLoading ? <GoSync className='animate-spin ml-[50%]' /> : 'Đăng nhập'}</button>
                       
                    </form>
                    <div className='mt-5 text-xs flex justify-between items-center'>
                        <p>Don't have an acount?</p>
                        <NavLink to={'/signup'}><button className='py-2 px-5 bg-white border rounded-xl'>Register</button></NavLink>
                    </div>
                </div>
                <div className='w-1/2'>
                    <img src='https://i.imgur.com/SfVMNiF.png' />
                </div>
            </div>
        </div>
    )
}

export default Login