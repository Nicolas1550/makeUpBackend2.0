const Product = require('./Product');
const ProductOrder = require('./ProductOrder');
const OrderProducts = require('./OrderProducts');
const User = require('./User');
const Servicio = require('./Services');
const Role = require('./Role');
const UserServices = require('./UserServices'); // Asegúrate de que el modelo UserServices esté definido

// Define asociaciones para Product y ProductOrder (relación muchos a muchos a través de OrderProducts)
Product.belongsToMany(ProductOrder, { through: OrderProducts, as: 'productOrdersAssociation', foreignKey: 'ProductId' });
ProductOrder.belongsToMany(Product, { through: OrderProducts, as: 'orderProductsAssociation', foreignKey: 'ProductOrderId' });

// Define relación uno a muchos entre ProductOrder y User
ProductOrder.belongsTo(User, { foreignKey: 'user_id', as: 'userOrderAssociation' });

// Define la asociación muchos a muchos entre User y Servicio usando la tabla "UserServices"
User.belongsToMany(Servicio, { through: UserServices, as: 'userServicesAssociation', foreignKey: 'UserId' });
Servicio.belongsToMany(User, { through: UserServices, as: 'serviceUsersAssociation', foreignKey: 'ServicioId' });

// Define la relación muchos a muchos entre User y Role usando la tabla "user_roles"
User.belongsToMany(Role, { through: 'user_roles', as: 'userRolesAssociation', foreignKey: 'userId' });
Role.belongsToMany(User, { through: 'user_roles', as: 'roleUsersAssociation', foreignKey: 'roleId' });

// Exportar los modelos con las asociaciones definidas
module.exports = { Product, ProductOrder, OrderProducts, User, Servicio, Role, UserServices };
