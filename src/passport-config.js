const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/User');
const Role = require('./models/Role'); 
require('dotenv').config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        // Incluye la asociación con los roles
        const user = await User.findByPk(jwt_payload.sub, {
          attributes: ['id', 'nombre', 'email'], 
          include: [{
            model: Role,
            as: 'rolesAssociation', 
            attributes: ['id', 'nombre'], 
            through: { attributes: [] }, 
          }],
        });

        if (user) {
          const plainUser = user.toJSON(); 
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
