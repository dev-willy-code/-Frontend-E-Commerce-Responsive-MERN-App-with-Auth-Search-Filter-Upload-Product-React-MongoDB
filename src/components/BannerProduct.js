import React, { useEffect, useState } from 'react'

//Desktop
import image1 from '../assest/banner/img1.webp';
import image2 from '../assest/banner/img2.webp';
import image3 from '../assest/banner/img3.jpg';
import image4 from '../assest/banner/img4.jpg';
import image5 from '../assest/banner/img5.webp';

//Mobile
import image1Mobile from '../assest/banner/img1_mobile.jpg';
import image2Mobile from '../assest/banner/img2_mobile.webp';
import image3Mobile from '../assest/banner/img3_mobile.jpg';
import image4Mobile from '../assest/banner/img4_mobile.jpg';
import image5Mobile from '../assest/banner/img5_mobile.png';

//react-icons
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {

    const [currentImage, setCurrentImage] = useState(0);

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5
    ];

    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ];

    const nextImage = () => {
        if (desktopImages.length - 1 > currentImage)
            setCurrentImage(preve => preve + 1);
        else
            setCurrentImage(0);
    }

    const prevImage = () => {
        if (currentImage != 0) {
            setCurrentImage(preve => preve - 1);
        } else
            setCurrentImage(4);
    }

    //setInterval es asyncrono
    useEffect(() => {
        const interval = setInterval(() => {
            if (desktopImages.length - 1 > currentImage) {
                nextImage();
            } else {
                setCurrentImage(0);
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [currentImage]) //// ✅ Esto asegura que `useEffect` se ejecute cuando `currentImage` cambie

    return (
        <div className='mx-auto px-8'>
            <div className='h-56 md:h-72 w-full bg-slate-200 relative rounded-md'>

                <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl'>
                        <button onClick={prevImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft /></button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight /></button>
                    </div>
                </div>

                {/* Desktop and tablet version */}
                <div className='hidden md:flex h-full w-full overflow-hidden'>
                    {
                        desktopImages.map((imageURL, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-all' key={index} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURL} className='w-full h-full rounded-md' />
                                </div>
                            )
                        })
                    }
                </div>

                {/* Mobile version */}
                <div className='flex md:hidden h-full w-full overflow-hidden'>
                    {
                        mobileImages.map((imageURL, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-all' key={index} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURL} className='w-full h-full object-cover' />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default BannerProduct
