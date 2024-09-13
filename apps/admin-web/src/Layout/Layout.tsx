import React, { useState } from "react"
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, MailOutlined, AppstoreOutlined } from "@ant-design/icons"
import { Button, Layout, Menu, theme } from "antd"
import { Link } from "react-router-dom"

const { Header, Sider, Content } = Layout

interface SidebarLayoutProps {
	children: React.ReactNode
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false)
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className="demo-logo-vertical" />
				<Menu
					// style={{ backgroundColor: "#0A680A" }}
					theme="dark"
					mode="inline"
					defaultSelectedKeys={["home"]}
					items={[
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
					]}
				/>
			</Sider>
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: "16px",
							width: 64,
							height: 64,
						}}
					/>
				</Header>
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	)
}

export default SidebarLayout
