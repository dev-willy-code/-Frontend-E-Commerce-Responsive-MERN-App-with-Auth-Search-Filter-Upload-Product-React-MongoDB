// PermisosUsuarios.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import useLoading from "../hooks/useLoading";

function PermisosUsuarios() {
    const user = useSelector((state) => state.user.user);
    // Estados
    const [rolesData, setRolesData] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [permissions, setPermissions] = useState({});
    const { loading, setLoading, dots } = useLoading();
    const [errorMsg, setErrorMsg] = useState("");
    const [sectionOpen, setSectionOpen] = useState({});

    console.log("Permissions: ", permissions);

    // Efecto para cargar roles desde el backend
    useEffect(() => {
        const fetchRolesData = async () => {
            try {
                setLoading(true);
                const res = await fetch(SummaryApi.getRolesPermissions.url, {
                    method: SummaryApi.getRolesPermissions.method,
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success) {
                    setRolesData(data.roles || []);
                } else {
                    setErrorMsg(data.message || "Error al obtener roles.");
                }
            } catch (error) {
                setErrorMsg(error.message || "Error de conexión al obtener roles.");
            } finally {
                setLoading(false);
            }
        };
        fetchRolesData();
    }, [setLoading]);

    // Seleccionar rol
    const handleSelectRole = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        const found = rolesData.find((item) => item.role === role);
        if (found) {
            setPermissions(structuredClone(found.permisos));
            setSectionOpen({});
        } else {
            setPermissions({});
        }
    };

    // Toggle accordion
    const toggleSection = (sectionName) => {
        setSectionOpen((prev) => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
    };

    // Actualizar valor boolean
    const handleBooleanChange = (path, checked) => {
        const newPerms = structuredClone(permissions);
        let current = newPerms;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        const lastKey = path[path.length - 1];
        current[lastKey] = checked;
        setPermissions(newPerms);
    };

    // Actualizar arrays: suponiendo que cada array guarda roles o similares
    const handleArrayChange = (path, itemValue, checked) => {
        const newPerms = structuredClone(permissions);
        let current = newPerms;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        const lastKey = path[path.length - 1];
        let arr = current[lastKey] || [];

        // Si checked = true → agregar si no existe
        if (checked) {
            if (!arr.includes(itemValue)) {
                arr.push(itemValue);
            }
        } else {
            // checked = false → remover si existe
            arr = arr.filter((v) => v !== itemValue);
        }

        current[lastKey] = arr;
        setPermissions(newPerms);
    };

    // Guardar cambios
    const handleUpdatePermissions = async () => {
        if (!selectedRole) {
            alert("Debes seleccionar un rol primero.");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.updateRolesPermissions.url, {
                method: SummaryApi.updateRolesPermissions.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: selectedRole,
                    newPermisos: permissions,
                }),
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                alert("Permisos actualizados correctamente.");
                // Actualizar rolesData local
                setRolesData((prev) =>
                    prev.map((item) =>
                        item.role === selectedRole
                            ? { ...item, permisos: permissions }
                            : item
                    )
                );
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            alert("Error al actualizar permisos: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * renderPermissionsRecursively:
     * - Separa keys en booleans, arrays, objects
     * - Muestra booleans y arrays en la columna izquierda
     * - Muestra objetos anidados en la derecha (accordion)
     * - Fallback para otros tipos (si aparecen).
     */
    const renderPermissionsRecursively = (obj, path = []) => {
        console.log("renderPermissionsRecursively");
        console.log("path: ", path);
        console.log("obj: ", obj);
        const booleans = [];
        const arrays = [];
        const objects = [];
        const fallback = [];

        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === "boolean") {
                booleans.push({ key, val });
            } else if (Array.isArray(val)) {
                arrays.push({ key, val });
            } else if (val && typeof val === "object") {
                objects.push({ key, val });
            } else {
                fallback.push({ key, val });
            }
        }

        return (
            <div
                className="grid md:grid-cols-2 gap-4"
                style={{ borderLeft: "2px solid #ddd", paddingLeft: "1rem" }}
            >
                {/* ---------------- Columna Izquierda (booleans + arrays) ---------------- */}
                <div>
                    {/* BOOLEANS */}
                    {booleans.length > 0 && (
                        <div className="mb-4">
                            {/* <h4 className="font-semibold mb-2">Booleans</h4> */}
                            {booleans.map(({ key, val }) => (
                                <div key={key} className="mb-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={val}
                                            onChange={(e) =>
                                                handleBooleanChange([...path, key], e.target.checked)
                                            }
                                        />
                                        <span className="dark:text-slate-100">{key}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ARRAYS */}
                    {arrays.length > 0 && (
                        <div>
                            {/* <h4 className="font-semibold mb-2">Arrays</h4> */}
                            {arrays.map(({ key, val }) => (
                                <div key={key} className="mb-2">
                                    <p className="font-medium dark:text-slate-100">{key}:</p>
                                    <div className="flex flex-wrap gap-4 mt-1">
                                        {/* 
                      Supongamos que los valores permitidos para este array
                      son ["GENERAL", "ADMIN", "SUPERADMIN"].
                      Si en tu caso cambia según la propiedad, puedes añadir
                      más lógica para determinarlos.
                    */}
                                        {["GENERAL", "ADMIN", "SUPERADMIN"].map((possibleVal) => (
                                            <label
                                                key={possibleVal}
                                                className="flex items-center space-x-1"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={val.includes(possibleVal)}
                                                    onChange={(e) =>
                                                        handleArrayChange(
                                                            [...path, key],
                                                            possibleVal,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="dark:text-slate-100">{possibleVal}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ---------------- Columna Derecha (objetos anidados + fallback) ---------------- */}
                <div>
                    {/* Objetos anidados */}
                    {objects.length > 0 && (
                        <div>
                            {/* <h4 className="font-semibold mb-2">Objetos Anidados</h4> */}
                            {objects.map(({ key, val }) => (
                                <div key={key} className="border-b pb-2 mb-2">
                                    <div
                                        className="cursor-pointer font-medium text-lg"
                                        onClick={() => toggleSection(key)}
                                    >
                                        <p className="dark:text-slate-100">{key} {sectionOpen[key] ? "▼" : "▶"}</p>
                                    </div>
                                    {sectionOpen[key] && (
                                        <div className="pl-4">
                                            {renderPermissionsRecursively(val, [...path, key])}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fallback (por si hay string, number, u otro tipo) */}
                    {fallback.length > 0 && (
                        <div className="mt-4 bg-yellow-100 p-2 rounded">
                            {/* <h4 className="font-semibold">Otros Tipos</h4> */}
                            {fallback.map(({ key, val }) => (
                                <div key={key} className="text-red-600">
                                    {key}: {JSON.stringify(val)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Renderizar permisos a nivel raíz
    const renderPermissions = () => {
        if (!permissions || Object.keys(permissions).length === 0) {
            return <p className="text-gray-500">Sin permisos para mostrar</p>;
        }
        return <div>{renderPermissionsRecursively(permissions, [])}</div>;
    };

    // Verificar acceso
    if (!user?.permisos?.puedeModificarPermisos) {
        return (
            <p className="font-bold text-lime-900 text-lg">
                NO ACCESS, contacta al SUPERADMIN.
            </p>
        );
    }

    // Loading
    if (loading) {
        return <div className="text-center mt-4">Cargando roles{dots}</div>;
    }

    // UI
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 dark:text-slate-100">
                Panel de Permisos Globales (SUPERADMIN)
            </h1>

            {errorMsg && (
                <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                    {errorMsg}
                </div>
            )}

            {/* Selección de Rol */}
            <label htmlFor="selectRole" className="block mb-2 font-semibold dark:text-slate-100">
                Selecciona un rol:
            </label>
            <select
                id="selectRole"
                value={selectedRole}
                onChange={handleSelectRole}
                className="mb-4 p-2 border border-gray-300  rounded w-full md:w-1/2"
            >
                <option value="">-- Elige un rol --</option>
                {rolesData.map((item) => (
                    <option key={item.role} value={item.role}>
                        {item.role}
                    </option>
                ))}
            </select>

            {!selectedRole && <p className="dark:text-slate-100">Elige un rol para ver/editar sus permisos</p>}

            {selectedRole && (
                <div className="bg-white dark:bg-slate-700 p-4 border rounded shadow">
                    {renderPermissions()}
                    <div className="mt-4">
                        <button
                            onClick={handleUpdatePermissions}
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-800 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PermisosUsuarios;
