import React, { useEffect, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useSigninMutation } from '../api/auth';
import Swal from "sweetalert2"
import * as faceapi from "face-api.js"
import { GoSync } from 'react-icons/go';
import { Button } from 'antd';
const schema = yup.object().shape({
    email: yup.string().email('Email chưa đúng địng dạng').required('Email không được để trống'),
    password: yup.string().required('Password không được để trống').min(6, 'Password ít nhất 6 kí tự'),
});
const Login = () => {
    const [isCammera, setIsCammera] = useState(false)
    const [acount, setAcount] = useState()
    const [isLogin,setIsLogin]=useState(false)
    const [token, setToken] = useState()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const navagate = useNavigate()
    const [signin, { isLoading }] = useSigninMutation()
    const canvasRef = useRef()
    const videoRef = useRef()
    useEffect(() => {
        (() => {
            if (isCammera) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(devices => {
                    videoRef.current.srcObject = devices
                }).then(async () => {
                    await Promise.all([
                        faceapi.loadSsdMobilenetv1Model('/models'),
                        faceapi.loadFaceRecognitionModel('/models'),
                        faceapi.loadFaceLandmarkModel('/models'),
                    ])
                }).then(videoHandle).then(() => {

                })
            }
        })()
    }, [isCammera])
    const videoHandle = async () => {
        const faceDescriptors = []
        const descriptors = []
        const image = await faceapi.fetchImage(acount.avatar)
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
        descriptors.push(detection.descriptor)
        faceDescriptors.push(new faceapi.LabeledFaceDescriptors(acount.name, descriptors))
        let faceMatcher;
        setInterval(async () => {
            const data = await faceapi
                .detectAllFaces(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptors();
            faceMatcher = new faceapi.FaceMatcher(faceDescriptors, 0.4)
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
            faceapi.matchDimensions(canvasRef.current, {
                width: 500,
                height: 400
            })
            const resixed = faceapi.resizeResults(data, {
                width: 500,
                height: 400
            })
            for (const item of resixed) {
                const box = item.detection.box
                const drawBox = new faceapi.draw.DrawBox(box, {
                    label: faceMatcher.findBestMatch(item.descriptor) || null
                })
                drawBox.draw(canvasRef.current)
                if (drawBox.options.label._label === acount.name) {
                    console.log(1);
                    // navagate("/")
                    // navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(()=>{
                    //     console.log(1);
                    // })
                    // setIsLogin(true)
                }
            }

        }, 1000)
    }
    console.log(canvasRef);
    const onSubmit = async (data) => {
        const acount = await signin(data)
        if (!acount.error) {
            setIsCammera(true)
            setAcount(acount.data.user)
            setToken(acount.data.token)

        }
        else {
            Swal.fire({
                icon: 'error',
                title: acount.error.data.message
            })
        }
    }
    return (
        <>{isCammera ? <div
            className='flex justify-center items-center'>
            <video crossOrigin='anonymous' style={{ width: 500, height: 400 }} autoPlay ref={videoRef} />
            <canvas ref={canvasRef} style={{ position: 'absolute', width: 500, height: 400 }}></canvas>
            {/* <Button onClick={()=>{
                if(isLogin){
                   navagate('/')
                }
            }}>Login</Button> */}
        </div> : <div className='bg-gray-100 min-h-screen flex items-center justify-center'>
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
        </div>}</>
    )
}

export default Login