import React from 'react'
import Success_image from '../assest/success_payment.png';
import { Link } from 'react-router-dom';

const Success = () => {
    return (
        <div className='min-h-[calc(100vh-200px)] flex items-center justify-center'>
            <div className='bg-slate-200 dark:bg-slate-700 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2  min-h-96'>
                <img
                    src={Success_image}
                    width={150}
                    height={150}
                />
                <p className='text-green-600 font-bold text-xl'>Payment Success</p>
                <Link to={"/order"} className='p-2 px-3 mt-5 border-2 border-green-600 rounded font-semibold text-green-600 hover:bg-green-600 hover:text-white'>See Order</Link>
            </div>
        </div>

    )
}

export default Success
