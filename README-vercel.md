# Despliegue en Vercel: Tienda de Motociclismo

## 1. Pre-requisitos

- Tener cuenta en Vercel (https://vercel.com)
- Tener el proyecto en un repositorio Git (GitHub, GitLab, Bitbucket)
- Tener acceso a MongoDB Atlas y el string de conexión

## 2. Estructura del proyecto

- Frontend: React + Vite
- Backend: Rutas serverless en `/api` (Express adaptado)

## 3. Configuración de variables de entorno

1. Copia `.env.example` como `.env` y pon tu string de conexión de MongoDB Atlas:
   ```
   MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/tienda_motociclismo?retryWrites=true&w=majority
   ```
2. En Vercel, ve a Settings > Environment Variables y agrega:
   - `MONGO_URI` con el valor de tu string de conexión

## 4. Despliegue

1. Sube el proyecto a tu repositorio Git.
2. Entra a Vercel y haz click en "New Project".
3. Selecciona el repositorio y sigue los pasos.
4. Vercel detectará automáticamente Vite y las rutas `/api`.
5. Espera a que termine el build y prueba tu sitio.

## 5. Google Analytics

- El script ya está agregado en `index.html`. Solo reemplaza `G-XXXXXXXXXX` por tu ID real de Google Analytics.

## 6. Probar endpoints

- Las rutas serverless estarán disponibles en `/api/usuarios`, `/api/productos`, `/api/categorias`, `/api/carrito`, `/api/auth`.

## 7. Notas

- Si tienes archivos grandes en `/public/images`, considera usar almacenamiento externo.
- El backend local ya no es necesario, todo funciona en Vercel.

## 8. Soporte

- Si tienes errores de conexión, revisa la variable `MONGO_URI` y que tu IP esté permitida en MongoDB Atlas.
- Para dudas, consulta la documentación oficial de Vercel y MongoDB Atlas.

---

¡Listo para desplegar tu tienda en Vercel!
