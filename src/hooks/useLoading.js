// hooks/useLoading.js
import { useEffect, useState } from "react";

export default function useLoading() {
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState("");

    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setDots((prev) => (prev.length === 3 ? "" : prev + "."));
            }, 300);
        } else {
            setDots("");
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    return {
        loading,
        setLoading,
        dots,
    };
}
