import { useState, useEffect } from "react";
import SummaryApi from "../common";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateRole from "../components/CreateRole";
import DeleteRole from "../components/DeleteUserRole";

export default function RolePermissionsEditor() {
    const [rolesData, setRolesData] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user.user);
    const navigate = useNavigate()

    const [openCreateRole, setOpenCreateRole] = useState(false);
    const [openDeleteRole, setOpenDeleteRole] = useState(false);


    useEffect(() => {
        //no hay ROLE.SUPERDAMIN PORQUE SE USA TAMBIEN PARA OPTIONS PARA ACTUALIZAR EL ROL DE LOS USURIROS, Y NO ESTA PERIMITOD CAMBIAR A SUPERADMIN, SI SE PEUDE ARREGLAR PERO LO DEJE ASI
        if (user?.permisos.configuracion.puedeModificarPermisos == false || user == null) {
            navigate("/")
        }
    }, [user]) //  esto lo pongo porque cuando desde el header se llama fecthUserDetails() , primero se navega , y luego se ejcuta la funcion, por eso coloco user para que se actulaize aca

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getRolesPermissions.url, {
                method: SummaryApi.getRolesPermissions.method,
                credentials: "include"
            });

            const dataResponse = await response.json();
            if (dataResponse.success) {
                setRolesData(dataResponse.data);
                setSelectedRole(dataResponse.data[0].role);
                setPermissions(dataResponse.data[0].permisos);
            } else {
                toast.error(dataResponse.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("permisos", permissions);
    console.log("rolesdata: ", rolesData);

    const handleRoleChange = (role) => {
        const selected = rolesData.find((r) => r.role === role);
        if (selected) {
            setSelectedRole(role);
            setPermissions(selected.permisos);
        }
    };

    const handleCheckboxChange = (category, subCategory, key) => {
        setPermissions((prev) => {
            const updatedPermissions = structuredClone(prev); // Copia profunda

            if (!updatedPermissions[category]) updatedPermissions[category] = {};
            if (!updatedPermissions[category][subCategory]) updatedPermissions[category][subCategory] = {};

            updatedPermissions[category][subCategory][key] = !prev[category][subCategory][key];

            return updatedPermissions;
        });
    };


    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.updateRolesPermissions.url, {
                method: SummaryApi.updateRolesPermissions.method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ role: selectedRole, newPermisos: permissions }),
            });
            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                // Actualizar solo el rol modificado en rolesData con la data retornada del backend
                setRolesData((prevRoles) =>
                    prevRoles.map((role) =>
                        role.role === responseData.data.role ? { ...role, permisos: responseData.data.permisos } : role
                    )
                );
            } else {
                toast.error(responseData.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {
                rolesData.length === 0 && !loading ? (<p className="p-3 text-lg font-bold">No se pudo cargar los permisos, intente nuevamente</p>) : (
                    <div className="p-6 bg-gray-100 dark:bg-black min-h-screen">
                        <div className="flex justify-between bg-white shadow-md rounded-lg p-4 mb-4 dark:bg-slate-700">
                            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-slate-100">Editar permisos</h2 >
                            <div className="flex gap-3 w-full max-w-96">
                                {user?.permisos?.configuracion?.puedeCrearRoles &&
                                    <button
                                        onClick={() => { setOpenCreateRole(true) }}
                                        className="w-full max-w-40 bg-slate-400 text-white font-bold py-2 rounded-lg shadow-md hover:bg-slate-500 transition duration-300"
                                    >
                                        Crear nuevo rol
                                    </button>
                                }
                                {user?.permisos?.configuracion?.puedeCrearRoles &&
                                    <button
                                        onClick={() => { setOpenDeleteRole(true) }}
                                        className="w-full max-w-40 bg-red-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                                    >
                                        Eliminar un rol
                                    </button>
                                }
                            </div>

                        </div >

                        <div className="flex justify-center mb-6">
                            <select
                                className="w-full max-w-md p-3 bg-white dark:bg-slate-700 dark:text-slate-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedRole}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                disabled={loading}
                            >
                                {rolesData.map((r) => (
                                    <option className="dark:text-slate-100" key={r.role} value={r.role}>{r.role}</option>
                                ))}
                            </select>
                        </div>

                        {
                            !loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.keys(permissions).map((category) => (
                                        <div key={category} className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-md">
                                            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-100 mb-3">{category.toUpperCase()}</h3>
                                            {Object.entries(permissions[category]).map(([subCategory, value]) => (
                                                <div key={subCategory} className="mb-2">
                                                    {typeof value === "boolean" ? (
                                                        <label className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={value}
                                                                onChange={() => setPermissions((prev) => ({
                                                                    ...prev,
                                                                    [category]: {
                                                                        ...prev[category],
                                                                        [subCategory]: !value
                                                                    }
                                                                }))}
                                                                className="form-checkbox h-5 w-5 text-blue-600"
                                                            />
                                                            <span className="text-gray-800 dark:text-slate-100">{subCategory}</span>
                                                        </label>
                                                    ) : (
                                                        <>
                                                            <h4 className="text-lg font-medium text-gray-600 dark:text-slate-300">{subCategory}</h4>
                                                            <div className="pl-4">
                                                                {Object.keys(value).map((key) => (
                                                                    <label key={key} className="flex items-center space-x-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={value[key]}
                                                                            onChange={() => handleCheckboxChange(category, subCategory, key)}
                                                                            className="form-checkbox h-5 w-5 text-blue-600"
                                                                        />
                                                                        <span className="text-gray-700 dark:text-slate-100">{key}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">Cargando...</p>
                            )
                        }

                        <div className="flex justify-center mt-6">
                            <button
                                className="w-full max-w-xs bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div >
                )
            }

            {
                openCreateRole && (
                    <CreateRole
                        onClose={() => setOpenCreateRole(false)}
                        callFunc={fetchData}
                    />
                )
            }

            {
                openDeleteRole && (
                    <DeleteRole
                        onClose={() => setOpenDeleteRole(false)}
                        callFunc={fetchData}
                    />
                )
            }
        </>


    )
}



