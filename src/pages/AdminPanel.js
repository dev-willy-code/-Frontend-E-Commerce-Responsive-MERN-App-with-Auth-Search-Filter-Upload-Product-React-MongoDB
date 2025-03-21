import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { FaCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Context from '../context';
import { useLocation } from 'react-router-dom';



const AdminPanel = () => {
    const user = useSelector(state => state.user.user);
    const navigate = useNavigate()
    const { fecthUserDetails } = useContext(Context)
    const location = useLocation();
    console.log(user);

    useEffect(() => {
        //no hay ROLE.SUPERDAMIN PORQUE SE USA TAMBIEN PARA OPTIONS PARA ACTUALIZAR EL ROL DE LOS USURIROS, Y NO ESTA PERIMITOD CAMBIAR A SUPERADMIN, SI SE PEUDE ARREGLAR PERO LO DEJE ASI
        if (user?.permisos.configuracion.puedeAbrirPanelAdmin == false || user == null) {
            navigate("/login")
        }
    }, [user]) //  esto lo pongo porque cuando desde el header se llama fecthUserDetails() , primero se navega , y luego se ejcuta la funcion, por eso coloco user para que se actulaize aca



    return (
        <div className='min-h-[calc(100vh-120px)] flex'>
            <aside className='bg-white dark:bg-slate-700 min-h-full w-full max-w-60 customShadow'>
                <div className='  h-44 flex justify-center items-center flex-col border border-black dark:border-slate-300 rounded-lg m-2 bg-slate-100 dark:bg-slate-600'>
                    <div className='text-6xl cursor-pointer mb-3 '
                    >
                        {
                            user?.profilePic ? (
                                <div className="flex items-center justify-center ring-red-600 ring-offset-base-100 w-20 h-20 rounded-full ring-1 ring-offset-1">
                                    <img alt={user?.name} className='w-20 h-20 rounded-full' src={user?.profilePic} />
                                </div>
                            ) : (<FaCircleUser className='dark:text-slate-100' />)
                        }
                    </div>
                    <p className='capitalize text-sm font-semibold dark:text-slate-100'>{user?.name}</p>
                    <p className='text-xs dark:text-slate-100'>{user?.role}</p>
                </div>

                {/* Navigation */}
                <div className='mt-4 '>
                    <nav className='grid border border-black dark:border-slate-300 m-2 rounded-lg overflow-hidden'>
                        {Object.values(user?.permisos?.usuarios?.listar || {}).some(permiso => permiso) && (
                            <Link
                                to={"all-users"}
                                //si no pongo esto entonces si el superadmin quita permisos de (usuarios.listar), aparecera un mensaje de error("no puedes ver usuarios"),
                                //con esto redireccionara a la pagina principal, que es mejor, aunque estamos ahciendo fecth, lo cual consume mas recursos
                                onClick={() => { fecthUserDetails() }}
                                className={`px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-white ${location.pathname.includes("all-users") ? "bg-slate-300 dark:bg-slate-500" : "bg-slate-100 dark:bg-slate-400"}`}>
                                All Users
                            </Link>
                        )}
                        {user?.permisos?.productos?.listar &&
                            <Link
                                to={"all-products"}
                                //si no pongo esto entonces si el superadmin quita permisos de (productos.listar), aparecera un mensaje de error("no puedes ver prodcutos"),
                                //con esto redireccionara a la pagina principal, que es mejor, aunque estamos ahciendo fecth, lo cual consume mas recursos
                                onClick={() => { fecthUserDetails() }}
                                className={`border-t-2 border-black dark:border-slate-300 px-2 py-1 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 ${location.pathname.includes("all-products") ? "bg-slate-300 dark:bg-slate-500" : "bg-slate-100 dark:bg-slate-400"}`}>
                                All products
                            </Link>
                        }
                        {user?.permisos?.configuracion?.puedeModificarPermisos &&
                            < Link
                                to={"user-permissions"}
                                //si no pongo esto entonces si el superadmin quita permisos de (puedeModificarPermisos), aparecera un mensaje de error("no puedes ver permisos"),
                                //con esto redireccionara a la apgina principal, que es mejor, aunque estmaos ahciendo fecth, lo cual consume mas recursos
                                onClick={() => { fecthUserDetails() }}
                                className={`border-t-2 border-black dark:border-slate-300 px-2 py-1 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 ${location.pathname.includes("user-permissions") ? "bg-slate-300 dark:bg-slate-500" : "bg-slate-100 dark:bg-slate-400"}`}>
                                User permissions
                            </Link>
                        }
                        {user?.permisos?.configuracion?.puedeVerOrdenes_Pagos &&
                            <Link
                                to={"all-order"}
                                //si no pongo esto entonces si el superadmin quita permisos de (puedeModificarPermisos), aparecera un mensaje de error("no puedes ver permisos"),
                                //con esto redireccionara a la apgina principal, que es mejor, aunque estmaos ahciendo fecth, lo cual consume mas recursos
                                onClick={() => { fecthUserDetails() }}
                                className={`border-t-2 border-black dark:border-slate-300 px-2 py-1 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 ${location.pathname.includes("all-order") ? "bg-slate-300 dark:bg-slate-500" : "bg-slate-100 dark:bg-slate-400"}`}>
                                All Orders
                            </Link>
                        }
                    </nav>
                </div>
            </aside >

            <main className='w-full h-full p-2'>
                <Outlet />
            </main>
        </div >
    )
}

export default AdminPanel
