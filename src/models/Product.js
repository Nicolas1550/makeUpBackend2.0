const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: false },
  quantity: { type: Number, required: true },
  imageFileName: { type: String, required: false }
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete ret._id; }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
