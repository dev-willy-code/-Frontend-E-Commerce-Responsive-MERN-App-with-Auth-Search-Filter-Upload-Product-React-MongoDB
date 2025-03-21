import { useState, useEffect } from "react";
import SummaryApi from ".";
import { toast } from "react-toastify";

const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    const fetchData = async () => {
        try {
            setLoadingRoles(true);
            const response = await fetch(SummaryApi.getRolesPermissions.url, {
                method: SummaryApi.getRolesPermissions.method,
                credentials: "include"
            });

            const dataResponse = await response.json();
            if (dataResponse.success) {
                const rolesOnly = dataResponse.data.map(item => item.role); // Extraer solo roles
                setRoles(rolesOnly);
            } else {
                toast.error(dataResponse.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingRoles(false);
        }
    };
    console.log(roles);
    useEffect(() => {
        fetchData();
    }, []);

    return { roles, loadingRoles };
};

export default useRoles;
