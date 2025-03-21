import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common';
import { useSelector } from 'react-redux';
import AdminProductCard from '../components/AdminProductCard';
import useLoading from '../hooks/useLoading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
    const user = useSelector(state => state.user.user);


    const [openUploadProduct, setOpenUploladProduct] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const { loading, setLoading, dots } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        //no hay ROLE.SUPERDAMIN PORQUE SE USA TAMBIEN PARA OPTIONS PARA ACTUALIZAR EL ROL DE LOS USURIROS, Y NO ESTA PERIMITOD CAMBIAR A SUPERADMIN, SI SE PEUDE ARREGLAR PERO LO DEJE ASI
        if (user?.permisos.productos.listar == false || user == null) {
            navigate("/")
        }
    }, [user]) //  esto lo pongo porque cuando desde el header se llama fecthUserDetails() , primero se navega , y luego se ejcuta la funcion, por eso coloco user para que se actulaize aca



    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const fetchData = await fetch(SummaryApi.allProducts.url, {
                method: SummaryApi.allProducts.method,
                credentials: 'include'
            })

            const dataResponse = await fetchData.json();


            console.log("products data: ", dataResponse);

            if (dataResponse.success) {
                setAllProducts(dataResponse?.data);
            } else {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            console.log("Error AllProducts Page: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllProducts()
    }, [])

    return (
        <div>
            <div className='bg-white dark:bg-slate-700 py-2 px-4 flex justify-between items-center'>
                <h2 className='font-bold text-lg dark:text-slate-100'>All Products</h2>
                {
                    (user?.permisos?.productos?.crear) &&
                    <button className='border-2 border-gray-400 text-orange-700 dark:text-orange-200  dark:bg-slate-500 hover:bg-red-100 dark:hover:bg-red-500 py-1 px-3 rounded-full transition-all'
                        onClick={() => setOpenUploladProduct(true)}>
                        Upload Product
                    </button>
                }

            </div>

            {/* all products */}
            <div className='grid 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-6
                2xl:grid-cols-7
                gap-5 py-4 px-3 h-[calc(100vh-190px)] overflow-y-scroll overflow-x-hidden'>
                {
                    //allProducts es array de objetos
                    loading ? (
                        <p className='ml-[2px] dark:text-white'>Loading{dots}</p>
                    ) : allProducts?.length > 0 ? (
                        allProducts?.map((product, index) => {
                            return (
                                <AdminProductCard data={product} key={index} fetchData={fetchAllProducts} />
                            )
                        })
                    ) : (
                        <p className="text-gray-500 dark:text-gray-200 col-span-full text-center text-lg font-semibold">
                            No hay productos disponibles.
                        </p>
                    )

                }
            </div>



            {/* Upload Product component */}
            {
                openUploadProduct && (
                    <UploadProduct onClose={() => setOpenUploladProduct(false)} fecthData={fetchAllProducts} />
                )
            }

        </div>


    )
}

export default AllProducts
