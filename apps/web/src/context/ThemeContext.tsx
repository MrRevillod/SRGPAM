import React from "react"

import { ConfigProvider, ThemeConfig } from "antd"
import { useEffect, createContext, useContext, useState, ReactNode } from "react"

const PRIMARY_GREEN = "#046c4e" as const

const BG_PRIMARY_DARK = "#1a202c" as const
const BG_SECONDARY_DARK = "#2d3748" as const

const BG_PRIMARY_LIGHT = "#FFF" as const

const TEXT_DARK = "#000" as const
const TEXT_LIGHT = "#FFF" as const

interface ThemeContextProps {
	isDarkMode: boolean
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const storedTheme = localStorage.getItem("isDarkMode")
		return storedTheme ? JSON.parse(storedTheme) : false
	})

	const toggleTheme = () => {
		setIsDarkMode((prev: boolean) => {
			const newTheme = !prev
			localStorage.setItem("isDarkMode", JSON.stringify(newTheme))
			return newTheme
		})
	}

	useEffect(() => {
		const body = document.body
		if (isDarkMode) {
			body.classList.add("dark")
		} else {
			body.classList.remove("dark")
		}
	}, [isDarkMode])

	const tokens: ThemeConfig = {
		token: {
			colorPrimary: PRIMARY_GREEN,
			colorBgBase: isDarkMode ? BG_PRIMARY_DARK : BG_PRIMARY_LIGHT,
			colorTextBase: isDarkMode ? TEXT_LIGHT : TEXT_DARK,
		},
	}

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			<ConfigProvider theme={tokens}>{children}</ConfigProvider>
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
