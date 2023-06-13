const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: { type: String, required: false },
	description: { type: String, required: false },
    img: { type: String, required: false },
    price: { type: String, required: false },
    qty: { type: String, required: false },
	// completed: Boolean,
});


const product = mongoose.model('product', productSchema);

module.exports = product;