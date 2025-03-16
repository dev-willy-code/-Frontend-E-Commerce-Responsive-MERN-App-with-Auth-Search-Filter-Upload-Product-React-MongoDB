
import React, { useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import productCategory from "../helpers/productCategory";
import { FaImages } from "react-icons/fa";
import app from "../firebase.js";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import DisplayImage from "./DisplayImage.js";

const MAX_IMAGES = 6; // Maximum images allowed

const UploadProduct = ({ onClose }) => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        selling: "",
    });

    // Keep track of images in the process of uploading
    const [uploadingImages, setUploadingImages] = useState([]);

    //
    const [fullScreenImage, setfullScreenImage] = useState("");

    //
    const [openFullScreenImage, setopenFullScreenImage] = useState(false);

    // Create a ref to the file input
    const fileInputRef = useRef(null);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRemoveUploadedImage = (imageUrl) => {
        // Filtra la imagen que se desea eliminar
        setData((prev) => ({
            ...prev,
            productImage: prev.productImage.filter((url) => url !== imageUrl),
        }));
    };

    const handleRemoveUploadingImage = (imageId) => {
        // Busca la imagen en uploadingImages para cancelar la subida si es posible
        setUploadingImages((prev) => {
            const found = prev.find((imgObj) => imgObj.id === imageId);
            if (found && found.uploadTask) {
                // Cancela la subida
                found.uploadTask.cancel();
            }
            // Retorna el resto, excluyendo la imagen a eliminar
            return prev.filter((imgObj) => imgObj.id !== imageId);
        });
    };

    const handleUploadProduct = async (e) => {
        // Máximo 15.5 Mb
        const MAX_SIZE_MB = 15.5;

        if (!e.target.files || e.target.files.length === 0) return;
        let fileArray = Array.from(e.target.files);

        // Averigua cuántas imágenes ya tenemos (subidas + en subida)
        const totalAlreadyHave = data.productImage.length + uploadingImages.length;

        // Si ya tenemos 6, no aceptamos más
        if (totalAlreadyHave >= MAX_IMAGES) {
            alert(`Ya tienes ${MAX_IMAGES} imágenes. No puedes subir más.`);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        // Calcula cuántas más podemos aceptar
        const remainingSlots = MAX_IMAGES - totalAlreadyHave;

        // Si el usuario seleccionó más de las que podemos aceptar, recortamos
        if (fileArray.length > remainingSlots) {
            alert(`Solo puedes subir ${remainingSlots} imagen(es) más.`);
            fileArray = fileArray.slice(0, remainingSlots);
        }

        // Recorremos cada archivo y lo subimos
        for (const file of fileArray) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > MAX_SIZE_MB) {
                alert(`El archivo supera los ${MAX_SIZE_MB} MB permitidos`);
                continue; // Omitimos este archivo
            }

            // 1) Crea una URL local de vista previa
            const localPreviewUrl = URL.createObjectURL(file);

            // 2) Crea un ID único
            const uploadingId = Date.now() + Math.random();

            // 3) Prepara la subida a Firebase
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // 4) Agrega el nuevo objeto a uploadingImages
            setUploadingImages((prev) => [
                ...prev,
                {
                    id: uploadingId,
                    previewUrl: localPreviewUrl,
                    progress: 0,
                    uploadTask, // Guardamos la referencia para poder cancelarla
                },
            ]);

            // 5) Escucha el progreso de la subida
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progressVal =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    // Actualiza el progreso en el state
                    setUploadingImages((prev) =>
                        prev.map((uploadObj) =>
                            uploadObj.id === uploadingId
                                ? { ...uploadObj, progress: progressVal }
                                : uploadObj
                        )
                    );
                },
                (error) => {
                    if (error.name === "CanceledError") {
                        console.log("Upload canceled by user");
                    } else {
                        console.log("Error uploading file:", error);
                    }
                    // Si se cancela o hay error, quitar del array
                    setUploadingImages((prev) =>
                        prev.filter((uploadObj) => uploadObj.id !== uploadingId)
                    );
                },
                () => {
                    // On complete, obtenemos la URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log("Uploaded file URL:", downloadURL);
                        setData((prev) => ({
                            ...prev,
                            productImage: [...prev.productImage, downloadURL],
                        }));

                        // Eliminamos de uploadingImages
                        setUploadingImages((prev) =>
                            prev.filter((uploadObj) => uploadObj.id !== uploadingId)
                        );
                    });
                }
            );
        }

        // Al final, limpiamos el input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    console.log("UploadProductData: ", data);

    return (
        <div className="fixed w-full h-full bg-slate-200 bg-opacity-90 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-full max-w-2xl max-h-[90%] h-full">
                <div className="flex justify-between mx-3 items-center mb-6">
                    <h2 className="font-bold text-lg ">Upload Product</h2>
                    <div
                        className="w-fit ml-auto text-3xl font-bold cursor-pointer hover:text-red-600 transition-colors"
                        onClick={onClose}
                    >
                        <IoCloseCircleOutline />
                    </div>
                </div>

                <form className="grid p-4 gap-2 overflow-y-scroll h-[92%]">
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

                    <label className="mt-3" htmlFor="category">
                        Category :
                    </label>
                    <select
                        className="p-2 bg-slate-100 border rounded-lg appearance-none pr-6"
                        required
                        value={data.category}
                        name="category"
                        onChange={handleOnChange}
                    >
                        {productCategory.map((el, i) => (
                            <option value={el.value} key={i}>
                                {el.label}
                            </option>
                        ))}
                    </select>

                    <label className="mt-3">Product Image :</label>
                    <label htmlFor="uploadImageInput">
                        <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                            <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                                <span className="text-4xl">
                                    <FaImages />
                                </span>
                                <p className="text-sm">Upload Product Image</p>
                                <input
                                    type="file"
                                    id="uploadImageInput"
                                    className="hidden"
                                    onChange={handleUploadProduct}
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                />
                            </div>
                        </div>
                    </label>

                    {/* 1. Show uploading images with black background + progress */}
                    {uploadingImages.length > 0 && (
                        <div className="mt-6">
                            <h3 className="mb-3 text-lg font-semibold text-slate-700">
                                Images Uploading...
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {uploadingImages.map((imgObj) => (
                                    <div
                                        key={imgObj.id}
                                        className="relative w-full aspect-square bg-black flex items-center justify-center text-white"
                                    >
                                        {/* Imagen con opacidad para ver preview */}
                                        <img
                                            src={imgObj.previewUrl}
                                            alt="preview"
                                            className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                                        />
                                        {/* Progreso en el centro */}
                                        <div className="absolute">
                                            <p>{Math.round(imgObj.progress) + "%"}</p>
                                        </div>
                                        {/* Botón "X" para cancelar subida */}
                                        < button
                                            type="button"
                                            className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xl font-bold"
                                            onClick={() => handleRemoveUploadingImage(imgObj.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                    }

                    {/* 2. Show the images that have finished uploading (data.productImage) */}
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
                                            rounded
                                            shadow-sm
                                            overflow-hidden
                                            hover:shadow-md
                                            transition-shadow
                                            duration-200
                                            relative
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
                                                setfullScreenImage(url)
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
                            <p className="text-red-600">Please upload product images</p>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={uploadingImages.length > 0}
                        className={`
              mt-6 px-3 py-2 mb-10 text-white 
              ${uploadingImages.length > 0
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }
            `}
                    >
                        Upload Product
                    </button>
                </form >
            </div >

            {/* Display image full screen */}
            {
                openFullScreenImage && (
                    <DisplayImage onClose={() => setopenFullScreenImage(false)} imgUrl={fullScreenImage} />
                )
            }


        </div >
    );
};

export default UploadProduct;
