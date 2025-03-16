import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import imageToBase64 from "../helpers/imageToBase64";
import SummaryApi from '../common';
import { Bounce, toast } from 'react-toastify';
import GoogleAuth from '../components/GoogleAuth';



const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePic: ""
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePic: ""
    });

    const navigate = useNavigate()


    const handleOnChange = (e) => {
        const { name, value } = e.target;

        //se le pasa prev, pero react con este hook useState maneja prev internamente
        setData((prev) => {
            return {
                ...prev,
                [name]: value // [name] se convierte en la clave dinámica, value es el valor
            }
        })
    }

    const handleUploadPic = async (e) => {
        try {
            const file = e.target.files[0];
            const imagePic = await imageToBase64(file);  // Maneja cualquier error de la promesa
            console.log("imagePic", imagePic);

            setData((prev) => {
                return {
                    ...prev,
                    profilePic: imagePic
                };
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);  // Manejo de cualquier error, ya sea de la promesa o externo
        }
    }

    //const
    console.log("data signup", data);

    const validateForm = () => {
        let valid = true;
        let newErrors = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePic: ""
        };

        // Validación de nombre
        if (!data.name) {
            newErrors.name = "El nombre es obligatorio.";
            valid = false;
        }

        // Validación de email
        if (!data.email) {
            newErrors.email = "El correo electrónico es obligatorio.";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "El correo electrónico no es válido.";
            valid = false;
        }

        // Validación de contraseña
        if (!data.password) {
            newErrors.password = "La contraseña es obligatoria.";
            valid = false;
        } else if (data.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
            valid = false;
        } else if (!/[a-z]/.test(data.password)) {
            newErrors.password = "La contraseña debe tener al menos una letra minuscula.";
        } else if (!/[A-Z]/.test(data.password)) {
            newErrors.password = "La contraseña debe tener al menos una letra mayuscula.";
        } else if (!/[0-9]/.test(data.password)) {
            newErrors.password = "La contraseña debe tener al menos un numero.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
            newErrors.password = "La contraseña debe tener al menos un caracter especial.";
        }


        // Validación de confirmación de contraseña
        if (!data.confirmPassword) {
            newErrors.confirmPassword = "La confirmación de la contraseña es obligatoria.";
            valid = false;
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden.";
            valid = false;
        }

        // Validación de foto de perfil
        if (!data.profilePic) {
            newErrors.profilePic = "La foto de perfil es obligatoria.";
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
        console.log("submitimg...");

        try {
            setLoading(true);
            const dataResponse = await fetch(SummaryApi.signUp.url, {
                method: SummaryApi.signUp.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
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
                    transition: Bounce,
                });
                navigate("/login");
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
        <section id='login'>
            <div className='mx-auto container p-4'>
                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                        <div>
                            <img className='w-20 h-20' src={data.profilePic || loginIcons} alt='login icons' />
                        </div>
                        <form>
                            <label>
                                <div className='opacity-0 hover:opacity-100 text-xs bg-slate-200 bg-opacity-95 cursor-pointer py-1 text-center absolute bottom-0 w-full'>
                                    <span className='block'>Upload</span>
                                    <span className='block'>Photo</span>
                                </div>
                                <input accept="image/jpeg, image/png, image/gif" type='file' className='hidden' onChange={handleUploadPic}></input>
                            </label>
                        </form>
                    </div>
                    {errors.profilePic && <p className='mt-1 text-center' style={{ color: "red" }}>{errors.profilePic}</p>}

                    <div className='pt-4 text-center'>
                        <GoogleAuth />
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 pt-6' >
                        <div className='grid'>
                            <label for="name">Name : </label>
                            <div className='bg-slate-100 rounded-lg p-2'>
                                <input
                                    id="name"
                                    type='text'
                                    placeholder="Enter your name"
                                    className='w-full h-full outline-none bg-transparent'
                                    onChange={handleOnChange}
                                    name='name'
                                    value={data.name}
                                // required
                                />
                            </div>
                            {errors.name && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.name}</p>}
                        </div>

                        <div className='grid'>
                            <label>Email : </label>
                            <div className='bg-slate-100 p-2 rounded-lg'>
                                <input
                                    type='email'
                                    placeholder="Enter email"
                                    className='w-full h-full outline-none bg-transparent'
                                    onChange={handleOnChange}
                                    name='email'
                                    value={data.email}
                                // required
                                />
                            </div>
                            {errors.email && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.email}</p>}
                        </div>

                        <div className='grid'>
                            <label>Password : </label>
                            <div className='bg-slate-100 p-2 flex items-center rounded-lg'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    className='w-full h-full outline-none bg-transparent'
                                    onChange={handleOnChange}
                                    name='password'
                                    value={data.password}
                                // required
                                />
                                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showPassword ? <IoEye /> : (<IoEyeOff />)
                                        }
                                    </span>
                                </div>
                            </div>
                            {errors.password && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.password}</p>}

                        </div>

                        <div className='grid'>
                            <label>Confirm Password : </label>
                            <div className='bg-slate-100 p-2 flex items-center rounded-lg'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter confirm password"
                                    className='w-full h-full outline-none bg-transparent'
                                    onChange={handleOnChange}
                                    name='confirmPassword'
                                    value={data.confirmPassword}
                                // required
                                />
                                <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showConfirmPassword ? <IoEye /> : (<IoEyeOff />)
                                        }
                                    </span>
                                </div>
                            </div>
                            {errors.confirmPassword && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.confirmPassword}</p>}


                        </div>


                        <button disabled={loading} className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 max-w-[150px] w-full rounded-full hover:scale-110 transition-all mx-auto block mt-3'>

                            {
                                loading ? (<p>Processing...</p>) : ("Sign up")
                            }
                        </button>

                    </form>

                    <p className='my-5'>Already have an account? <Link className='text-red-600 hover:text-red-700 hover:underline' to={"/login"}>Log in</Link></p>
                </div>
            </div>
        </section>
    )
}

export default SignUp
