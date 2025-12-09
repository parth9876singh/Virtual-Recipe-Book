import { Moon, Sun, Check, Settings2, X } from "lucide-react"
import { useTheme } from "./theme-provider"
import { cn } from "../lib/utils"
import { useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme, mode, setMode } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    const themes = [
        { name: "zinc", color: "bg-zinc-900" },
        { name: "red", color: "bg-red-500" },
        { name: "rose", color: "bg-rose-500" },
        { name: "orange", color: "bg-orange-500" },
        { name: "green", color: "bg-green-500" },
        { name: "blue", color: "bg-blue-500" },
        { name: "yellow", color: "bg-yellow-500" },
        { name: "violet", color: "bg-violet-500" },
        { name: "indigo", color: "bg-gradient-to-br from-indigo-500 to-purple-600" },
        { name: "cyan", color: "bg-gradient-to-br from-cyan-400 to-blue-500" },
        { name: "lime", color: "bg-gradient-to-br from-lime-400 to-green-500" },
        { name: "fuchsia", color: "bg-gradient-to-br from-fuchsia-500 to-pink-500" },
    ]

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-1/2 right-0 -translate-y-1/2 z-[100] p-3 bg-primary text-primary-foreground rounded-l-xl shadow-lg hover:pr-4 transition-all hover:shadow-primary/25 group"
                    aria-label="Open Theme Customizer"
                >
                    <Settings2 className="w-5 h-5 animate-spin-slow group-hover:rotate-90 transition-transform" />
                </button>
            )}

            {/* Customizer Panel */}
            <div
                className={cn(
                    "fixed top-4 right-4 z-[100] p-4 bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-2xl flex flex-col gap-4 w-72 transition-all duration-300 origin-right",
                    isOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-8 pointer-events-none"
                )}
            >
                <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm font-semibold">Theme Customizer</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setMode("light")}
                        className={cn(
                            "flex-1 p-1.5 rounded-md transition-all hover:bg-background/50 flex items-center justify-center",
                            mode === "light" && "bg-background text-foreground shadow-sm"
                        )}
                        title="Light Mode"
                    >
                        <Sun className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setMode("system")}
                        className={cn(
                            "flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all hover:bg-background/50 flex items-center justify-center",
                            mode === "system" && "bg-background text-foreground shadow-sm"
                        )}
                        title="System Mode"
                    >
                        Auto
                    </button>
                    <button
                        onClick={() => setMode("dark")}
                        className={cn(
                            "flex-1 p-1.5 rounded-md transition-all hover:bg-background/50 flex items-center justify-center",
                            mode === "dark" && "bg-background text-foreground shadow-sm"
                        )}
                        title="Dark Mode"
                    >
                        <Moon className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Color</span>
                        <div className="grid grid-cols-4 gap-2">
                            {themes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => setTheme(t.name)}
                                    className={cn(
                                        "group relative flex h-9 w-full items-center justify-center rounded-md border-2 border-muted transition-all hover:scale-105 active:scale-95",
                                        theme === t.name ? "border-primary" : "hover:border-primary/50"
                                    )}
                                    title={t.name}
                                >
                                    <span className={cn("h-6 w-6 rounded-full shadow-sm", t.color)} />
                                    {theme === t.name && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
