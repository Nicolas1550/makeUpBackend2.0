const Product = require('./Product');
const ProductOrder = require('./ProductOrder');
const OrderProducts = require('./OrderProducts');
const User = require('./User');
const Servicio = require('./Services');
const Role = require('./Role');

// Define asociaciones para Product y ProductOrder (muchos a muchos a través de OrderProducts)
Product.belongsToMany(ProductOrder, { through: OrderProducts, as: 'productOrdersAssociation' });
ProductOrder.belongsToMany(Product, { through: OrderProducts, as: 'orderProductsAssociation' });

// Define relación uno a muchos entre ProductOrder y User
ProductOrder.belongsTo(User, { as: 'userOrderAssociation' }); // Elimina foreignKey para permitir a Sequelize manejarlo

// Define la asociación muchos a muchos entre User y Servicio sin foreignKey explícitas
User.belongsToMany(Servicio, { through: 'UserServices', as: 'userServicesAssociation' });
Servicio.belongsToMany(User, { through: 'UserServices', as: 'serviceUsersAssociation' });

// Relación muchos a muchos entre User y Role sin foreignKey explícitas
User.belongsToMany(Role, { through: 'user_roles', as: 'userRolesAssociation' });
Role.belongsToMany(User, { through: 'user_roles', as: 'roleUsersAssociation' });

// Exportar los modelos con las asociaciones definidas
module.exports = { Product, ProductOrder, OrderProducts, User, Servicio, Role };
