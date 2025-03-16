import React from 'react'
import Cancel_image from '../assest/cancel_payment.png';
import { Link } from 'react-router-dom';

const Cancel = () => {
    return (
        <div className='min-h-[calc(100vh-200px)] flex items-center justify-center'>
            <div className='bg-slate-200 dark:bg-slate-700 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2  min-h-96'>
                <img
                    src={Cancel_image}
                    width={150}
                    height={150}
                />
                <p className='text-red-600 font-bold text-xl'>Payment Cancel</p>
                <Link to={"/cart"} className='p-2 px-3 mt-5 border-2 border-red-600 rounded font-semibold text-red-600 hover:bg-red-600 hover:text-white'>Go to cart</Link>
            </div>
        </div>

    )
}

export default Cancel
