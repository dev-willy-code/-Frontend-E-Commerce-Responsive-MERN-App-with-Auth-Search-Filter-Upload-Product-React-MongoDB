import React, { useContext } from 'react'
import displayINRCurrency from '../helpers/displayCurrency';
//react-icons
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';
import Context from '../context';

const VerticalCard_SearchProduct = ({ loading, data = [] }) => { //props
    console.log("data: ", data);
    const loadingList = new Array(13).fill(null);
    const { fetchUserCountCartItems } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        const success = await addToCart(e, id); // Guarda si fue exitoso
        if (success) {
            fetchUserCountCartItems(); // Solo se ejecuta si addToCart fue exitoso
        }
    }

    return (

        <>
            {!loading && data.length === 0 ? null : (
                <div className='mx-auto px-8 my-6 relative'>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-scroll scrollbar-none transition-all'>


                        {
                            loading ? (
                                loadingList.map((product, index) => {
                                    return (
                                        <div className=' bg-white dark:bg-slate-700 rounded-sm shadow-md'>
                                            <div className='bg-slate-200 dark:bg-slate-600  h-48 p-1 flex justify-center items-center animate-[fade-in-out_2s_ease-in-out_infinite]'>
                                            </div>
                                            <div className='p-4 grid gap-3'>
                                                <h2 className='py-3 bg-slate-200 dark:bg-slate-500 rounded-full animate-pulse'></h2>
                                                <p className='bg-slate-200 dark:bg-slate-500 rounded-full animate-pulse py-3'></p>
                                                <div className='flex gap-3'>
                                                    <p className=' animate-pulse rounded-full bg-slate-200 dark:bg-slate-500 w-full  py-3'></p>
                                                    <p className=' animate-pulse rounded-full bg-slate-200 dark:bg-slate-500 w-full  py-3'></p>
                                                </div>
                                                <button className=' px-3 mt-1 rounded-full bg-slate-200 dark:bg-slate-500 py-3 animate-pulse'></button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                data.map((product, index) => {
                                    return (
                                        <Link to={"/product/" + product?._id} className='bg-white dark:bg-slate-700 rounded-sm shadow-md' >
                                            <div className='bg-slate-200 dark:bg-slate-600 h-48 p-1 flex justify-center items-center'>
                                                {/* object-scale-down: Intenta escalar la imagen manteniendo su proporción original.
                                            Si cabe en el contenedor sin deformarse, se comporta como object-contain.
                                            Si es más pequeña que el contenedor, se comporta como object-none (no escala). */}
                                                <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-105 transition-all mix-blend-multiply dark:mix-blend-normal' />
                                            </div>
                                            <div className='p-4 grid gap-3'>
                                                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black dark:text-white'>{product?.productName}</h2>
                                                <p className='capitalize text-slate-500 dark:text-slate-300'>{product?.categoryId.value}</p>
                                                <div className='flex gap-3'>
                                                    <p className='text-red-600 font-medium dark:font-bold'>{displayINRCurrency(product?.sellingPrice)}</p>
                                                    <p className='text-slate-500 line-through dark:text-slate-100'>{displayINRCurrency(product?.price)}</p>
                                                </div>
                                                <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 mt-1 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                                            </div>
                                        </Link>
                                    )
                                })
                            )

                        }
                    </div>


                </div>
            )}
        </>

    )
}

export default VerticalCard_SearchProduct
