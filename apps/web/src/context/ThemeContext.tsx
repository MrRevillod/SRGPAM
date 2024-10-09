import React from "react"

import { ThemeConfig } from "antd"
import { ConfigProvider } from "antd"
import { useEffect, createContext, useContext, useState, ReactNode } from "react"

const PRIMARY_GREEN = "#046c4e" as const
const PRIMARY_DARK = "#1a202c" as const
const PRIMARY_LIGHT = "#FFF" as const

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

	const antDToken: ThemeConfig = {
		token: {
			colorPrimary: PRIMARY_GREEN,
			colorBgBase: isDarkMode ? PRIMARY_DARK : PRIMARY_LIGHT,
			colorTextBase: isDarkMode ? TEXT_LIGHT : TEXT_DARK,
		},
	}

	useEffect(() => {
		const body = document.body
		if (isDarkMode) {
			body.classList.add("dark")
		} else {
			body.classList.remove("dark")
		}
	}, [isDarkMode])

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			<ConfigProvider theme={antDToken}>{children}</ConfigProvider>
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error("useTheme debe ser usado dentro de un ThemeProvider")
	}
	return context
}
