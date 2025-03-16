import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import displayINRCurrency from '../helpers/displayCurrency';
import AdminEditProduct from './AdminEditProduct';
import { useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";
import useLoading from '../hooks/useLoading';
import SummaryApi from '../common';
import { toast } from 'react-toastify';


const AdminProductCard = ({ data, fetchData }) => {
    const user = useSelector(state => state.user.user);

    const [editProduct, setEditProduct] = useState(false);

    const deleteProduct = async () => {
        // console.log("deleteProduct calling");
        // return

        try {
            const dataResponse = await fetch(SummaryApi.deleteProduct.url, {
                method: SummaryApi.deleteProduct.method,
                credentials: 'include', //IMPORTANTE, SIN ESO AUTHTOKEN responderia not logged in porque as cookies no se enviarian
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    productId: data?._id
                })
            })

            const dataApi = await dataResponse.json();
            console.log("dataApi", dataApi)
            if (dataApi.success) {
                toast.success(dataApi.message, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                fetchData();
            }
            else if (dataApi.error) {
                toast.error(dataApi.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.log("Error al eliminar producto(Admin Panel): ", error)
        }

    }

    return (
        <div className='bg-white dark:bg-slate-700 p-4 rounded-md w-44 border border-slate-300 h-60'>
            <div className='w-40'>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} className='mx-auto object-fill h-full'></img>
                </div>
                <h1 className='truncate max-w-36 text-ellipsis dark:text-slate-100'
                    title={data?.categoryId.value} // <-- Esto muestra el texto completo en un tooltip nativo
                >
                    {data?.productName}
                </h1>

                <div>
                    <p className='font-semibold dark:text-slate-100'>
                        {
                            displayINRCurrency(data?.sellingPrice)
                        }
                    </p>

                    <div className='flex items-center justify-end gap-2 mr-4'>
                        {
                            user?.permisos?.productos?.actualizar &&
                            <div className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={() => setEditProduct(true)}>
                                <MdModeEditOutline />
                            </div>
                        }
                        {
                            user?.permisos?.productos?.eliminar &&
                            <div className='w-fit p-2 bg-red-500 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={() => deleteProduct()}>
                                <MdDelete className='text-white' />

                            </div>
                        }
                    </div>



                </div>
            </div>

            {
                editProduct && (
                    <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchData={fetchData} />
                )
            }
        </div>
    )
}

export default AdminProductCard
