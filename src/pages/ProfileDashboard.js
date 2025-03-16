import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Context from '../context';


const ProfileDashboard = () => {
    const navigate = useNavigate(); // REACT-ROUTER
    const user = useSelector(state => state.user.user); //REDUX
    const { fecthUserDetails } = useContext(Context)

    useEffect(() => {
        //no hay ROLE.SUPERDAMIN PORQUE SE USA TAMBIEN PARA OPTIONS PARA ACTUALIZAR EL ROL DE LOS USURIROS, Y NO ESTA PERIMITOD CAMBIAR A SUPERADMIN, SI SE PEUDE ARREGLAR PERO LO DEJE ASI
        if (!user || user == null) {
            navigate("/")
        }
    }, [user]) //  esto lo pongo porque cuando desde el header se llama fecthUserDetails() , primero se navega , y luego se ejcuta la funcion, por eso coloco user para que se actulaize aca

    return (
        <div className="flex max-w-7xl mx-auto my-10">
            {/* Slider */}
            <div className="w-1/4 bg-gray-100 dark:bg-slate-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-slate-100">Options</h3>
                <ul className="space-y-2">
                    <li className="text-gray-700 dark:text-slate-100 hover:text-blue-500 cursor-pointer">
                        <Link to={"profile"}>Profile</Link>
                    </li>
                    <li className="text-gray-700 dark:text-slate-100 hover:text-blue-500 cursor-pointer">
                        <Link to={"permisos-actuales"} onClick={fecthUserDetails}>Permisos actuales</Link>
                    </li>
                    <li className="text-gray-700 dark:text-slate-100 hover:text-blue-500 cursor-pointer">
                        Configuraciones
                    </li>
                    <li className="text-gray-700 dark:text-slate-100 hover:text-blue-500 cursor-pointer">
                        Ayuda

                    </li>
                </ul>
            </div>

            {/* Main Profile Section */}
            <div className="w-3/4 ml-6 bg-white dark:bg-slate-700 p-8 rounded-lg shadow-md dark:shadow-slate-200">
                <div className="w-3/4 ml-6 bg-white dark:bg-slate-700 p-8 rounded-lg shadow-md dark:shadow-slate-200">
                    <Outlet />
                </div>
            </div >
        </div >
    );
};

export default ProfileDashboard;
