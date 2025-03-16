import React, { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaImages } from "react-icons/fa";
import app from "../firebase.js";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import DisplayImage from "./DisplayImage.js";
import useLoading from "../hooks/useLoading.js";
//import productCategory from "../helpers/productCategory"; //antes se usaba esto pero ahora esto esta en la base de datos
import checkImageConstraints from "../helpers/checkImageContraints.js";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import fetchCategories from "../helpers/productCategory.js";

const MAX_IMAGES = 6; // Maximum images allowed
const MAX_VIDEOS = 2; // Maximum videos allowed
const MAX_SIZE_MB = 150.5; // Máximo tamaño en MB (puedes ajustarlo)

// Ejemplo de extensiones de video que aceptaremos
// (puede que quieras verificar MIME type o la extensión .mp4)
const VIDEO_MIME_TYPES = ["video/mp4"];

const UploadProduct = ({ onClose, fecthData }) => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        categoryId: "",
        productImage: [],
        productVideo: [], // <-- Arreglo para almacenar videos
        description: "",
        price: "",
        sellingPrice: "",
    });

    const [errors, setErrors] = useState({
        productName: "",
        brandName: "",
        categoryId: "",
        productImage: [],
        productVideo: [], // <-- Arreglo para almacenar videos
        description: "",
        price: "",
        sellingPrice: "",
    });

    const { loading, setLoading, dots } = useLoading();


    // Keep track of images/videos in the process of uploading
    const [uploadingFiles, setUploadingFiles] = useState([]);

    const [fullScreenImage, setfullScreenImage] = useState("");
    const [openFullScreenImage, setopenFullScreenImage] = useState(false);

    // Create refs to the file inputs (una para imágenes, otra para videos)
    const fileInputRefImages = useRef(null);
    const fileInputRefVideos = useRef(null);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
        }
        loadCategories();
    }, []);


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Eliminar imagen subida
    const handleRemoveUploadedImage = (imageUrl) => {
        setData((prev) => ({
            ...prev,
            productImage: prev.productImage.filter((url) => url !== imageUrl),
        }));
    };

    // Eliminar video subido
    const handleRemoveUploadedVideo = (videoUrl) => {
        setData((prev) => ({
            ...prev,
            productVideo: prev.productVideo.filter((url) => url !== videoUrl),
        }));
    };

    // Cancelar subida en proceso (ya sea imagen o video)
    const handleRemoveUploadingFile = (fileId) => {
        setUploadingFiles((prev) => {
            const found = prev.find((f) => f.id === fileId);
            if (found && found.uploadTask) {
                found.uploadTask.cancel();
            }
            return prev.filter((f) => f.id !== fileId);
        });
    };

    // Lógica común para subir un archivo a Firebase
    // (usada tanto para imagen como para video
    const uploadSingleFile = async (file, isVideo = false) => {
        if (isVideo) {

        } else {
            const isValid = await checkImageConstraints(file);
            if (!isValid) {
                alert(`La imagen ${file.name} no cumple los requisitos (cuadrada, resolución). Se omitirá.`);
                return; // No subimos esta imagen
            }

        }

        // 2. Verificar tamaño
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_SIZE_MB) {
            alert(
                `El archivo "${file.name}" supera los ${MAX_SIZE_MB} MB permitidos.`
            );
            return;
        }

        // 3. Para videos, chequear MIME type (opcional)
        if (isVideo) {
            // Por ejemplo, aceptar solo .mp4
            if (!VIDEO_MIME_TYPES.includes(file.type)) {
                alert(
                    `El archivo "${file.name}" no es MP4. Solo se permiten: ${VIDEO_MIME_TYPES.join(
                        ", "
                    )}`
                );
                return;
            }
        }

        // 4. Creamos URL local de preview (para mostrar mientras sube)
        const localPreviewUrl = URL.createObjectURL(file);

        // 5. Preparamos subida a Firebase
        const uploadingId = Date.now() + Math.random();
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name; // Nombre único
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // 6. Agregamos al estado 'uploadingFiles'
        setUploadingFiles((prev) => [
            ...prev,
            {
                id: uploadingId,
                previewUrl: localPreviewUrl,
                progress: 0,
                isVideo,
                uploadTask,
            },
        ]);

        // 7. Escuchar el progreso
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progressVal =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadingFiles((prev) =>
                    prev.map((f) =>
                        f.id === uploadingId ? { ...f, progress: progressVal } : f
                    )
                );
            },
            (error) => {
                if (error.name === "CanceledError") {
                    console.log("Upload canceled by user");
                } else {
                    console.log("Error uploading file:", error);
                }
                setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingId));
            },
            () => {
                // On complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("Uploaded file URL:", downloadURL);

                    // Dependiendo si es video o imagen, guardamos en el array correspondiente
                    if (isVideo) {
                        setData((prev) => ({
                            ...prev,
                            productVideo: [...prev.productVideo, downloadURL],
                        }));
                    } else {
                        setData((prev) => ({
                            ...prev,
                            productImage: [...prev.productImage, downloadURL],
                        }));
                    }

                    // Quitamos del uploading
                    setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingId));
                });
            }
        );
    };

    // Manejar selección de imágenes (múltiples)
    const handleUploadImages = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        let filesArray = Array.from(e.target.files);

        // Calcular cuántas imágenes ya tenemos cargadas
        const totalAlreadyHave = data.productImage.length + uploadingFiles.filter((f) => !f.isVideo).length;

        // Calcular cuántas más podemos aceptar
        const remainingSlots = MAX_IMAGES - totalAlreadyHave;

        // Si el usuario seleccionó más imágenes de las que podemos aceptar, las recortamos
        if (filesArray.length > remainingSlots) {
            alert(`Solo puedes subir ${remainingSlots} imagen(es) más.`);
            filesArray = filesArray.slice(0, remainingSlots);  // Recorta los archivos seleccionados
        }

        // Subir los archivos (después de recortar si es necesario)
        for (const file of filesArray) {
            uploadSingleFile(file, false /* isVideo = false*/);
        }

        // Limpiamos el input
        if (fileInputRefImages.current) {
            fileInputRefImages.current.value = "";
        }
    };

    // Manejar selección de videos (múltiples)
    const handleUploadVideos = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        let filesArray = Array.from(e.target.files);

        // Calcular cuántas videos ya tenemos cargadas
        const totalAlreadyHave = data.productVideo.length + uploadingFiles.filter((f) => f.isVideo).length;

        // Calcular cuántas más podemos aceptar
        const remainingSlots = MAX_VIDEOS - totalAlreadyHave;

        // Si el usuario seleccionó más videos de los que podemos aceptar, los recortamos
        if (filesArray.length > remainingSlots) {
            alert(`Solo puedes subir ${remainingSlots} video(s) más.`);
            filesArray = filesArray.slice(0, remainingSlots);  // Recorta los archivos seleccionados
        }

        for (const file of filesArray) {
            uploadSingleFile(file, true /* isVideo = true*/);
        }

        // Limpiamos el input
        if (fileInputRefVideos.current) {
            fileInputRefVideos.current.value = "";
        }
    };

    console.log("UploadProductData: ", data);


    const validateForm = () => {
        let valid = true;
        let newErrors = {
            productName: "",
            brandName: "",
            categoryId: "",
            productImage: [],   // <-- Usamos string o array para guardar msg de error
            productVideo: [],   // <-- Mismo caso para videos
            description: "",
            price: "",
            sellingPrice: "",
        };

        // Validación de Product Name
        if (!data.productName) {
            newErrors.productName = "Product Name is required.";
            valid = false;
        }

        // Validación de Brand Name
        if (!data.brandName) {
            newErrors.brandName = "Brand Name is required.";
            valid = false;
        }

        // Validación de Category
        if (!data.categoryId) {
            newErrors.categoryId = "Category is required.";
            valid = false;
        }

        // Validación de Imágenes (mínimo 3)
        // data.productImage debería ser un array con las URLs o archivos de imagen
        if (!Array.isArray(data.productImage) || data.productImage.length < 3) {
            newErrors.productImage = "You must upload at least 3 images.";
            valid = false;
        }

        // Validación de Videos (mínimo 2)
        // data.productVideo debería ser un array con las URLs o archivos de video
        if (!Array.isArray(data.productVideo) || data.productVideo.length < 2) {
            newErrors.productVideo = "You must upload at least 2 videos.";
            valid = false;
        }

        // Validación de Description
        if (!data.description) {
            newErrors.description = "Description is required.";
            valid = false;
        }

        // Validación de Price
        if (!data.price) {
            newErrors.price = "Price is required.";
            valid = false;
        } else if (isNaN(data.price)) {
            newErrors.price = "Price must be a valid number.";
            valid = false;
        } else if (data.price > 1000) {
            newErrors.price = "Price must not exceed S/.1000.";
            valid = false;
        } else if (data.price < 0) {
            newErrors.price = "Price must not be under S/.0.";
            valid = false;
        }

        // Validación de Selling Price
        if (!data.sellingPrice) {
            newErrors.sellingPrice = "Selling Price is required.";
            valid = false;
        } else if (isNaN(data.sellingPrice)) {
            newErrors.sellingPrice = "Selling Price must be a valid number.";
            valid = false;
        } else if (data.sellingPrice > 1000) {
            newErrors.sellingPrice = "sellingPrice must not exceed S/.1000.";
            valid = false;
        } else if (data.sellingPrice < 0) {
            newErrors.sellingPrice = "selingPrice must not be under S/.0.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("NO submiting");
            return; // Si la validación falla, no enviamos el formulario
        }

        // Verificamos si ya está procesando otra solicitud
        //esto no es necesario porque button se desabilita cunado se esta enviando el Login pero porsiacaso
        if (loading) return;

        console.log("submiting product...");

        try {
            setLoading(true);
            const response = await fetch(SummaryApi.uploadProduct.url, {
                method: SummaryApi.uploadProduct.method,
                credentials: 'include', // por las cokkies(autenticacion)
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (responseData?.success) {
                toast.success(responseData?.message, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light" //tambien hay "dark"
                });
                onClose();
                fecthData();
            }

            if (responseData?.error) {
                toast.error(responseData?.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
                if (responseData.errors)
                    setErrors(responseData.errors);
            }

        } catch (error) {
            toast.error("Something is wrong. try later");
            console.log("error uploadProduct: ", error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="fixed w-full h-full bg-slate-200 bg-opacity-90 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-full max-w-2xl max-h-[90%] h-full">
                <div className="flex justify-between mx-3 items-center mb-6">
                    <h2 className="font-bold text-lg">Upload Product</h2>
                    <div
                        className="w-fit ml-auto text-3xl font-bold cursor-pointer hover:text-red-600 transition-colors"
                        onClick={onClose}
                    >
                        <IoCloseCircleOutline />
                    </div>
                </div>

                <form className="grid p-4 gap-2 overflow-y-scroll h-[92%]" onSubmit={handleSubmit}>
                    {/* Campos de texto */}
                    <label className="mt-3" htmlFor="productName">
                        Product Name :
                    </label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        placeholder="Enter product name"
                        value={data.productName}
                        onChange={handleOnChange}
                        className="p-2 bg-slate-100 border rounded-lg"
                    />
                    {errors?.productName && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.productName}</p>}


                    <label className="mt-3" htmlFor="brandName">
                        Brand Name :
                    </label>
                    <input
                        type="text"
                        id="brandName"
                        name="brandName"
                        placeholder="Enter Brand name"
                        value={data.brandName}
                        onChange={handleOnChange}
                        className="p-2 bg-slate-100 border rounded-lg"
                    />
                    {errors?.brandName && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.brandName}</p>}


                    <label className="mt-3" htmlFor="category">
                        Category :
                    </label>
                    <select
                        className="p-2 bg-slate-100 border rounded-lg appearance-none pr-6 capitalize"
                        // required
                        value={data.categoryId}
                        id="category"
                        name="categoryId"
                        onChange={handleOnChange}
                    >
                        <option value="" disabled>
                            No seleccionado
                        </option>
                        {categories?.map((el, i) => (
                            <option value={el._id} key={i} className="capitalize">
                                {el.value}
                            </option>
                        ))}
                    </select>
                    {errors?.categoryId && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.categoryId}</p>}


                    {/* Subir imágenes */}
                    <label className="mt-3">Upload Images:</label>
                    <label htmlFor="uploadImageInput">
                        <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                            <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                                <span className="text-4xl">
                                    <FaImages />
                                </span>
                                <p className="text-sm">Choose up to {MAX_IMAGES} images</p>
                                <input
                                    type="file"
                                    id="uploadImageInput"
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleUploadImages}
                                    ref={fileInputRefImages}
                                />
                            </div>
                        </div>
                    </label>
                    {errors?.productImage && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.productImage}</p>}


                    {/* Subir videos */}
                    <label className="mt-3">Upload Videos (MP4, max {MAX_VIDEOS}):</label>
                    <label htmlFor="uploadVideoInput">
                        <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                            <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                                <span className="text-4xl">🎥</span>
                                <p className="text-sm">Choose up to {MAX_VIDEOS} videos (MP4)</p>
                                <input
                                    type="file"
                                    id="uploadVideoInput"
                                    className="hidden"
                                    multiple
                                    accept="video/mp4"
                                    onChange={handleUploadVideos}
                                    ref={fileInputRefVideos}
                                />
                            </div>
                        </div>
                    </label>
                    {errors?.productVideo && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.productVideo}</p>}


                    {/* 1. Show uploading files (images/videos) with black background + progress */}
                    {uploadingFiles.length > 0 && (
                        <div className="mt-6">
                            <h3 className="mb-3 text-lg font-semibold text-slate-700">
                                Files Uploading...
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {uploadingFiles.map((fileObj) => (
                                    <div
                                        key={fileObj.id}
                                        className="relative w-full rounded-2xl aspect-square bg-black flex items-center justify-center text-white"
                                    >
                                        {/* Preview (puede ser imagen o video). Aquí, video no se reproducirá,
                        pero mostramos un fondo oscuro con 'Video' si quieres algo distinto. */}
                                        {fileObj.isVideo ? (
                                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 rounded-2xl">
                                                <p className="text-sm">Video uploading...</p>
                                            </div>
                                        ) : (
                                            <img
                                                src={fileObj.previewUrl}
                                                alt="preview"
                                                className="absolute top-0 left-0 w-full h-full object-cover opacity-70 rounded-2xl"
                                            />
                                        )}
                                        {/* Progreso en el centro */}
                                        <div className="absolute">
                                            <p>{Math.round(fileObj.progress) + "%"}</p>
                                        </div>
                                        {/* Botón "X" para cancelar subida */}
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xl font-bold"
                                            onClick={() => handleRemoveUploadingFile(fileObj.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. Show the images that have finished uploading */}
                    <div className="mt-6">
                        <h3 className="mb-3 text-lg font-semibold text-slate-700">
                            Your Selected Images
                        </h3>
                        {data.productImage && data.productImage.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {data.productImage.map((url, index) => (
                                    <div
                                        key={index}
                                        className="
                      group
                      bg-white
                      border
                      
                      shadow-sm
                      overflow-hidden
                      hover:shadow-md
                      transition-shadow
                      duration-200
                      relative
                      rounded-2xl
                    "
                                    >
                                        <img
                                            src={url}
                                            alt={`product-image-${index}`}
                                            className="
                        w-full
                        aspect-square
                        object-cover
                        bg-slate-100
                        cursor-pointer
                        group-hover:scale-105
                        transition-transform
                        duration-200
                      "
                                            onDoubleClick={() => {
                                                setopenFullScreenImage(true);
                                                setfullScreenImage(url);
                                            }}
                                        />
                                        {/* Botón "X" para eliminar imagen ya subida */}
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xl font-bold"
                                            onClick={() => handleRemoveUploadedImage(url)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-red-600">No images uploaded yet.</p>
                        )}
                    </div>

                    {/* 3. Show the videos that have finished uploading */}
                    <div className="mt-6">
                        <h3 className="mb-3 text-lg font-semibold text-slate-700">
                            Your Selected Videos
                        </h3>
                        {data.productVideo && data.productVideo.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.productVideo.map((url, index) => (
                                    <div
                                        key={index}
                                        className="
                      group
                      bg-white
                      border
                      rounded-2xl
                      shadow-sm
                      overflow-hidden
                      hover:shadow-md
                      transition-shadow
                      duration-200
                      relative
                    "
                                    >
                                        {/* Ejemplo: mostrar un <video> con controls */}
                                        <video
                                            src={url}
                                            className="w-full aspect-video"
                                            controls
                                        />
                                        {/* Botón "X" para eliminar video ya subido */}
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xl font-bold"
                                            onClick={() => handleRemoveUploadedVideo(url)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-red-600">No videos uploaded yet.</p>
                        )}
                    </div>

                    <label htmlFor='price' className='mt-3'>Price :</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            S/.
                        </span>
                        <input
                            type='number'
                            id='price'
                            placeholder='enter price'
                            value={data.price}
                            name='price'
                            onChange={handleOnChange}
                            className='pl-8 p-2 bg-slate-100 border rounded w-full'
                            // required
                            step={1}
                        />
                    </div>
                    {errors?.price && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.price}</p>}


                    <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
                    <input
                        type='number'
                        id='sellingPrice'
                        placeholder='enter selling price'
                        value={data.sellingPrice}
                        name='sellingPrice'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        step={1}
                    // required
                    />
                    {errors?.sellingPrice && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.sellingPrice}</p>}


                    <label htmlFor='description' className='mt-3'>Description :</label>
                    <textarea
                        className='h-28 bg-slate-100 border resize-none p-1'
                        placeholder='enter product description'
                        rows={3}
                        onChange={handleOnChange}
                        name='description'
                        value={data.description}
                    >
                    </textarea>
                    {errors?.description && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors?.description}</p>}



                    <button
                        // type="" //por deafult type es submit en form
                        disabled={uploadingFiles.length > 0 || loading}
                        className={`
              mt-6 px-3 py-2 mb-10 text-white
              ${uploadingFiles.length > 0
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }
            `}
                    >
                        {
                            loading ? (
                                <span className="flex justify-center items-center">
                                    <p>Processing</p>
                                    <p className='ml-[2px] animate-pulse'>{dots}</p>
                                </span>

                            ) : ("Upload Product")
                        }
                    </button>
                </form>
            </div>

            {/* Display image full screen */}
            {openFullScreenImage && (
                <DisplayImage
                    onClose={() => setopenFullScreenImage(false)}
                    imgUrl={fullScreenImage}
                />
            )}
        </div>
    );
};

export default UploadProduct;
