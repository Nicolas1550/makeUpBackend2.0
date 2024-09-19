const Product = require('./Product');
const ProductOrder = require('./ProductOrder');
const OrderProducts = require('./OrderProducts');
const User = require('./User');
const Servicio = require('./Services');
const Role = require('./Role');

// Asociaciones entre Product y ProductOrder a través de OrderProducts
Product.belongsToMany(ProductOrder, {
  through: OrderProducts,
  as: 'productOrdersAssociation',
  foreignKey: {
    name: 'ProductId',  // Nombre único para la clave foránea
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

ProductOrder.belongsToMany(Product, {
  through: OrderProducts,
  as: 'orderProductsAssociation',
  foreignKey: {
    name: 'ProductOrderId',  // Nombre único para la clave foránea
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Asociación entre ProductOrder y User
ProductOrder.belongsTo(User, {
  foreignKey: {
    name: 'user_id',  // Nombre ya definido en el modelo
    allowNull: false,
  },
  as: 'userOrderAssociation',
});

// Define la asociación muchos a muchos entre User y Servicio
User.belongsToMany(Servicio, {
  through: 'UserServices',
  as: 'userServicesAssociation',
  foreignKey: 'userId',
});

Servicio.belongsToMany(User, {
  through: 'UserServices',
  as: 'serviceUsersAssociation',
  foreignKey: 'serviceId',
});

// Relación muchos a muchos entre User y Role
User.belongsToMany(Role, {
  through: 'user_roles',
  as: 'userRolesAssociation',
  foreignKey: 'userId',
});

Role.belongsToMany(User, {
  through: 'user_roles',
  as: 'roleUsersAssociation',
  foreignKey: 'roleId',
});

module.exports = { Product, ProductOrder, OrderProducts, User, Servicio, Role };
