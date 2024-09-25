import React from "react"
import { Link, redirect } from "react-router-dom"
import { Avatar, Dropdown, Navbar } from "flowbite-react"
import { useAuth } from "../../context/AuthContext"
import { Show } from "./Show"

const Header: React.FC = () => {
	const { isAuthenticated, user, logout } = useAuth()

	const logoutHandler = async () => {
		await logout()
		return redirect("/auth/login")
	}

	const linkClasses = `text-neutral-200 font-base hover:text-neutral-50`

	return (
		<Navbar fluid className="pt-5 h-20 w-full bg-green-700 rounded-none">
			<Navbar.Brand className="ml-14">
				<img src="/logo.png" alt="logo" width="60" />
			</Navbar.Brand>

			<Show when={isAuthenticated && user !== null}>
				<div className="flex md:order-2 mr-14">
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
						<Dropdown.Item onClick={() => logoutHandler()}>Cerrar sesión</Dropdown.Item>
					</Dropdown>
					<Navbar.Toggle />
				</div>
				<Navbar.Collapse className="-ml-4">
					<Link to="/dashboard/administradores" className={linkClasses}>
						Administradores
					</Link>

					<Link to="/dashboard/profesionales" className={linkClasses}>
						Profesionales
					</Link>

					<Dropdown
						label=""
						dismissOnClick={false}
						renderTrigger={() => <span className={`${linkClasses} cursor-pointer`}>Adultos Mayores</span>}
					>
						<Link to="/dashboard/adultos-mayores">
							<Dropdown.Item>Todos</Dropdown.Item>
						</Link>

						<Link to="/dashboard/adultos-mayores/nuevos">
							<Dropdown.Item>Solicitudes de registro</Dropdown.Item>
						</Link>
					</Dropdown>

					<Link to="/dashboard/eventos" className={linkClasses}>
						Eventos
					</Link>

					<Link to="/dashboard/servicios" className={linkClasses}>
						Servicios
					</Link>

					<Link to="/dashboard/centros-de-atencion" className={linkClasses}>
						Centros de atención
					</Link>

					<Link to="/dashboard/estadisticas" className={linkClasses}>
						Estadisticas
					</Link>
				</Navbar.Collapse>
			</Show>
		</Navbar>
	)
}

export default Header
