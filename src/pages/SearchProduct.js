import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import VerticalCard_SearchProduct from '../components/VerticalCard_SearchProduct'
import SummaryApi from './../common';
import { toast } from 'react-toastify';

const SearchProduct = () => {
    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    console.log("query: ", query.search) //?q=o

    const fetchProducts = async (controller) => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.searchProducts.url + query.search, { signal: controller.signal })
            const dataResponse = await response.json();

            if (dataResponse.success) {
                setData(dataResponse.data);
            }
            if (dataResponse.error) {
                toast.error(dataResponse.message)
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Solicitud abortada al cambiar params.");
            } else {
                console.error("searchProduct error: ", error);

            }
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const controller = new AbortController(); // Crear controlador de aborto
        fetchProducts(controller);
        return () => controller.abort(); // Cancelar solicitud anterior si hay una nueva
    }, [query])

    return (
        <div className='mx-auto p-4'>
            {/* esto lo comente porque prefiero la carga dentro de VerticalCard_SearchProduct que poner loading....  */}
            {/* {
                loading && (
                    <p className='text-lg text-center'>Loading...</p>
                )
            } */}

            <p className='text-lg font-semibold my-3 dark:text-slate-100'>Search Results: {data.length}</p>

            {
                data.length === 0 && !loading && (
                    <p className='bg-white text-lg text-center p-4'>No Data Found</p>
                )
            }

            {/* antes era asi ,con !loading , pero como quiero la carga dentro del componete VerticalCard_SearchProduct, entoences lo quite  */}
            {/* {
                data.length !== 0 && !loading && (
                    <VerticalCard_SearchProduct loading={loading} data={data} />
                )
            } */}

            {
                data.length !== 0 && (
                    <VerticalCard_SearchProduct loading={loading} data={data} />
                )
            }
        </div>
    )
}

export default SearchProduct