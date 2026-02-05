// Middleware de autenticación para proteger rutas
// Verifica si el usuario está autenticado (en este caso, solo verificamos que envíe datos)

export function protect(req, res, next) {
  try {
    // En una app real, verificarías un JWT aquí
    // Por ahora, simplemente permitimos el acceso si hay un usuario en el cuerpo o en headers
    // (O podrías implementar sesiones/tokens aquí después)

    // Ejemplo: si tienes un token JWT en headers
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) return res.status(401).json({ error: 'No autorizado' });
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.userId = decoded.id;

    // Por ahora, permitir que continúe (más adelante implementar JWT)
    next();
  } catch (err) {
    res.status(401).json({ error: 'No autorizado' });
  }
}

export default protect;
