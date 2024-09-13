import React from "react"

import { Link } from "react-router-dom"
import { Avatar, Dropdown, Navbar } from "flowbite-react"

const Header: React.FC = () => {
	return (
		<Navbar fluid rounded className="pt-4">
			<Navbar.Brand>
				<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SRGPAM</span>
			</Navbar.Brand>
			<div className="flex md:order-2">
				<Dropdown
					arrowIcon={false}
					inline
					label={
						<Avatar
							alt="User settings"
							img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
							rounded
						/>
					}
				>
					<Dropdown.Header>
						<span className="block text-sm">Bonnie Green</span>
						<span className="block truncate text-sm font-medium">name@flowbite.com</span>
					</Dropdown.Header>

					<Link to="/dashboard/perfil">
						<Dropdown.Item>Mi perfíl</Dropdown.Item>
					</Link>

					<Dropdown.Divider />
					<Dropdown.Item>Sign out</Dropdown.Item>
				</Dropdown>
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Link to="/dashboard/administradores">
					<Navbar.Link active>Administradores</Navbar.Link>
				</Link>

				<Link to="/dashboard/adultos-mayores">
					<Navbar.Link>Adultos mayores</Navbar.Link>
				</Link>

				<Link to="/dashboard/eventos">
					<Navbar.Link>Eventos</Navbar.Link>
				</Link>

				<Link to="/dashboard/estadisticas">
					<Navbar.Link>Estadisticas</Navbar.Link>
				</Link>
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Header
