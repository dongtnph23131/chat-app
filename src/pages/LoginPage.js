import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from "face-api.js"
const LoginPage = () => {
    const [descriptionFace, setDescriptionFace] = useState([])
    const canvasRef = useRef()
    const videoRef = useRef()
    useEffect(() => {
        (() => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(devices => {
                videoRef.current.srcObject = devices
            }).then(async () => {
                await Promise.all([
                    faceapi.loadSsdMobilenetv1Model('/models'),
                    faceapi.loadFaceRecognitionModel('/models'),
                    faceapi.loadFaceLandmarkModel('/models'),
                ])
            }).then(async () => {
                const img = await faceapi.fetchImage('https://i.ibb.co/SPZbKLx/369875957-1074846636819171-7147829613808930557-n.jpg')
                const data = await faceapi
                    .detectAllFaces(img)
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                console.log(data[0].descriptor);    
            }).then(videoHandle)
        })()
    }, [])
    const videoHandle = async () => {
        setInterval(async () => {
            const data = await faceapi
                .detectAllFaces(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptors();
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
                    //tìm kiếm tên
                    label: 'Face'
                })
                drawBox.draw(canvasRef.current)
            }
        }, 1000)
    }
    return (
        <div style={{ display: 'flex' }}>
            <video crossOrigin='anonymous' style={{ width: 500, height: 400 }} autoPlay ref={videoRef} />
            <canvas ref={canvasRef} style={{ position: 'absolute', width: 500, height: 400 }}></canvas>
        </div>
    )
}

export default LoginPage