import React, { useState } from "react"
import { Link } from "react-router-dom"

import { Menu } from "antd"
import type { MenuProps } from "antd"
import { HomeOutlined, AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons"

const items = [
	{
		label: <Link to="/">Home</Link>,
		key: "home",
		icon: <HomeOutlined />,
	},
	{
		label: <Link to="/dashboard/seniors">Seniors</Link>,
		key: "seniors",
		icon: <MailOutlined />,
	},
	{
		label: <Link to="/dashboard/administrator">Administrator</Link>,
		key: "administrator",
		icon: <AppstoreOutlined />,
	},
	{
		label: "More Options",
		key: "submenu",
		icon: <SettingOutlined />,
		children: [
			{
				type: "group",
				label: "Group 1",
				children: [
					{ label: "Option 1", key: "setting:1" },
					{ label: "Option 2", key: "setting:2" },
				],
			},
			{
				type: "group",
				label: "Group 2",
				children: [
					{ label: "Option 3", key: "setting:3" },
					{ label: "Option 4", key: "setting:4" },
				],
			},
		],
	},
	{
		key: "external",
		label: (
			<a href="https://ant.design" target="_blank" rel="noopener noreferrer">
				External Link
			</a>
		),
	},
]

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [current, setCurrent] = useState("mail")

	const onClick: MenuProps["onClick"] = (e) => {
		console.log("click ", e)
		setCurrent(e.key)
	}
	return (
		<div>
			<Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
			<main>{children}</main>
		</div>
	)
}

export default Layout
