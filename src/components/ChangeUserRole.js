import React, { useEffect, useState } from 'react'
// import ROLE from '../common/role'
import { IoCloseCircleOutline } from "react-icons/io5";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import useLoading from '../hooks/useLoading';
import useRoles from '../common/role';

const ChangeUserRole = ({
    onClose,
    name,
    email,
    role,
    userId,
    callFunc
}) => {

    const [data, setData] = useState({
        role: ""
    })
    const { loading, setLoading, dots } = useLoading();

    const { roles, loadingRoles } = useRoles();
    console.log("roles: ", roles);

    //Sin useEffect: El cambio de estado(useState) dispara un re-render, y en ese nuevo render se vuelve a ejecutar la misma línea, lo que provoca un bucle sin fin.
    // Usar useEffect para solo actualizar el estado una vez al montar el componente
    useEffect(() => {
        setData({ role: role });
    }, [role]); // Esto se ejecutará solo cuando `role` cambie, pero quite role porque no es necesario aca, al final lo deje , no sirve pero si el rol cambiara

    console.log("UserID - ChangeuserRole", userId);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name]: value // [name] se convierte en la clave dinámica, value es el valor
            }
        })
    }

    console.log("data changeUserRole", data);

    const updateUserRole = async () => {
        try {

            setLoading(true); // se empieza la animacion de carga, para que el usuario sepa que se esta procesando
            const fetchResponse = await fetch(SummaryApi.updateUser.url, {
                method: SummaryApi.updateUser.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    ...data,
                    userId: userId
                })
            })
            const responseData = await fetchResponse.json();
            setLoading(false);
            console.log("responseData changeUserRole", responseData);

            if (responseData.success) {
                toast.success(responseData.message, {
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
                callFunc();
            } else if (responseData.error) {
                toast.error(responseData.message, {
                    position: "bottom-center",
                    autoClose: 2000, // tiempo para cerrar e toast
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light" //tambien hay "dark"
                });
            }

        } catch (error) {
            console.log("Error al changeUserRole", error)
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-slate-600 bg-opacity-50'>
            <div className=' rounded-e-2xl mx-auto bg-slate-100 shadow-md p-4 w-full max-w-sm h-full max-h-64'>

                <button className='block ml-auto text-3xl' onClick={onClose}>
                    <IoCloseCircleOutline />
                </button>
                {
                    loadingRoles ? (<p className='text-center font-bold'>Loading roles...</p>) : (
                        <>
                            <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>
                            <p>Name: {name}</p>
                            <p>Email: {email}</p>
                            <div className='flex items-center gap-6 my-4'>
                                <p>Role: </p>
                                <select onChange={handleOnChange} value={data.role} name='role' className='border px-4 py-1'>
                                    {
                                        roles?.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button onClick={updateUserRole}
                                className='w-fit mx-auto block border rounded-3xl py-1 px-3 bg-red-500 text-white hover:bg-red-700 transition-all duration-300'>
                                {
                                    loading ? (
                                        <span className="flex items-center">
                                            <p>Processing</p>
                                            <p className='ml-[2px] animate-pulse'>{dots}</p>
                                        </span>
                                    ) : ("Change Role")
                                }
                            </button>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default ChangeUserRole
