import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
//import productCategory from "../helpers/productCategory"; //ahora esta en la base de datos
import VerticalCard_SearchProduct from '../components/VerticalCard_SearchProduct'
import fetchCategories from '../helpers/productCategory';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

//Esta pagina muestra todos los productos por categoria pero filtrados, por eso no se aggra el "getProductsbyCategory"
//diferente a CategoryList ,que solo te muestra 1 producto por categoria, y se usa solo para la parte de arriba del home
const ProductsByCategoryFiltered = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]); // Almacenar datos originales
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    //////////////////////////////////////////////////
    const location = useLocation();
    const urlSearch = new URLSearchParams(location?.search);
    const urlCategoryListingArray = urlSearch.getAll("category");

    const urlCategoryListObject = {}
    urlCategoryListingArray.forEach(el => {
        urlCategoryListObject[el] = true  // [] no es de array en este caso, es de objeto
    })

    console.log("urlCategoryListingArray: ", urlCategoryListingArray);
    console.log("urlCategoryListObject: ", urlCategoryListObject);

    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
    const [filterCategoryList, setFilterCategoryList] = useState([]);

    const [sortBy, setSortBy] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.filterProducts.url, {
                method: SummaryApi.filterProducts.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    category: filterCategoryList
                })
            })

            const dataResponse = await response.json();
            if (dataResponse.success) {
                setData(dataResponse?.data || []);
                setOriginalData(dataResponse?.data || []);
                console.log("dataResponse: ", dataResponse);
            } else if (dataResponse.error) {
                toast.error(dataResponse.message);
            }

        } catch (error) {
            console.log("Error en ProductByCategoryFiltered: ", error)
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => { // se ejecuta al renderizar por primera vez y al cambio de filterCategoryList
        fetchData();
    }, [filterCategoryList])

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
        }
        loadCategories();
    }, []);


    //aca como checkbox englova una sola cosa: cateogria, no se usa name,sino value
    const handleSelectCategory = (e) => {
        const { value, checked } = e.target;

        setSelectCategory((prev) => {
            return {
                ...prev,
                [value]: checked
            }
        })
    }

    console.log(selectCategory);

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
            if (selectCategory[categoryKeyName]) {
                return categoryKeyName;
            }
            return null;
        }).filter(el => el); //el filter es para quitar el null

        console.log("arrayOfCategory: ", arrayOfCategory);
        setFilterCategoryList(arrayOfCategory); //ejm: ["airpods","earphones"]


        //format for url change of the checkbox
        const urlFormat = arrayOfCategory.map((el, index) => {
            if ((arrayOfCategory.length - 1) === index) {
                return `category=${el}`
            }
            return `category=${el}&&`
        })
        console.log("urlFormat: ", urlFormat); //['category=airpods&&', 'category=earphones']

        navigate("/products-by-category-filtered?" + urlFormat.join(""))
    }, [selectCategory])

    const handleOnChangeSortBy = (e) => {
        const { value } = e.target;
        console.log("value: ", value);
        setSortBy(value);
    }

    useEffect(() => {
        //Si asignaras directamente let sortedData = originalData;, cualquier cambio en sortedData también modificaría originalData
        let sortedData = [...originalData]; // Se crea una copia independiente

        if (sortBy === "asc") {
            sortedData.sort((a, b) => a.sellingPrice - b.sellingPrice);
        } else if (sortBy === "desc") {
            sortedData.sort((a, b) => b.sellingPrice - a.sellingPrice);
        } else {
            setData(originalData);
        }

        setData(sortedData);
    }, [sortBy, originalData]); // Se ejecuta cuando `data` o `sortBy` cambian




    return (
        <div className='mx-auto p-4'>
            {/* Desktop version */}
            {/* La primera columna tiene un ancho fijo de 200px.
            La segunda columna ocupa todo el espacio restante (1fr). */}
            <div className=' sm:grid grid-cols-[200px,1fr]'>
                {/* left side */}
                <div className='bg-white dark:bg-slate-700 p-2 min-h-[calc(100vh-200px)]'> {/*vh = Viewport Height (altura del viewport o pantalla).*/}
                    {/* sort by */}
                    <div className=''>
                        <h3 className='text-base uppercase font-medium text-slate-500 dark:text-slate-200 border-b pb-1 border-slate-300'>Sort by: </h3>
                        <form className='text-sm flex flex-col gap-2 py-2'>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' onChange={handleOnChangeSortBy} value="" />
                                <label className='dark:text-white'>Sin ordenar</label>
                            </div>
                            <div className='flex items-center gap-3'>
                                {/* ojo: aca no se usa name porque en esta pagina no se guarda en base de datos o algo relacionado a base de datos, solo se usa el value, aunque name es importante para que el radio button funcione */}
                                <input type='radio' name='sortBy' onChange={handleOnChangeSortBy} value={"asc"}></input>
                                <label className='dark:text-white'>Price - Low to High</label>
                            </div>

                            <div className='flex items-center gap-3'>
                                {/* ojo: aca no se usa name porque en esta pagina no se guarda en base de datos o algo relacionado a base de datos, solo se usa el value, aunque name es importante para que el radio button funcione */}
                                <input type='radio' name='sortBy' onChange={handleOnChangeSortBy} value={"desc"}></input>
                                <label className='dark:text-white'>Price - High to Low</label>
                            </div>
                        </form>
                    </div>

                    {/* filter by */}
                    <div className=''>
                        <h3 className='text-base uppercase font-medium text-slate-500 dark:text-slate-200 border-b pb-1 border-slate-300'>Category </h3>
                        <div className='text-sm flex flex-col gap-2 py-2'>
                            {
                                categories.map((categoryName, index) => {
                                    return (
                                        <div className='flex items-center gap-3'>
                                            {/* aca se usa el value para el handleSelectCategory porque checkbox acepta varias , a diferncia de radio o select  */}
                                            <input type='checkbox' id={categoryName?.value} checked={selectCategory[categoryName?.value]} onChange={handleSelectCategory} value={categoryName?.value} ></input>
                                            <label className='capitalize dark:text-white' htmlFor={categoryName?.value}>{categoryName?.value}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                {/* right side(product) */}
                <div className='px-4'>
                    <p className='font-medium text-slate-800 dark:text-slate-100 text-lg my-2'>Search Results: {data.length}</p>
                    <div className='h-[calc(100vh-120px)] overflow-y-scroll'>
                        {
                            data.length !== 0 && (
                                <VerticalCard_SearchProduct data={data} loading={loading} />
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductsByCategoryFiltered
