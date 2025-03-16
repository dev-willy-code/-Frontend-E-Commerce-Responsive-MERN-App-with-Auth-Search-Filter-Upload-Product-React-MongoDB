import React from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";

const DisplayImage = ({ imgUrl, onClose }) => {
    return (

        <div className='fixed bottom-0 top-0 right-0 left-0 flex justify-center items-center bg-slate-400'>
            <div className='bg-red-500 shadow-2xl rounded-2xl mx-auto'>

                <div className=' relative p-3 max-w-[90vh] max-h-[90vh]'>
                    <div className='absolute top-5 right-5 left-0 w-fit ml-auto text-3xl hover:text-red-600 cursor-pointer'
                        onClick={onClose}
                    >
                        <IoCloseCircleOutline />
                    </div>
                    <img src={imgUrl} className='w-[80vh] h-[80vh] rounded-2xl' />
                </div>


            </div>
        </div>



    )
}

export default DisplayImage
