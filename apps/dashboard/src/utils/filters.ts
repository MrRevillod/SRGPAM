import { Prisma } from "@prisma/client"

// Interface base para representar un query
interface Query {}

// type para representar un Record con las keys de una query
// y los valores de los filtros por cada entidad (por eso es generico T)
export type QueryMap<T> = { [K in keyof T]: (value: any) => any }

// Funcion para generar un where a partir de un query y un queryMap
// El Where es un objeto especial que se usa en prisma para filtrar.
export const generateWhere = <T extends Query>(query: T, queryMap: QueryMap<T>) => {
	const where = {} as Record<keyof T, any> // Inicializamos un objeto where vacio

	// Se itera sobre las keys del query ejemplo (?a=1&b=2) => { a: 1, b: 2 }
	Object.keys(query).forEach((key) => {
		// Se verifica si la key existe en el queryMap y de existir
		if (queryMap[key as keyof T]) {
			const filter = queryMap[key as keyof T](query[key as keyof T])
			if (filter !== null) where[key as keyof T] = filter
		}
		// se extrae el valor de la key y se aplica el filtro correspondiente
	})

	return where
}

// --- Filtro y Query para la entidad Evento ---

export interface EventQuery extends Query {
	professionalId?: string
	serviceId?: string
	centerId?: string
	seniorId?: string
}

export const eventSelect: Prisma.EventSelect = {
	id: true,
	startsAt: true,
	endsAt: true,
	assistance: true,
	seniorId: true,
	professionalId: true,
	serviceId: true,
	centerId: true,
	service: {
		select: { name: true, color: true },
	},
	center: {
		select: { name: true },
	},
}

// --- Filtro y Query para la entidad Profesional ---

export interface ProfessionalQuery extends Query {
	serviceId?: string
}

export const professionalSelect: Prisma.ProfessionalSelect = {
	id: true,
	name: true,
	email: true,
	password: false,
	serviceId: true,
	updatedAt: true,
	createdAt: true,
	service: { select: { title: true } },
}
