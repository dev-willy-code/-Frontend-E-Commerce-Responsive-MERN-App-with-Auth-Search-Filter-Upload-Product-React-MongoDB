import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchProductsByCategory from '../helpers/fetchProductsByCategory';
import displayINRCurrency from '../helpers/displayCurrency';
//react-icons
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';
import Context from '../context';
import { useSelector } from 'react-redux';

const VerticalCardProduct = ({ category, heading }) => { //props
    const [data, setData] = useState([]);
    console.log("data: ", data);
    const [loading, setLoading] = useState(false);
    const loadingList = new Array(11).fill(null);
    const { fetchUserCountCartItems } = useContext(Context);
    const user = useSelector(state => state.user.user); //REDUX


    const handleAddToCart = async (e, id) => {
        const success = await addToCart(e, id); // Guarda si fue exitoso
        if (success) {
            fetchUserCountCartItems(); // Solo se ejecuta si addToCart fue exitoso
        }
    }

    const scrollElement = useRef();

    const fetchData = async () => {
        setLoading(true);
        try {
            const categoryProduct = await fetchProductsByCategory(category)
            console.log("vertical data: ", categoryProduct?.data);

            if (categoryProduct.success) {
                setData(categoryProduct?.data);
            } else if (categoryProduct.error) {
                toast.error(categoryProduct.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
        } catch (error) {
            toast.error("Error al cargar los productos", {
                position: "bottom-center",
                autoClose: 2000
            });
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        fetchData();
    }, [])

    const scrollRight = () => {
        scrollElement.current.scrollTo({
            left: scrollElement.current.scrollLeft + 300,
            behavior: "smooth", // Agrega animación suave
        });
    }

    const scrollLeft = () => {
        scrollElement.current.scrollTo({
            left: scrollElement.current.scrollLeft - 300,
            behavior: "smooth", // Agrega animación suave
        });
    }

    return (

        <>
            {!loading && data.length === 0 ? null : (
                <div className='mx-auto px-8 my-6 relative'>
                    <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

                    <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none' ref={scrollElement}>
                        <button onClick={scrollLeft} className='z-10 bg-white shadow-md rounded-full p-1 absolute left-4 text-lg'><FaAngleLeft /></button>
                        <button onClick={scrollRight} className='z-10 bg-white shadow-md rounded-full p-1 absolute right-4 text-lg'><FaAngleRight /></button>

                        {
                            loading ? (
                                loadingList.map((_, index) => {
                                    return (
                                        <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white dark:bg-slate-700 rounded-sm shadow-md'>
                                            <div className='bg-slate-200 dark:bg-gray-600 h-48 p-1 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-[fade-in-out_2s_ease-in-out_infinite]'>
                                            </div>
                                            <div className='p-4 grid gap-3'>
                                                <h2 className='py-3 bg-slate-200 dark:bg-slate-500 rounded-full animate-pulse'></h2>
                                                <p className='bg-slate-200 dark:bg-slate-500 rounded-full animate-pulse py-3'></p>
                                                <div className='flex gap-3'>
                                                    <p className='animate-pulse rounded-full bg-slate-200 dark:bg-slate-500 w-full  py-3'></p>
                                                    <p className='animate-pulse rounded-full bg-slate-200 dark:bg-slate-500 w-full  py-3'></p>
                                                </div>
                                                <button className='px-3 mt-1 rounded-full bg-slate-200 dark:bg-slate-500  py-3 animate-pulse'></button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                data.map((product, index) => {
                                    return (
                                        <Link to={"/product/" + product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white dark:bg-slate-700 rounded-sm shadow-md'>
                                            <div className='bg-slate-200 dark:bg-gray-600 h-48 p-1 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                                {/* object-scale-down: Intenta escalar la imagen manteniendo su proporción original.
                                            Si cabe en el contenedor sin deformarse, se comporta como object-contain.
                                            Si es más pequeña que el contenedor, se comporta como object-none (no escala). */}
                                                <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-105 transition-all mix-blend-multiply dark:mix-blend-normal bg-white' />
                                            </div>
                                            <div className='p-4 grid gap-3'>
                                                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black dark:text-white'>{product?.productName}</h2>
                                                <p className='capitalize text-slate-500 dark:text-gray-300'>{product?.categoryId.value}</p>
                                                <div className='flex gap-3'>
                                                    <p className='text-red-600 font-medium dark:font-bold'>{displayINRCurrency(product?.sellingPrice)}</p>
                                                    <p className='text-slate-500 dark:text-gray-300 line-through'>{displayINRCurrency(product?.price)}</p>
                                                </div>
                                                {
                                                    user?._id &&
                                                    <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 mt-1 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                                                }
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

export default VerticalCardProduct
