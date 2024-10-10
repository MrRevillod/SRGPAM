import React from "react"

import { ThemeConfig } from "antd"
import { ConfigProvider } from "antd"
import { useEffect, createContext, useContext, useState, ReactNode } from "react"

const PRIMARY_GREEN = "#046c4e" as const

const BG_PRIMARY_DARK = "#1a202c" as const
const BG_SECONDARY_DARK = "#2d3748" as const

const BG_PRIMARY_LIGHT = "#FFF" as const

const TEXT_DARK = "#2d3748" as const
const TEXT_LIGHT = "#f7fafc" as const

interface ThemeContextProps {
	isDarkMode: boolean
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false)

	const toggleTheme = () => {
		setIsDarkMode((prev) => !prev)
	}

	useEffect(() => {
		const body = document.body
		if (isDarkMode) {
			body.classList.add("dark")
		} else {
			body.classList.remove("dark")
		}
	}, [isDarkMode])

	return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error("useTheme debe ser usado dentro de un ThemeProvider")
	}
	return context
}
