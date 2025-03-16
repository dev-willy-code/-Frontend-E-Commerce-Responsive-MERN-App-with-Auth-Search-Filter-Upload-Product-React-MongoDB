
// PermisosActuales.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import useLoading from "../hooks/useLoading";

function PermisosActuales() {
    const user = useSelector((state) => state.user.user);

    // Estados
    const [sectionOpen, setSectionOpen] = useState({});

    console.log("user information(redux): ", user);

    // Toggle accordion
    const toggleSection = (sectionName) => {
        setSectionOpen((prev) => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
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
                                        {val ? (
                                            <span className="text-green-500 font-bold text-lg">✔</span>
                                        ) : (
                                            <span className="text-red-500 font-bold text-lg">✖</span>
                                        )}
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

                                        {["GENERAL", "ADMIN", "SUPERADMIN"].map((possibleVal) => (
                                            <label
                                                key={possibleVal}
                                                className="flex items-center space-x-1"
                                            >
                                                {val.includes(possibleVal) ? (
                                                    <span className="text-green-500 font-bold text-lg">✔</span>
                                                ) : (
                                                    <span className="text-red-500 font-bold text-lg">✖</span>
                                                )}
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
                                        className="cursor-pointer font-medium text-lg dark:text-slate-100"
                                        onClick={() => toggleSection(key)}
                                    >
                                        {key} {sectionOpen[key] ? "▼" : "▶"}
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
        if (!user?.permisos || Object.keys(user?.permisos).length === 0) {
            return <p className="text-gray-500 dark:text-slate-100">Sin permisos para mostrar</p>;
        }
        return <div>{renderPermissionsRecursively(user?.permisos, [])}</div>;
    };



    // UI
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 dark:text-slate-100">
                Panel de Permisos Globales (SUPERADMIN)
            </h1>


            {renderPermissions()}

        </div>
    );
}

export default PermisosActuales;
