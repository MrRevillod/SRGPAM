import React from "react"
import { Show } from "./Show"
import { useAuth } from "../../context/AuthContext"
import { API_URL } from "../../lib/axios"
import { Link, redirect } from "react-router-dom"
import { Avatar, Dropdown, Navbar } from "flowbite-react"

const Header: React.FC = () => {
	const { isAuthenticated, user, logout } = useAuth()

	const [imageSrc, setImageSrc] = React.useState<string>(
		`${API_URL}/storage/public/users/${user?.id}/${user?.id}.webp`,
	)

	const handleImageError = () => {
		setImageSrc(`${API_URL}/storage/public/users/default-profile.webp`)
	}

	const logoutHandler = async () => {
		await logout()
		return redirect("/auth/login")
	}

	const linkClasses = `text-neutral-200 font-base hover:text-neutral-50`

	return (
		<Navbar fluid className="pt-5 h-20 w-full bg-green-700 rounded-none">
			<Navbar.Brand className="ml-14">
				<img src="/logo-white.webp" alt="logo" width="60" />
			</Navbar.Brand>

			<Show when={isAuthenticated && user !== null}>
				<div className="flex md:order-2 mr-14">
					<Dropdown
						arrowIcon={false}
						inline
						label={<Avatar alt="User settings" img={imageSrc} onError={handleImageError} rounded />}
					>
						<Dropdown.Header>
							<span className="block text-sm">{user?.name}</span>
							<span className="block truncate text-sm font-medium">{user?.email}</span>
						</Dropdown.Header>
						<Link to="/perfil">
							<Dropdown.Item>Mi perfíl</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={() => logoutHandler()}>Cerrar sesión</Dropdown.Item>
					</Dropdown>
					<Navbar.Toggle />
				</div>
				<Navbar.Collapse className="-ml-4">
					<Dropdown
						label=""
						dismissOnClick={false}
						renderTrigger={() => <span className={`${linkClasses} cursor-pointer`}>Usuarios</span>}
					>
						<Link to="/dashboard/administradores" className={linkClasses}>
							<Dropdown.Item>Administradores</Dropdown.Item>
						</Link>

						<Link to="/dashboard/profesionales" className={linkClasses}>
							<Dropdown.Item>Profesionales</Dropdown.Item>
						</Link>

						<Dropdown.Item>
							<Dropdown
								label=""
								placement="right-start"
								dismissOnClick={false}
								renderTrigger={() => (
									<span className={`cursor-pointer text-neutral-900`}>Personas Mayores</span>
								)}
								className="w-48"
							>
								<Link to="/dashboard/personas-mayores">
									<Dropdown.Item as="div">Todos</Dropdown.Item>
								</Link>

								<Link to="/dashboard/personas-mayores/nuevos">
									<Dropdown.Item as="div">Solicitudes de registro</Dropdown.Item>{" "}
								</Link>
							</Dropdown>
						</Dropdown.Item>
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
