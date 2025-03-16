//rafce: shortcut
import React, { useContext, useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import Context from '../context'
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

//stripe
//import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false); //loading de viewCartItems

    const loadingCart = new Array(4).fill(null);
    const { fetchUserCountCartItems } = useContext(Context);

    const navigate = useNavigate(); // REACT-ROUTER
    const user = useSelector(state => state.user.user); //REDUX

    useEffect(() => {
        //no hay ROLE.SUPERDAMIN PORQUE SE USA TAMBIEN PARA OPTIONS PARA ACTUALIZAR EL ROL DE LOS USURIROS, Y NO ESTA PERIMITOD CAMBIAR A SUPERADMIN, SI SE PEUDE ARREGLAR PERO LO DEJE ASI
        if (!user || user == null) {
            navigate("/")
        }
    }, [user]) //  esto lo pongo porque cuando desde el header se llama fecthUserDetails() , primero se navega , y luego se ejcuta la funcion, por eso coloco user para que se actulaize aca


    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.viewCartItems.url, {
                method: SummaryApi.viewCartItems.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
            })

            const responseData = await response.json();

            if (responseData.success) {
                setData(responseData.data);
            }
            if (responseData.error) {
                toast.error(responseData.message)
            }
            console.log("data cart items: ", data);
        } catch (error) {
            console.log("addToCart error: ", error);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchUserCountCartItems();
        fetchData();
    }, []) //// 👈 Dependencias vacías evita la ejecución infinita


    const deleteCartItem = async (id) => {
        try {
            const response = await fetch(SummaryApi.deleteCartItems.url, {
                method: SummaryApi.deleteCartItems.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        _id: id,
                    }
                )
            })

            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
                fetchUserCountCartItems(); //cuenta la cantidad ed items en el carrito
                toast.success(responseData.message)
            }
            if (responseData.error) {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log("deleteCartItem error: ", error);
        }

    }


    const increaseQty = async (id, qty) => {
        try {
            const response = await fetch(SummaryApi.updateCartItems.url, {
                method: SummaryApi.updateCartItems.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        _id: id,
                        quantity: qty + 1
                    }
                )
            })

            const responseData = await response.json()


            if (responseData.success) {
                setData(prevData =>
                    prevData.map(product =>
                        product._id === id ? { ...product, quantity: qty + 1 } : product
                    )
                );
            }
            if (responseData.error) {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log("updateCart error: ", error);
        }

    }


    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartItems.url, {
                method: SummaryApi.updateCartItems.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        _id: id,
                        quantity: qty - 1
                    }
                )
            })

            const responseData = await response.json()


            if (responseData.success) {
                setData(prevData =>
                    prevData.map(product =>
                        product._id === id ? { ...product, quantity: qty - 1 } : product
                    )
                );
            }
        }
    }


    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    const handlePayment = async () => {
        console.log(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

        const response = await fetch(SummaryApi.checkout.url, {
            method: SummaryApi.checkout.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ cartItems: data })
        })

        const responseData = await response.json();
        console.log(responseData.id);
        if (responseData?.id) {
            stripePromise.redirectToCheckout({ sessionId: responseData.id });
        }
        console.log(responseData);
    }

    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white dark:bg-slate-700 dark:text-slate-100 py-5'>No Data</p>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/* view cart items */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart?.map((el, index) => {
                                return (
                                    <div key={index} className='w-full bg-slate-200 dark:bg-slate-600 h-32 my-2 border border-slate-300 dark:border-slate-400 animate-pulse rounded'></div>
                                )
                            })
                        ) : (
                            data.map((product, index) => {
                                return (
                                    // 128px → La primera columna tendrá exactamente 128 píxeles de ancho.
                                    // 1fr → La segunda columna ocupará todo el espacio restante disponible en el contenedor
                                    <div key={index} className='w-full bg-white dark:bg-slate-700 h-32 my-2 border border-slate-300 dark:border-slate-500 overflow-hidden rounded grid grid-cols-[128px,1fr]'>
                                        <div className='w-32 h-32 bg-slate-200 dark:bg-slate-600'>
                                            <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply dark:mix-blend-normal'></img>
                                        </div>
                                        <div className='px-4 py-2 relative'>
                                            {/* delete product */}
                                            <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartItem(product?._id)}>
                                                <MdDelete />
                                            </div>
                                            <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1 dark:text-white'>{product?.productId?.productName}</h2>
                                            <p className='capitalize text-slate-500 dark:text-slate-300'>{product?.productId?.categoryId?.value}</p>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                <p className='text-slate-600 dark:text-slate-300 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                            </div>

                                            <div className='flex items-center gap-3 mt-1'>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => decraseQty(product?._id, product?.quantity)} >-</button>
                                                <span className='dark:text-slate-300'>{product?.quantity}</span>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => increaseQty(product?._id, product?.quantity)} >+</button>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                        )

                    }
                </div>

                {/***summary  */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>

                    {

                        loading ? (
                            <div className='h-36 bg-slate-200 dark:bg-slate-600 border border-slate-300 dark:border-slate-400 animate-pulse'>
                            </div>
                        ) : (
                            data[0] && (
                                <div className='h-36 bg-white dark:bg-slate-700'>
                                    <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600 mt-1'>
                                        <p className='dark:text-slate-100'>Total Quantity</p>
                                        <p className='dark:text-slate-100'>{totalQty}</p>
                                    </div>

                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p className='dark:text-slate-100'>Total Price</p>
                                        <p className='dark:text-slate-100'>{displayINRCurrency(totalPrice)}</p>
                                    </div>

                                    <button
                                        className='bg-blue-600 p-2 text-white w-full mt-2'
                                        onClick={handlePayment}
                                    >
                                        Payment
                                    </button>

                                </div>
                            )

                        )

                    }
                </div>
            </div>
        </div>
    )
}

export default Cart
