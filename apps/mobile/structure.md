# Estructura del Proyecto

Este proyecto está configurado utilizando Expo Router y Expo Navigation para la navegación de la aplicación. A continuación se describe la estructura de carpetas y archivos del proyecto.

## Estructura de Carpetas

### `/app`
Esta carpeta contiene las rutas principales de la aplicación, organizadas de acuerdo a la convención de `Expo Router`.

- **`_layout.tsx`**: Define el layout principal de la aplicación y maneja la navegación de alto nivel. Este archivo es responsable de organizar las diferentes rutas y establecer la estructura base.
  
- **`index.tsx`**: Es el punto de entrada de la aplicación. Define lo que se muestra en la ruta raíz (`/`).

- **`(tabs)`**: Este directorio agrupa las rutas que forman parte de las tabs de la aplicación.
  - **`_layout.tsx`**: Define el layout específico para las tabs, organizando las rutas bajo este grupo.
  - **`index.tsx`**: Define el contenido de la tab principal.
  
- **`+html.tsx`**: Puede estar relacionado con la configuración de rutas especiales o manejo de errores en la aplicación.
- **`_not-found.tsx`**: Define lo que se muestra cuando el usuario navega a una ruta que no existe (404 Not Found).

### `/assets`
Contiene recursos estáticos como fuentes, imágenes, y otros archivos multimedia.

- **`fonts`**: Carpeta destinada para las fuentes personalizadas.
- **`images`**: Contiene las imágenes utilizadas en la aplicación.

### `/components`
Carpeta para componentes reutilizables que se usan en varias partes de la aplicación.

### `/constants`
Define valores constantes que se utilizan en toda la aplicación, como colores, tamaños de fuente, etc.

- **`Colors.ts`**: Archivo que contiene definiciones de colores utilizados en la aplicación.

### `/hooks`
Almacena hooks personalizados (`custom hooks`) que encapsulan lógica reutilizable en la aplicación.

### `/services`
Contiene la lógica de interacción con servicios externos, como API calls o WebSocket.

- **`axios.ts`**: Configuración de Axios para realizar solicitudes HTTP a APIs.
- **`socket.ts`**: Configuración y manejo de Socket.io para comunicación en tiempo real.

### `/store`
Contiene la configuración y gestión del estado global de la aplicación, utilizando herramientas como Zustand.

- **`userStore.ts`**: Almacena y gestiona el estado del usuario en la aplicación.

### `/utils`
Almacena funciones de utilidad y helper methods que se utilizan en varias partes de la aplicación.

- **`storage.ts`**: Maneja la interacción con AsyncStorage o SecureStorage.
- **`validation.ts`**: Define validaciones utilizando Zod u otras librerías.

## Archivos Raíz

- **`app.json`**: Configuración del proyecto Expo.
- **`babel.config.js`**: Configuración de Babel para transpilar el código.
- **`tsconfig.json`**: Configuración de TypeScript para el proyecto.
- **`package.json`**: Lista de dependencias y scripts del proyecto.
- **`.gitignore`**: Especifica los archivos y carpetas que deben ser ignorados por Git.

---

Esta estructura está diseñada para mantener el código modular y organizado, facilitando el desarrollo y la escalabilidad del proyecto.
