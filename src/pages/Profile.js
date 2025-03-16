import React, { useEffect, useState } from 'react';
import imageTobase64 from '../helpers/imageToBase64';
import { FaCircleUser } from "react-icons/fa6";
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';


const UserProfile = () => {
    const navigate = useNavigate(); // REACT-ROUTER
    const user = useSelector(state => state.user.user); //REDUX
    const dispatch = useDispatch(); //REDUX


    // Estado para controlar si el usuario “quiere cambiar la contraseña”
    const [wantsToChangePassword, setWantsToChangePassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        profilePic: user?.profilePic || '',
        wantsToChangePassword: false,
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imagePic = await imageTobase64(file);  // Maneja cualquier error de la promesa
            console.log("imagePic: ", imagePic);

            setFormData((prev) => {
                return {
                    ...prev,
                    profilePic: imagePic
                };
            });
        }

    };

    const handleRemovePhoto = () => {
        setFormData((prev) => {
            return {
                ...prev,
                profilePic: ""
            };
        });

    };

    console.log("data profile: ", formData);


    const handleDeleteAccount = async () => {
        // Lógica para eliminar usuario
        //alert('Account deleted successfully');

        try {
            const dataResponse = await fetch(SummaryApi.deleteProfile.url, {
                method: SummaryApi.deleteProfile.method,
                credentials: 'include', //IMPORTANTE, SIN ESO AUTHTOKEN responderia not logged in porque as cookies no se enviarian
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
                dispatch(setUserDetails(null));
                navigate("/login");
            }
            else if (dataApi.error) {
                toast.error(dataApi.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.log("Error al eliminar cuenta: ", error)
        }
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        // Validación de nombre
        if (!formData.name) {
            newErrors.name = "El nombre es obligatorio.";
            valid = false;
        }

        // Validación de email
        if (!formData.email) {
            newErrors.email = "El correo electrónico es obligatorio.";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido.";
            valid = false;
        }

        //Si el usuario activo la sesccion de contraseña
        if (wantsToChangePassword) {
            // Validación de contraseña
            if (!formData.password) {
                newErrors.password = "La contraseña es obligatoria.";
                valid = false;
            } else if (formData.password.length < 6) {
                newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
                valid = false;
            }

            // Validación de confirmación de contraseña
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "La confirmación de la contraseña es obligatoria.";
                valid = false;
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Las contraseñas no coinciden.";
                valid = false;
            }
        }

        //Esta comentado para que aca no sea obligatorio la foto de perfil, es opcional
        // // Validación de foto de perfil
        // if (!formData.profilePic) {
        //     newErrors.profilePic = "La foto de perfil es obligatoria.";
        //     valid = false;
        // }


        setErrors(newErrors);
        return valid;
    };

    const handleChangePasswordToggle = (e) => {

        setWantsToChangePassword(e.target.checked);
        setFormData(prevData => ({
            ...prevData,
            wantsToChangePassword: e.target.checked
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("NO submiting");
            return; // Si la validación falla, no enviamos el formulario
        }
        console.log("submitimg...");

        try {
            setLoading(true);
            const dataResponse = await fetch(SummaryApi.updateProfile.url, {
                method: SummaryApi.updateProfile.method,
                headers: {
                    "content-type": "application/json"
                },
                credentials: 'include', //IMPORTANTE, SIN ESO AUTHTOKEN responderia not logged in porque as cookies no se enviarian
                body: JSON.stringify(formData)
            })

            const dataApi = await dataResponse.json();
            console.log("dataApi", dataApi)
            setLoading(false);
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
                // esto es para que se rrefesce la data del usuario de inmediato
                dispatch(setUserDetails(dataApi.data));
            }
            else if (dataApi.error) {
                toast.error(dataApi.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
                if (dataApi.errors)
                    setErrors(dataApi.errors);
            }
        } catch (error) {
            console.log("Error al registrar Usuario", error)
        }
    }


    return (
        <>
            {/* Main Profile Section */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-100" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-300 dark:bg-slate-500 dark:text-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Your name"
                    />
                    {errors.name && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.name}</p>}
                </div>


                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-300 dark:bg-slate-500 dark:text-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Your email"
                    />
                    {errors.email && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.email}</p>}
                </div>

                {/* Toggle “Cambiar Contraseña” */}
                <div className="mb-2">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={wantsToChangePassword}
                            onChange={handleChangePasswordToggle}
                        />
                        <span className='dark:text-slate-100'>Quiero cambiar mi contraseña</span>
                    </label>
                </div>

                {/* Sección de Contraseña (condicional) */}
                {
                    wantsToChangePassword && (
                        <>
                            {/* Password */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white" htmlFor="password">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 dark:bg-slate-500 dark:text-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Enter new password"
                                />
                                {errors.password && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 dark:bg-slate-500 dark:text-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Confirm new password"
                                />
                                {errors.confirmPassword && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.confirmPassword}</p>}

                            </div>
                        </>
                    )
                }




                {/* Profile Photo */}
                <div>

                    <div className='flex flex-col items-center  border border-slate-800 dark:border-slate-300 p-3 rounded-3xl w-full max-w-44'>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white" htmlFor="profilePhoto">
                            Profile Photo
                        </label>
                        <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full mt-2'>
                            <div>
                                {
                                    formData.profilePic ? (<img className='w-20 h-20' src={formData.profilePic} alt='login icons' />) : (<FaCircleUser className='w-20 h-20 dark:text-slate-100' />)
                                }
                            </div>

                            <label>
                                <div className='opacity-0 hover:opacity-100 text-xs bg-slate-200 bg-opacity-95 cursor-pointer py-1 text-center absolute bottom-0 w-full'>
                                    <span className='block'>Upload</span>
                                    <span className='block'>Photo</span>
                                </div>
                                <input accept="image/jpeg, image/png, image/gif" type='file' className='hidden' onChange={handlePhotoChange}
                                ></input>
                            </label>

                        </div>
                    </div>

                    {
                        formData.profilePic && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="mt-2 ml-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                            >
                                Remove Photo
                            </button>
                        )
                    }

                </div>

                {/* Submit Button */}

                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {loading ? ("Processing") : ("Save Changes")}
                    </button>
                </div>
            </form>

            {/* Delete Account Button */}
            <div className="mt-4">
                {
                    user?.role != "ADMIN" && user?.role != "SUPERADMIN" &&
                    <>
                        <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300" onClick={() => document.getElementById('my_modal_3').showModal()}>
                            Delete Account
                        </button>

                        <dialog id="my_modal_3" className="modal bg-black/50 dark:bg-slate-300/50 backdrop-blur-3x">
                            <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow-lg w-96 relative">
                                <form method="dialog">
                                    <button className="absolute right-2 top-2 text-gray-600 hover:text-red-500 transition duration-300">
                                        ✕
                                    </button>
                                </form>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200">⚠️ Irreversible</h3>
                                <p className="py-4 text-gray-600 dark:text-slate-200">¿Estás seguro de que deseas eliminar tu cuenta?</p>

                                {/* Botones en la parte inferior */}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
                                        onClick={() => document.getElementById('my_modal_3').close()}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </dialog>
                    </>
                }

            </div>
        </>
    );
};

export default UserProfile;
