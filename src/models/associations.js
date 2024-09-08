const Product = require('./Product');
const ProductOrder = require('./ProductOrder');
const OrderProducts = require('./OrderProducts');
const User = require('./User');
const Servicio = require('./Services');
const Role = require('./Role');

// Define associations para Product y ProductOrder
Product.belongsToMany(ProductOrder, { through: OrderProducts, as: 'productOrdersAssociation' });
ProductOrder.belongsToMany(Product, { through: OrderProducts, as: 'orderProductsAssociation' });
ProductOrder.belongsTo(User, { foreignKey: 'user_id', as: 'userOrderAssociation' }); 

// Define la asociación muchos a muchos entre User y Servicio
User.belongsToMany(Servicio, { through: 'UserServices', as: 'userServicesAssociation', foreignKey: 'userId' });
Servicio.belongsToMany(User, { through: 'UserServices', as: 'serviceUsersAssociation', foreignKey: 'serviceId' });

// Relación muchos a muchos entre User y Role
User.belongsToMany(Role, { through: 'user_roles', as: 'userRolesAssociation', foreignKey: 'userId' });
Role.belongsToMany(User, { through: 'user_roles', as: 'roleUsersAssociation', foreignKey: 'roleId' }); 

// Exportar los modelos con las asociaciones definidas
module.exports = { Product, ProductOrder, OrderProducts, User, Servicio, Role };
