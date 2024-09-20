const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { query } = require('./db'); // Usa la conexión directa a la base de datos
require('dotenv').config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        // Consulta para obtener el usuario por su ID
        const [user] = await query(`
          SELECT u.id, u.nombre, u.email
          FROM users u
          WHERE u.id = ?
        `, [jwt_payload.sub]);

        if (user) {
          // Consulta para obtener los roles del usuario
          const roles = await query(`
            SELECT r.id, r.nombre
            FROM roles r
            JOIN user_roles ur ON r.id = ur.RoleId
            WHERE ur.UserId = ?
          `, [jwt_payload.sub]);

          // Asegurarse de que siempre existe la propiedad rolesAssociation en req.user
          const plainUser = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rolesAssociation: roles.map(role => ({ id: role.id, nombre: role.nombre })) // Asocia los roles aquí
          };

          return done(null, plainUser); // Retorna el usuario con los roles
        } else {
          return done(null, false); // Si el usuario no es encontrado
        }
      } catch (err) {
        return done(err, false); // Error en la consulta
      }
    }
  )
);

module.exports = passport;
