//hooks de react
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

//helpers
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';

//react toastify
import { toast } from 'react-toastify';

//Context
import Context from '../context';

//redux
import { useSelector } from 'react-redux';

//Componentes
import CardProductNormalDisplay from '../components/CardProductNormalDisplay';
import ReviewForm from '../components/ReviewForm';
import StarRatingAverage from '../components/StarRatingAverage';
import ReviewsList from '../components/ReviewsList';

const ProductDetails = () => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        categoryId: {}, //no es string porque viene con populate como objeto ref
        productImage: [],
        productVideo: [],
        description: "",
        price: "",
        sellingPrice: ""
    })

    const params = useParams(); //http://localhost:3000/product/67b1305b0c5f020a8ee8783d , aca el params seria el id
    const [loading, setLoading] = useState(false); // loading del producto
    const productImageListLoading = new Array(4).fill(null);
    const [activeImage, setActiveImage] = useState(""); //imagen princiapl del producto
    const [hoveredImage, setHoveredImage] = useState(null); //cuando haces hover a la imagen
    const [hoveredVideo, setHoveredVideo] = useState(null); //cuando haces hover al video
    const [isVideo, setIsVideo] = useState(false); // para saber cuando se cambia a video y poner formato <video>


    //coordenadas cuando haces zoom a la imagen
    const [zoomImageCoordiante, setZoomImageCoordiante] = useState({
        x: 0,
        y: 0
    })

    const [zoomImage, setZoomImage] = useState(false); //para saber si hacer zoomImage o no
    const { fetchUserCountCartItems } = useContext(Context); //para contar la cantidad de items del carrito

    const navigate = useNavigate() //para navegar a otra ruta
    const user = useSelector(state => state.user.user); //se usa para boton "Buy"
    const [isOpen_CreateReview, setIsOpen_CreateReview] = useState(false); //para abrir reviewComponent
    const [isOpen_UpdateReview, setIsOpen_UpdateReview] = useState(false); //para abrir reviewComponent

    const [hasReviewed, setHasReviewed] = useState(false); //para saber si mostrar boton de crear o actualizar
    const [reviewData, setReviewData] = useState(null); //la data del review del usuario logueado del producto actual
    const [starRatingReview, setStarRatingReview] = useState(0); // rating general del producto (el promedio de todos los reviews

    const [showReviews, setShowReviews] = useState(false); // para mostrar el modal de los reviews del producto

    const [reviews, setReviews] = useState([]); //todos los reviews del producto
    const [loadingReviews, setLoadingReviews] = useState(false); //loading de todos los reviews

    //DEBUG////////////////////////////////////////////
    console.log("isVideo: ", isVideo);
    console.log("reviewData: ", reviewData);
    console.log("hasReviewed: ", hasReviewed);
    console.log("dataProduct detail: ", data);


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const checkUserReview = async () => {
            setHasReviewed(false); // <--- Reiniciar estado antes de hacer la petición
            setIsOpen_CreateReview(false);
            setIsOpen_UpdateReview(false);

            try {
                const url = `${SummaryApi.getProductReview.url}/${encodeURIComponent(params?.id)}`; //encodeURIComponent reeemplaza espacio por%20 ,etc
                const response = await fetch(url, {
                    method: SummaryApi.getProductReview.method,
                    credentials: 'include',
                    signal, //agregar AbortController
                })
                console.log("✅ Fetch completado, respuesta recibida:", response);

                const dataResponse = await response.json();
                console.log("dataResponse checkuserReview: ", dataResponse);
                if (dataResponse.success) {
                    if (dataResponse.data) {
                        setHasReviewed(true);
                        setReviewData(dataResponse.data);
                    }
                } else if (dataResponse.error) {
                    toast.error(dataResponse.message, {
                        position: "bottom-center",
                        autoClose: 2000
                    });
                }


            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("Solicitud abortada al cambiar params.");
                } else {
                    console.error("Error al obtener el review del producto del usuario logueado: ", error);

                }
            }
        };


        checkUserReview(); //Aca se ejecuta la funcion
        return () => controller.abort(); // ✅ Cancelar fetch anterior si `params` cambia

    }, [params])



    const fetchProductDetails = async () => {
        //esto es porque si el usuario deja activado el video, cuando navege a otro producto no se vera la imagen , porque se quedo en isVideo = true
        if (isVideo) {
            setIsVideo(false);
        }

        setLoading(true);
        try {
            const url = `${SummaryApi.productDetails.url}?productId=${encodeURIComponent(params?.id)}`;
            const response = await fetch(url, {
                method: SummaryApi.productDetails.method,
            })

            const dataResponse = await response.json();
            if (dataResponse.success) {
                setData(dataResponse?.data);
                setActiveImage(dataResponse?.data?.productImage[0])
            } else if (dataResponse.error) {
                toast.error(dataResponse.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
            console.log("data product Details: ", data);
        } catch (error) {
            console.log("error en Product details: ", error);
            toast.error("Error al cargar los detalles del producto", {
                position: "bottom-center",
                autoClose: 2000
            });
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchProductDetails();
    }, [params])


    const handleSubmitReview = async (reviewData) => {
        console.log("reviewData: ", reviewData);
        try {
            const response = await fetch(SummaryApi.createProductReview.url, {
                method: SummaryApi.createProductReview.method,
                headers: {
                    "content-type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ ...reviewData, productId: data._id }),
            });

            const dataResponse = await response.json();
            if (dataResponse?.success) {
                toast.success("Product Review submitted successfully!");
                setIsOpen_CreateReview(false); // Cerrar el modal
                setHasReviewed(true);
                setReviewData(dataResponse.data);
                fetchStarRatingAverage();
                handleFetchReviews();
            } else if (dataResponse?.error) {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            console.error("Error submitting review: ", error);
            toast.error("Failed to submit review.");
        }
    };

    const handleUpdateReview = async (reviewData) => {
        console.log("reviewData Update: ", reviewData._id);
        try {
            const response = await fetch(SummaryApi.updateReview.url, {
                method: SummaryApi.updateReview.method,
                headers: {
                    "content-type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ ...reviewData, reviewId: reviewData._id }),
            });

            const dataResponse = await response.json();
            if (dataResponse?.success) {
                toast.success("Product Review updated successfully!");
                setIsOpen_UpdateReview(false); // Cerrar el modal
                setReviewData(dataResponse.data);
                fetchStarRatingAverage();
                handleFetchReviews();
            } else if (dataResponse?.error) {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            console.error("Error submitting review: ", error);
            toast.error("Failed to submit review.");
        }
    };

    const fetchStarRatingAverage = async () => {
        try {
            const url = `${SummaryApi.getProductReviewAverage.url}/${encodeURIComponent(params?.id)}`;
            const response = await fetch(url, {
                method: SummaryApi.getProductReviewAverage.method,
            })
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setStarRatingReview(dataResponse?.data);
            } else if (dataResponse.error) {
                toast.error(dataResponse.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
            console.log("data star rating average: ", data);
        } catch (error) {
            console.log("error en Star Rating Review: ", error);
            toast.error("Error al cargar el star rating average", {
                position: "bottom-center",
                autoClose: 2000
            });
        }
    }

    useEffect(() => {
        fetchStarRatingAverage();
    }, [params])


    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(SummaryApi.deleteReview.url, {
                method: SummaryApi.deleteReview.method,
                headers: {
                    "content-type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ reviewId }),
            });
            console.log(response);
            const dataResponse = await response.json();
            if (dataResponse?.success) {
                toast.success("Product Deleted successfully!");
                setReviewData(null);
                fetchStarRatingAverage();
                setHasReviewed(false);
                setIsOpen_UpdateReview(false); // Cerrar el modal
                handleFetchReviews();

            } else if (dataResponse?.error) {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            console.error("Error deleting review: ", error);
            toast.error("Failed to delete review.");
        }
    };
    const handleFetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const url = `${SummaryApi.getProductReviews.url}/${encodeURIComponent(params?.id)}`;
            console.log("url: ", url);
            const response = await fetch(url, {
                method: SummaryApi.getProductReviews.method,
            })

            const dataResponse = await response.json();
            if (dataResponse.success) {
                setReviews(dataResponse?.data); // reviews del producto
                setShowReviews(true); // mostrar los reviews
            } else if (dataResponse.error) {
                toast.error(dataResponse.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
            console.log("reviews handleFetchReviews: ", reviews);
        } catch (error) {
            console.log("error en getProductReviews: ", error);
            toast.error("Error al cargar getProductReviews", {
                position: "bottom-center",
                autoClose: 2000
            });
        } finally {
            setLoadingReviews(false);
        }
    }




    const handleMouseEnterProduct = (imageURL) => {
        setActiveImage(imageURL)
    }


    useEffect(() => {
        let timer; // Declaramos una variable para almacenar el temporizador
        if (hoveredImage) {
            // Si hay una imagen en "hoveredImage", iniciamos un temporizador de 500ms
            timer = setTimeout(() => {
                setActiveImage(hoveredImage);
                setIsVideo(false);
            }, 500);
        }
        return () => clearTimeout(timer);
        // Esta función de limpieza se ejecuta cuando:
        // 1. Se desmonta el componente.
        // 2. hoveredImage cambia antes de que pasen los 500ms.
        // En ambos casos, se limpia el temporizador para evitar que la imagen cambie si el usuario movió rápido el mouse.
    }, [hoveredImage]);  // Este efecto se ejecuta cada vez que cambia "hoveredImage"

    useEffect(() => {
        let timer; // Declaramos una variable para almacenar el temporizador
        if (hoveredVideo) {
            // Si hay una imagen en "hoveredImage", iniciamos un temporizador de 500ms
            timer = setTimeout(() => {
                setActiveImage(hoveredVideo);
                setIsVideo(true);
            }, 500);

        }
        return () => clearTimeout(timer);
        // Esta función de limpieza se ejecuta cuando:
        // 1. Se desmonta el componente.
        // 2. hoveredImage cambia antes de que pasen los 500ms.
        // En ambos casos, se limpia el temporizador para evitar que la imagen cambie si el usuario movió rápido el mouse.
    }, [hoveredVideo]);  // Este efecto se ejecuta cada vez que cambia "hoveredImage"


    // Calcular el porcentaje de descuento
    const discountPercentage = data?.price && data?.sellingPrice
        ? Math.round((1 - data.sellingPrice / data.price) * 100)
        : 0;

    //Zoom iamge
    const handleZoomImage = (e) => {
        setZoomImage(true);
        // Obtener las coordenadas del elemento en la pantalla
        const { left, top, width, height } = e.target.getBoundingClientRect();

        // Calcular la posición relativa del mouse dentro del elemento
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        // Actualizar el estado con las coordenadas normalizadas (de 0 a 1)
        setZoomImageCoordiante({
            x: x,
            y: y
        })

    } // Dependencia: solo se recrea cuando `zoomImageCoordinate` cambia


    const handleLeaveImageZoom = () => {
        setZoomImage(false)
    }


    const handleAddToCart = async (e, id) => {
        const success = await addToCart(e, id) // Guarda si fue exitoso
        if (success) {
            fetchUserCountCartItems(); // Solo se ejecuta si addToCart fue exitoso
        }
    }

    const handleBuyProduct = async (e, id) => {
        const success = await addToCart(e, id) // Guarda si fue exitoso
        if (success) {
            fetchUserCountCartItems(); // Solo se ejecuta si addToCart fue exitoso
        }
        if (user?._id)
            navigate("/cart")
        else {
            navigate("/login");
        }
    }




    return (
        <div className='mx-auto p-4'>
            <div className=' min-h-[200px] flex flex-col lg:flex-row gap-4'>
                {/* Product iamge */}
                <div className='max-h-96 flex flex-col lg:flex-row-reverse gap-4'>
                    <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 dark:bg-slate-600 relative p-1'>
                        {
                            isVideo ? (
                                <video playsInline disablePictureInPicture controls src={activeImage} className='h-full w-full' />
                            ) : (
                                <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply dark:mix-blend-normal' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom} />
                            )
                        }

                        {/* Product zoom */}
                        {zoomImage && (
                            <div className="z-20 hidden lg:block absolute w-[500px] h-[500px] overflow-hidden bg-slate-200 dark:bg-slate-600 p-1 -right-[520px] top-0">
                                <div
                                    className="w-[1000px] h-[1000px]" // Aumentamos el tamaño para simular el zoom
                                    style={{
                                        transform: `translate(-${zoomImageCoordiante.x * 500}px, -${zoomImageCoordiante.y * 500}px)`,
                                        transition: "transform 0.1s ease-out",
                                    }}
                                >
                                    <img
                                        src={activeImage}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}



                    </div>
                    <div className='h-full'>
                        {
                            loading ? (
                                <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                                    {
                                        productImageListLoading.map((el, index) => {
                                            return (
                                                <div className='h-20 w-20 bg-slate-200 dark:bg-slate-600 rounded animate-pulse' key={"Loading image" + index}>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                                    {
                                        data?.productImage?.map((imgURL, index) => {
                                            return (
                                                <div className='h-20 w-20 bg-slate-200 dark:bg-slate-600 rounded p-1' key={index}>
                                                    <img src={imgURL}
                                                        onMouseEnter={() => setHoveredImage(imgURL)}
                                                        onMouseLeave={() => setHoveredImage(null)} //importante para que si haces hover muy rapido ,la imagen no se cambie
                                                        onClick={() => { handleMouseEnterProduct(imgURL); setIsVideo(false) }}
                                                        className='w-full h-full object-scale-down mix-blend-multiply dark:mix-blend-normal cursor-pointer'
                                                        alt='Miniatura'
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        data?.productVideo?.map((videoURL, index) => {
                                            return (
                                                <div className='h-20 w-20 bg-slate-200 dark:bg-slate-600 rounded p-1' key={index}>
                                                    <video src={videoURL}
                                                        onMouseEnter={() => setHoveredVideo(videoURL)}
                                                        onMouseLeave={() => setHoveredVideo(null)} //importante para que si haces hover muy rapido ,el video no cambie
                                                        onClick={() => {
                                                            handleMouseEnterProduct(videoURL); setIsVideo(true);
                                                        }}
                                                        className='w-full h-full object-scale-down aspect-square mix-blend-multiply dark:mix-blend-normal cursor-pointer'
                                                        alt='Miniatura video'
                                                        disablePictureInPicture // Evita el botón de "ver en grande"


                                                    />
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            )
                        }
                    </div>
                </div>
                {/* Product details */}
                {
                    loading ? (
                        <div className='grid gap-1 w-full'>
                            <p className='bg-slate-200 dark:bg-slate-600 animate-pulse h-6 lg:h-8 rounded-full py-2 w-full'></p>
                            <h2 className='h-6 lg:h-8 bg-slate-200 dark:bg-slate-600 animate-pulse w-full'></h2>
                            <p className='capitalize text-slate-400 bg-slate-200 dark:bg-slate-600 animate-pulse h-6 lg:h-8 w-full'></p>
                            <div className=' bg-slate-200 dark:bg-slate-600 -6 lg:h-8 animate-pulse gap-1 w-full'>
                            </div>

                            <div className='flex items-center gap-4 text-3xl font-medium h-6 lg:h-8 animate-pulse w-full'>
                                <p className='bg-slate-200 dark:bg-slate-600 w-full h-6 lg:h-8'></p>
                                <p className='bg-slate-200 dark:bg-slate-600 w-full h-6 lg:h-8'></p>
                            </div>

                            <div className='flex items-center w-full'>
                                <button className='h-6 lg:h-8 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-full'></button>
                                <button className='h-6 lg:h-8 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-full'></button>
                            </div>

                            <div className='w-full'>
                                <p className='my-1 h-6 lg:h-8 bg-slate-200 dark:bg-slate-600 rounded animate-pulse'></p>
                            </div>

                        </div>
                    ) : (
                        <div className='flex flex-col gap-1 w-full mt-4'>

                            <p className='bg-red-200 text-red-600 px-2 rounded-full w-fit'>{data?.brandName}</p>
                            <h2 className='text-2xl lg:text-4xl font-medium text-slate-400  '>{data?.productName}</h2>
                            <p className='capitalize text-slate-400 dark:text-slate-100'>{data?.categoryId.value}</p>
                            <div className='flex gap-3 text-yellow-600 text-lg items-center'>

                                <div className='flex gap-2 items-center mb-4'>
                                    <StarRatingAverage rating={starRatingReview} />
                                    <p className='font-bold'>{starRatingReview}</p>
                                </div>


                                {/* Mostrar el botón para msotrar todos los reviews del producto */}
                                <button
                                    onClick={() => { handleFetchReviews() }}
                                    disabled={loadingReviews}
                                    className="mb-4 px-6 py-2 text-white bg-slate-400 dark:bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition"
                                >
                                    {loadingReviews ? "Loading..." : "Mostrar Reviews"}
                                </button>


                                {showReviews && (
                                    <div className=" z-30 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                                        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg max-w-2xl w-full">
                                            <button
                                                onClick={() => setShowReviews(false)}
                                                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
                                            >
                                                ❌
                                            </button>
                                            <ReviewsList reviews={reviews} />
                                        </div>
                                    </div>
                                )}
                            </div >


                            <div className='flex items-center gap-2 text-3xl font-medium my-1'>
                                <p className='text-red-600'> {displayINRCurrency(data?.sellingPrice)}</p>
                                <p className='text-slate-400 line-through'> {displayINRCurrency(data?.price)}</p>
                                {discountPercentage > 0 && (
                                    <p className='text-green-600 text-lg'>-{discountPercentage}% OFF</p>
                                )}
                            </div>

                            <div className='flex items-center gap-3 my-2'>
                                <button
                                    className='border-2 border-red-600 rounded px-3 py-1 min-w-[100px] text-red-600 font-medium dark:font-bold hover:bg-red-600 hover:text-white'
                                    onClick={(e) => handleBuyProduct(e, data?._id)}>
                                    Buy
                                </button>
                                <button
                                    className='border-2 border-red-600 rounded px-3 py-1 min-w-[100px] font-medium text-white bg-red-600 hover:text-red-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-400'
                                    onClick={(e) => handleAddToCart(e, data?._id)}
                                >
                                    Add to Cart
                                </button>
                            </div>

                            <div>
                                {user?._id && (
                                    <>
                                        {!hasReviewed && (
                                            <button
                                                className='border-2 border-red-600 rounded px-3 py-1 w-[225px] font-medium text-slate-500 dark:text-slate-300 hover:text-red-600 bg-slate-300 dark:bg-slate-500 dark:hover:text-white hover:bg-white dark:hover:bg-slate-400'
                                                onClick={() => setIsOpen_CreateReview(true)}
                                            >
                                                Make a review
                                            </button>
                                        )}

                                        {hasReviewed && (
                                            <div className='flex gap-2'>
                                                <button
                                                    className='border-2 border-red-600 rounded px-3 py-1 w-[225px] font-medium text-slate-500 dark:text-slate-300 hover:text-red-600 bg-slate-300 dark:bg-slate-500 dark:hover:text-white hover:bg-white dark:hover:bg-slate-400'
                                                    onClick={() => setIsOpen_UpdateReview(true)}
                                                >
                                                    Update your review
                                                </button>
                                                <button
                                                    className='border-2 border-red-600 rounded px-3 py-1 w-[225px] font-medium text-slate-100 hover:text-red-600 bg-red-500 dark:hover:text-white hover:bg-white dark:hover:bg-red-600'
                                                    onClick={() => handleDeleteReview(reviewData._id)}
                                                >
                                                    Delete your review
                                                </button>
                                            </div>


                                        )}
                                    </>
                                )}

                                {isOpen_CreateReview && (
                                    <ReviewForm onSubmit={handleSubmitReview} isClose={() => setIsOpen_CreateReview(false)} />
                                )}

                                {isOpen_UpdateReview && (
                                    <ReviewForm onSubmit={handleUpdateReview} reviewdata={reviewData} isClose={() => setIsOpen_UpdateReview(false)} />
                                )}
                            </div>




                            <div>
                                <p className='text-slate-600 dark:text-slate-300 font-medium my-1'>Description: </p>
                                <p className='text-justify dark:text-slate-100'>{data?.description}</p>
                            </div>

                        </div>
                    )
                }
            </div>

            {
                data?._id && (
                    <CardProductNormalDisplay category={data?.categoryId?.value} heading={data?.categoryId?.value} />
                )
            }
        </div>
    )
}

export default ProductDetails
