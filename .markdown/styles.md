
# Guía para Utilizar CSS Vanilla en React

## 1. Estructura de Carpetas
- **Global Styles:** Mantén los estilos globales en un archivo separado, como `global.css`.
- **Component-Specific Styles:** Crea un archivo CSS para cada componente, ubicado en la misma carpeta que el componente. Ejemplo:

```
src/  
└── components/  
    ├── Button/  
    │   ├── Button.tsx  
    │   └── Button.css  
    └── Navbar/  
        ├── Navbar.tsx  
        └── Navbar.css  
```

## 2. Modularidad
- Importa el archivo CSS correspondiente dentro de cada componente para mantener los estilos encapsulados.
```jsx
import './Button.css';

function Button() {
  return <button className="btn-primary">Click me</button>;
}
```

## 3. Convención de Nombres: BEM (Block, Element, Modifier)

- Block: Representa el componente principal.
- Element: Representa un subcomponente o parte del bloque.
- Modifier: Representa una variación del bloque o elemento.

```css

/* Block: Button */
.btn {
  /* estilos */
}

/* Element: Icon dentro del Button */
.btn__icon {
  /* estilos */
}

/* Modifier: Button en estado primario */
.btn--primary {
  /* estilos */
}

```