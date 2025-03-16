import React, { useEffect, useState } from 'react'
import useLoading from "../hooks/useLoading.js";
import SummaryApi from '../common';
import { Link } from "react-router-dom";


const CategoryList = () => {

    const [categoryProducts, setCategoryProducts] = useState([]);
    const { loading, setLoading, dots } = useLoading();

    // es 11 porque hay 11 categorias de productos
    const categoryLoading = new Array(11).fill(null);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getOneProductByCategory.url) //method por default get
            const dataResponse = await response.json();
            setCategoryProducts(dataResponse.data);
        } catch (error) {
            console.log("CategoryList error: ", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryProduct();
    }, [])

    console.log("categoryProducts: ", categoryProducts);
    return (
        <div className='mx-auto px-8 py-4'>
            <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
                {
                    loading ? (
                        categoryLoading.map((_, index) => (
                            <div key={index}>
                                {/* Contenedor “imagen” circular */}
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 dark:bg-slate-700 flex items-center justify-center animate-pulse" />
                                {/* Texto (p) en modo skeleton */}
                                <p className="text-center text-sm md:text-base mt-1 bg-slate-200 dark:bg-slate-700 w-12 h-3 mx-auto animate-pulse"></p>
                            </div>
                        ))
                    ) :
                        (
                            categoryProducts.map((product, index) => {
                                return (
                                    // despues de "?" se concoe como query frontend
                                    <Link to={"/products-by-category-filtered?category=" + product?.categoryId.value} className='cursor-pointer' key={index}>
                                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 dark:bg-gray-700 flex items-center justify-center'>
                                            <img src={product?.productImage[0]} alt={product?.categoryId.value} className='bg-white h-full object-scale-down mix-blend-multiply dark:mix-blend-normal hover:scale-125 transition-all' />
                                        </div>
                                        <p className='text-center text-sm md:text-base capitalize dark:text-white'>{product?.categoryId.value}</p>
                                        <div />
                                    </Link>
                                )
                            }
                            ))
                }

            </div>
        </div>
    )
}

export default CategoryList
