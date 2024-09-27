const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { query } = require('./db'); 
require('dotenv').config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const [user] = await query(`
          SELECT u.id, u.nombre, u.email
          FROM users u
          WHERE u.id = ?
        `, [jwt_payload.sub]);

        if (user) {
          const roles = await query(`
            SELECT r.id, r.nombre
            FROM roles r
            JOIN user_roles ur ON r.id = ur.RoleId
            WHERE ur.UserId = ?
          `, [jwt_payload.sub]);

          const plainUser = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rolesAssociation: roles.map(role => ({ id: role.id, nombre: role.nombre })) // Asocia los roles aquí
          };

          return done(null, plainUser); 
        } else {
          return done(null, false); 
        }
      } catch (err) {
        return done(err, false); 
      }
    }
  )
);

module.exports = passport;
