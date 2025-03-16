import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from '../common';
import { Bounce, toast } from 'react-toastify';
import Context from '../context';
import useLoading from "./../hooks/useLoading";
import GoogleAuth from '../components/GoogleAuth';


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const { loading, setLoading, dots } = useLoading();

    const navigate = useNavigate();
    const { fecthUserDetails, fetchUserCountCartItems } = useContext(Context)

    //console.log("generalContext", fetchUserDetails);

    const validateForm = () => {
        let valid = true;
        let newErrors = {
            email: "",
            password: ""
        };

        // Validación de email
        if (!data.email) {
            newErrors.email = "Debes colocar tu correo Electronico.";
            valid = false;
        }

        // Validación de contraseña
        if (!data.password) {
            newErrors.password = "Debes colocar tu contraseña.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name]: value // [name] se convierte en la clave dinámica, value es el valor
            }
        })
    }

    //const
    console.log("data login", data);

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!validateForm()) {
            console.log("NO submiting");
            return; // Si la validación falla, no enviamos el formulario
        }

        // Verificamos si ya está procesando otra solicitud
        //esto no es encesario porque button se desabilita cunado se esta enviando el Login pero porsiacaso
        if (loading) return;

        console.log("submitimg...");

        try {
            setLoading(true);
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })

            const dataApi = await dataResponse.json();
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
                fecthUserDetails();
                fetchUserCountCartItems();
                navigate("/");

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
            console.log("Error al logear Usuario", error)
        } finally {
            setLoading(false);
        }

    }


    return (
        <section id='login'>
            <div className='mx-auto container p-4'>
                <div className='bg-white dark:bg-slate-700 p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons' />
                    </div>

                    <div className='pt-4 text-center'>
                        <GoogleAuth />
                    </div>
                    {/* Con <form>: Los formularios HTML tienen validación incorporada */}
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 pt-6' >
                        <div className='grid'>
                            <label className='dark:text-white'>Email : </label>
                            <div className='bg-slate-100 dark:bg-slate-600 p-2 rounded-lg'>
                                <input
                                    type='email'
                                    placeholder="Enter email"
                                    className='w-full h-full outline-none bg-transparent dark:text-slate-100'
                                    onChange={handleOnChange}
                                    name='email'
                                    value={data.email}
                                />
                            </div>
                            {errors.email && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.email}</p>}

                        </div>

                        <div className='grid'>
                            <label className='dark:text-white'>Password : </label>
                            <div className='bg-slate-100 dark:bg-slate-600 p-2 flex items-center rounded-lg'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    className='w-full h-full outline-none bg-transparent dark:text-slate-100'
                                    onChange={handleOnChange}
                                    name='password'
                                    value={data.password}
                                />
                                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showPassword ? <IoEye className='dark:text-slate-200' /> : (<IoEyeOff className='dark:text-slate-200' />)
                                        }
                                    </span>
                                </div>
                            </div>
                            {errors.password && <p className='mt-1 ml-1' style={{ color: "red" }}>{errors.password}</p>}

                            <Link to={'/forgot-password'} className='w-fit ml-auto dark:text-slate-200 hover:underline hover:text-red-600 mt-1'>
                                Forgot Password ?
                            </Link>
                        </div>


                        <button disabled={loading} className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 max-w-[150px] w-full rounded-full hover:scale-110 transition-all mx-auto block mt-3'>
                            {
                                loading ? (
                                    <span className="flex items-center">
                                        <p>Processing</p>
                                        <p className='ml-[2px] animate-pulse'>{dots}</p>
                                    </span>

                                ) : ("Log in")
                            }
                        </button>
                    </form>



                    <p className='my-5 dark:text-white'>Dont have an account? <Link className='text-red-600 dark:font-semibold hover:text-red-700 hover:underline' to={"/sign-up"}>Sign up</Link></p>
                </div>

            </div>
        </section>
    )
}

export default Login
