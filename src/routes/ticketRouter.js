const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model');
const { generateUniqueCode } = require('../utils/generateUniqueCode');

router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await Cart.findById(cartId).populate('products.product');
  const productsNotProcessed = [];
  let totalAmount = 0;

  for (const item of cart.products) {
    const product = item.product;
    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      await product.save();
      totalAmount += product.price * item.quantity;
    } else {
      productsNotProcessed.push(product._id);
    }
  }

  if (productsNotProcessed.length > 0) {
    cart.products = cart.products.filter(item => productsNotProcessed.includes(item.product._id));
    await cart.save();
    return res.json({ message: 'Some products could not be processed', productsNotProcessed });
  }

  const ticket = new Ticket({
    code: generateUniqueCode(),
    amount: totalAmount,
    purchaser: req.user.email
  });

  await ticket.save();
  await Cart.findByIdAndDelete(cartId);

  res.json({ message: 'Purchase completed', ticket });
});

module.exports = router;