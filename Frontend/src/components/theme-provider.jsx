import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext()

export function ThemeProvider({
    children,
    defaultTheme = "zinc",
    defaultMode = "system",
    storageKey = "vite-ui-theme",
    storageModeKey = "vite-ui-mode",
}) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    )
    const [mode, setMode] = useState(
        () => localStorage.getItem(storageModeKey) || defaultMode
    )
    const [radius, setRadius] = useState(
        () => localStorage.getItem("vite-ui-radius") || "0.5"
    )

    useEffect(() => {
        const root = window.document.documentElement

        // Remove old theme classes
        root.classList.remove("light", "dark")
        const allThemes = [
            "theme-zinc", "theme-rose", "theme-blue", "theme-green", "theme-orange",
            "theme-red", "theme-violet", "theme-yellow", "theme-indigo", "theme-cyan",
            "theme-lime", "theme-fuchsia", "theme-slate", "theme-stone", "theme-neutral", "theme-gray"
        ]
        root.classList.remove(...allThemes)

        // Apply Mode
        if (mode === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"
            root.classList.add(systemTheme)
        } else {
            root.classList.add(mode)
        }

        // Apply Theme Color
        if (theme !== "zinc") {
            root.classList.add(`theme-${theme}`)
        }

        // Apply Radius
        root.style.setProperty("--radius", `${radius}rem`)

    }, [theme, mode, radius])

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
        },
        mode,
        setMode: (newMode) => {
            localStorage.setItem(storageModeKey, newMode)
            setMode(newMode)
        },
        radius,
        setRadius: (newRadius) => {
            localStorage.setItem("vite-ui-radius", newRadius)
            setRadius(newRadius)
        }
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
