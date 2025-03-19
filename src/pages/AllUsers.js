import React, { useEffect, useState } from 'react'
import SummaryApi from '../common';
import { toast } from 'react-toastify';
//const { parseISO, format } = require("date-fns"); //opcion antigua de importar 
import { parseISO, format } from "date-fns"; //otra opcion de importar, mas moderna
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';
import { useSelector } from 'react-redux';
import useLoading from '../hooks/useLoading';

const AllUsers = () => {
    const user = useSelector(state => state.user.user);


    const [allUser, setAllUsers] = useState([]); //esto sera un arreglol de objetos(objetos de usuarios)
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    })
    const [openUpdateRole, setOpenUpdateRole] = useState(false)
    //ORDENAR Y FILTRAR
    const [sortOption, setSortOption] = useState('name'); // Opción para ordenar
    const [filterOption, setFilterOption] = useState('all'); // Filtro por rol
    const { loading, setLoading, dots } = useLoading(); //hook personalizado



    // Función para ordenar usuarios por nombre, email o fecha de creación
    const sortUsers = (users, option) => {
        return [...users].sort((a, b) => {
            if (option === 'name') {
                return a.name.localeCompare(b.name);
            } else if (option === 'email') {
                return a.email.localeCompare(b.email);
            } else if (option === 'createdAt') {
                return new Date(a.createdAt) - new Date(b.createdAt); // Ordena por fecha de creación
            }
            return 0;
        });
    }

    // Función para filtrar usuarios por rol
    const filterUsers = (users, role) => {
        if (role === 'all') return users;
        return users.filter(user => user.role === role); // se retorna si el rol coincide, para filtrar por rol
    }

    const deleteUser = async (UserToDelete) => {
        //Testing -> console.log("Deleting User...");
        try {
            const dataResponse = await fetch(SummaryApi.deleteUser.url, {
                method: SummaryApi.deleteUser.method,
                credentials: 'include', //IMPORTANTE, SIN ESO AUTHTOKEN responderia not logged in porque as cookies no se enviarian
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    userId: UserToDelete
                })
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
                fetchAllUsers();
            }
            else if (dataApi.error) {
                toast.error(dataApi.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.log("Error al eliminar usuario(Admin Panel): ", error)
        }
    }

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const fetchData = await fetch(SummaryApi.alluser.url, {
                method: SummaryApi.alluser.method,
                credentials: 'include'
            })

            const dataResponse = await fetchData.json();
            console.log("AllUsers dataResponse", dataResponse.data);
            console.log("AllUsers fetchData", fetchData);

            if (dataResponse.success) {
                setAllUsers(dataResponse.data);
            } else if (dataResponse.error) {
                toast.error(dataResponse.message, {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.log("fecthAllUsers: ", error);
        } finally {
            setLoading(false);  // Aquí también debes asegurarte de ponerlo en `false` si ocurre un error.
        }
    }

    useEffect(() => {
        fetchAllUsers();
    }, [])

    // Filtrar y ordenar usuarios según las opciones seleccionadas
    const filteredAndSortedUsers = filterUsers(sortUsers(allUser, sortOption), filterOption);

    const rolesPermitidosActualizar = Object.keys(user?.permisos?.usuarios?.actualizar || {}).filter(
        role => user?.permisos?.usuarios?.actualizar[role]
    );
    const rolesPermitidosEliminar = Object.keys(user?.permisos?.usuarios?.eliminar || {}).filter(
        role => user?.permisos?.usuarios?.eliminar[role]
    );


    return (
        <div className='m-2 p-1 bg-white dark:bg-slate-700'>

            <div className="mb-4">
                {/* Filtro por Rol */}
                <label htmlFor="filter-role" className="mr-2 dark:text-slate-100">Filter by Role:</label>
                <select
                    id="filter-role"
                    className="p-2 border rounded bg-slate-500 dark:text-white"
                    onChange={(e) => setFilterOption(e.target.value)}
                    value={filterOption}
                >
                    <option value="all">All</option>
                    <option value="GENERAL">General</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
                </select>

                {/* Ordenar por Nombre, Email o Fecha */}
                <label htmlFor="sort-option" className="ml-4 mr-2 dark:text-slate-100">Sort by:</label>
                <select
                    id="sort-option"
                    className="p-2 border rounded bg-slate-500 dark:text-white"
                    onChange={(e) => setSortOption(e.target.value)}
                    value={sortOption}
                >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="createdAt">Creation Date</option>
                </select>
            </div>




            {
                loading ? (
                    <span className="flex items-center">
                        <p className='dark:text-white'>Processing</p>
                        <p className='ml-[2px] animate-pulse dark:text-white'>{dots}</p>
                    </span>

                ) : (
                    <table className="w-full userTable">
                        <thead>
                            <tr className='bg-slate-700 text-white'>
                                <th>Sr.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filteredAndSortedUsers.map((element, index) => {
                                    // if (element.role == "SUPERADMIN") {
                                    //     return;
                                    // }
                                    // Convierte el valor 'createdAt' en un objeto Date
                                    const parsedDate = parseISO(element.createdAt);

                                    // Usa 'format' para convertir el Date a un formato más legible
                                    //const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss'); // Aquí defines el formato
                                    const formattedDate = format(parsedDate, 'dd/MM/yyyy hh:mm aa'); // Aquí defines el formato

                                    return (
                                        <tr className='dark:bg-slate-600 dark:text-white'>
                                            <td>{index + 1}</td>
                                            <td className='truncate max-w-[155px]' title={element.name}>{element.name}</td>
                                            <td className='truncate max-w-[155px]' title={element.email}>{element.email}</td>
                                            <td>{element.role}</td>
                                            <td>{formattedDate}</td>

                                            <td>
                                                {/* Contenedor de botones con flexbox */}
                                                <div className={`flex justify-center gap-2`}>

                                                    {/* Mostrar el botón de editar si el rol del usuario está en la lista de rolesPermitidosActualizar */}
                                                    {rolesPermitidosActualizar.includes(element.role) && (
                                                        <button onClick={() => {
                                                            setUpdateUserDetails(element)
                                                            setOpenUpdateRole(true)
                                                        }}
                                                            className='bg-green-400 p-2 rounded-full cursor-pointer hover:bg-green-500 transition-colors duration-300 hover:text-white'
                                                        >
                                                            <MdModeEditOutline className='text-black' />
                                                        </button>
                                                    )}

                                                    {/* Mostrar el botón de eliminar si el rol del usuario está en la lista de rolesPermitidosEliminar */}
                                                    {rolesPermitidosEliminar.includes(element.role) && (
                                                        <button onClick={() => { deleteUser(element._id) }}
                                                            className='bg-red-500 p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors duration-300 hover:text-white'
                                                        >
                                                            <MdDelete className='text-white' />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>



                                        </tr>
                                    )
                                })
                            }
                        </tbody>


                    </table>
                )
            }


            {
                openUpdateRole && (
                    <ChangeUserRole
                        onClose={() => setOpenUpdateRole(false)}
                        name={updateUserDetails.name}
                        email={updateUserDetails.email}
                        role={updateUserDetails.role}
                        userId={updateUserDetails._id}
                        callFunc={fetchAllUsers}
                    />
                )
            }
        </div >
    )
}

export default AllUsers
