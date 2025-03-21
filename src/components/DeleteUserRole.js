import React, { useState } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import useLoading from '../hooks/useLoading';
import useRoles from '../common/role';

const DeleteRole = ({ onClose, callFunc }) => {
    const [selectedRole, setSelectedRole] = useState("");
    const { loading, setLoading, dots } = useLoading();
    const { roles, loadingRoles } = useRoles();

    const handleDeleteRole = async () => {
        if (!selectedRole) {
            toast.error("Selecciona un rol para eliminar.", { position: "bottom-center", autoClose: 2000 });
            return;
        }
        try {
            setLoading(true);
            console.log(selectedRole);
            const url = `${SummaryApi.deleteRole.url}/${encodeURIComponent(selectedRole)}`;
            console.log("url fetch: ", url);

            const fetchResponse = await fetch(url, {
                method: SummaryApi.deleteRole.method,
                credentials: 'include',
            });
            console.log("fetchResponse: ", fetchResponse);
            const responseData = await fetchResponse.json();

            if (responseData.success) {
                toast.success(responseData.message);
                callFunc();
                onClose();
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.log("Error al eliminar rol", error);
            toast.error("Error al eliminar el rol.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-slate-600 bg-opacity-90'>
            <div className='rounded-e-2xl mx-auto bg-slate-100 dark:bg-slate-700 shadow-md p-4 w-full max-w-sm h-full max-h-56'>
                <button className='block ml-auto text-3xl dark:text-slate-100' onClick={onClose}><IoCloseCircleOutline /></button>
                {loadingRoles ? (
                    <p className='text-center font-bold dark:text-slate-100'>Cargando roles...</p>
                ) : (
                    <>
                        <h1 className='pb-4 text-lg font-medium dark:text-slate-100'>Eliminar Rol</h1>
                        <div className='flex items-center gap-6 my-4'>
                            <p className='dark:text-slate-100'>Selecciona un rol:</p>
                            <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole} className='border px-4 py-1 dark:bg-slate-700 dark:text-slate-100'>
                                <option value="">-- Seleccionar --</option>
                                {roles?.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleDeleteRole} className='w-fit mx-auto block border rounded-3xl py-1 px-3 bg-red-500 text-white hover:bg-red-700 transition-all duration-300 mt-8'>
                            {loading ? <span className="flex items-center">Procesando {dots}</span> : "Eliminar Rol"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteRole;
