import { Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import * as faceapi from "face-api.js"
import { AiOutlineClose } from "react-icons/ai"
import Swal from "sweetalert2"
import { GoSync } from "react-icons/go"
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSignupMutation } from '../api/auth'
import { NavLink, useNavigate } from 'react-router-dom'
const schema = yup.object().shape({
  name: yup.string().required('Tên tài khoản không để trống'),
  email: yup.string().email('Email chưa đúng địng dạng').required('Email không được để trống'),
  password: yup.string().required('Password không được để trống').min(6, 'Password ít nhất 6 kí tự'),
  avatar: yup.mixed().test('required', 'Cần upload file avatar', value => {
    return value && value.length;
  })
});
const SignupPage = () => {
  const [signup, { isLoading }] = useSignupMutation()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [isCheckFace, setIsCheckFace] = useState(false)
  const [img, setImage] = useState("")
  const [isLengthImg, setIsLengthImg] = useState()
  const [isImgLoading, setIsImgLoading] = useState(false)
  const navigate = useNavigate()
  const onChangeImg = async (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    setIsImgLoading(true)
    const apiResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=283182a99cb41ed4065016b64933524f`,
      formData
    );
    setIsImgLoading(false)
    setImage(apiResponse.data.data.url);
  }
  useEffect(() => {
    (async () => {
      setIsCheckFace(true)
      // tải mô hình nhận diện khuôn mặt từ files models
      await Promise.all([
        faceapi.loadSsdMobilenetv1Model('/models'),
        faceapi.loadFaceRecognitionModel('/models'),
        faceapi.loadFaceLandmarkModel('/models'),
      ]).then(await handleImage)
    })()
  }, [img])
  const handleImage = async () => {
    //tải hình ảnh từ url cụ thể
    if (img) {
      const imgUrl = await faceapi.fetchImage(img)
      //phát hiện các khuôn mặt có trong hình ảnh
      const data = await faceapi
        .detectAllFaces(imgUrl)
        .withFaceLandmarks()
        .withFaceDescriptors();
      setIsLengthImg(data.length)
    }
    setIsCheckFace(false)
  }
  const onSubmit = async (data) => {
    if (isLengthImg === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Bạn cần upload avatar có khuôn mặt'
      })
      return
    }
    if (isLengthImg !== 1) {
      Swal.fire({
        icon: 'error',
        title: 'Bạn cần upload avatar có duy nhất 1 khuôn mặt'
      })
      return
    }
    const acount = await signup({ ...data, avatar: img })
    if (!acount.error) {
      Swal.fire(
        'Good job!',
        'Đăng ký thành công',
        'success'
      )
      setTimeout(() => {
        navigate('/login')
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
    <>
      {isCheckFace ? <div className='fixed top-[40%] left-[40%]' >
        <i
          className="fas fa-circle-notch fa-spin"
          style={{ fontSize: "200px", color: "gray" }}
        />
      </div> : ""}
      <div className='bg-gray-100 min-h-screen flex items-center justify-center'>
        <div className='bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5'>
          <div className='sm:w-1/2 px-16'>
            <h2 className='font-bold text-2xl text-[#002D74]'>Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4' >
              <input {...register('email')} className='p-2 mt-8 rounded-xl border ' type='text' placeholder='Email' />
              <p className='text-red-400'>{errors.email ? errors?.email.message : ""}</p>
              <input {...register('name')} className='p-2 mt-8 rounded-xl border ' type='text' placeholder='Name' />
              <p className='text-red-400'>{errors.name ? errors?.name.message : ""}</p>
              <input {...register('password')} className='p-2 mt-8 rounded-xl border ' type='password' placeholder='Mật khẩu' />
              <p className='text-red-400'>{errors.password ? errors?.password.message : ""}</p>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avatar</label>
              {img ? <div className='flex'>
                <img src={img} className='w-full h-[300px]' />
                <Button onClick={() => setImage("")}><AiOutlineClose className='font-bold text-lg' /></Button>
              </div> : ''}
              {
                <>{isImgLoading ? <GoSync className='animate-spin ml-[50%]' /> : ""}</>
              }
              <input {...register('avatar')} onChange={onChangeImg} accept=".png, .jpg" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" />
              <p className='text-red-400'>{errors.avatar ? errors?.avatar.message : ""}</p>
              <button className='bg-[#002D74] rounded-2xl text-white py-2 mt-4 hover:scale-105 duration-300' type='submit'>
               {isLoading?<i
          className="fas fa-circle-notch fa-spin"
          style={{ fontSize: "30px", color: "gray" }}
        />:'Đăng ký'}</button>
            </form>
            <div className='mt-5 text-xs flex justify-between items-center'>
              <p>Don't have an acount?</p>
              <NavLink to={'/login'}><button className='py-2 px-5 bg-white border rounded-xl'>Login</button></NavLink>
            </div>
          </div>
          <div className='w-1/2'>
            <img src='https://i.imgur.com/SfVMNiF.png' />
          </div>
        </div>
      </div>

    </>
  )
}

export default SignupPage