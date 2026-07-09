import { useState, useEffect } from "react";
export function useTheme() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("sv-theme");
        return saved ?? "dark";
    });
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("sv-theme", theme);
    }, [theme]);
    const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
    return { theme, toggle };
}
