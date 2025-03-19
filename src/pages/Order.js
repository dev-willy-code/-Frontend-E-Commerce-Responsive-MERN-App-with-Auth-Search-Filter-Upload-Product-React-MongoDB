import React, { useEffect, useState } from 'react'
import SummaryApi from '../common';
import { format, parseISO } from 'date-fns';
import displayINRCurrency from '../helpers/displayCurrency';

const Order = () => {
    const [data, setData] = useState([]);
    const fetchOrderDetails = async () => {
        const response = await fetch(SummaryApi.orderList.url, {
            method: SummaryApi.orderList.method,
            credentials: 'include'
        })

        const responseData = await response.json();
        if (responseData.success)
            setData(responseData.data)

        console.log("order-list: ", responseData);
    }

    useEffect(() => {
        fetchOrderDetails();
    }, [])

    const countryName = new Intl.DisplayNames(["es"], { type: "region" });

    return (
        <div>
            {
                (!data[0] || data.length === 0) && (
                    <p>No Order found</p>
                )
            }

            <div className='p-4 w-full flex flex-col gap-10'>
                {
                    data.map((item, index) => {
                        const formattedDate = item.createdAt
                            ? format(parseISO(item.createdAt), "dd/MM/yyyy hh:mm aa")
                            : "Fecha desconocida";
                        return (
                            <div key={index} className='dark:text-slate-100' >
                                <p className='font-medium text-lg '>{formattedDate}</p>
                                <div className='border border-slate-300 rounded overflow-hidden'>
                                    <div className='flex flex-col md:flex-row justify-between gap-4'>
                                        {/* Product Details */}
                                        <div className='grid gap-2 w-full'>
                                            {
                                                item?.productDetails.map((product, index) => {
                                                    return (
                                                        <div key={index} className='flex gap-3 bg-slate-50 dark:bg-slate-700 p-1'>
                                                            <img src={product.image[0]}
                                                                className='w-28 h-28 bg-slate-200 dark:bg-slate-600 object-scale-down p-2'
                                                            />
                                                            <div>
                                                                <div className='font-medium text-lg text-ellipsis line-clamp-1'>{product.name}</div>
                                                                <div className='flex items-center gap-5 mt-1'>
                                                                    <div className='text-lg text-red-500'>{displayINRCurrency(product.price)}</div>
                                                                    <p>Quantity: {product.quantity}</p>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        <div className='flex flex-col gap-4 p-2 min-w-[300px]'>
                                            {/* Payment details */}
                                            <div>
                                                <div className='text-lg font-medium'>Payment Details: </div>
                                                <p className='ml-1'>Payment method: {item.paymentDetails.payment_method_type[0]}</p>
                                                <p className='ml-1'>Payment Status: {item.paymentDetails.payment_status}</p>
                                                <p className='ml-1'>Country: {item.country ? countryName.of(item.country) : "Unknown"}</p>
                                            </div>

                                            {/* Shipping details */}
                                            <div>
                                                <div className='text-lg font-medium'>Shipping Details: </div>
                                                {
                                                    <p className='ml-1'>Shipping Amount: {displayINRCurrency(item.shipping_options[0].shipping_amount)} </p>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Amount*/}
                                    <div className='font-semibold w-fit ml-auto lg:text-lg mr-5 mb-2'>
                                        <p className=''>Total Amount: {displayINRCurrency(item.totalAmount)}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}

export default Order
