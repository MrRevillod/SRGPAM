
# Flujo de Trabajo con Git

## 1. Ramas Principales

- **main**: Contiene el código estable y en producción. No se realizan cambios directos en esta rama.  
- **develop**: Rama principal de desarrollo, donde se integran todas las funcionalidades antes de una liberación.

## 2. Ramas Temporales

- **feature/[short-description]**: Para el desarrollo de nuevas funcionalidades. Se crea a partir de develop y se fusiona de vuelta a develop cuando está completa.

- **fix/[short-description]**: Para corregir errores. Se crea a partir de develop (o main en casos urgentes) y se fusiona de vuelta cuando se soluciona el problema.

## 3. Flujo de Trabajo

Crea una nueva rama desde develop para trabajar en una funcionalidad o corrección de errores.

```bash
git checkout -b feature/login-page
```

asldjaslkdjsalkdj

Realiza los cambios y prueba la funcionalidad en tu rama.  
Realiza commits regulares con mensajes descriptivos.

```bash
git commit -m "Agregar página de inicio de sesión"
```

Cuando la funcionalidad esté completa y probada, haz un pull request para fusionar tu rama en develop.  
Asegúrate de que alguien revise tu código antes de fusionarlo.


Después de que la rama se haya fusionado, elimínala tanto local como remotamente.  

```bash
git branch -d feature/login-page
git push origin --delete feature/login-page
```

## 4. Revisión de Código

Utiliza pull requests para que otros miembros del equipo revisen y aprueben los cambios antes de fusionarlos.
