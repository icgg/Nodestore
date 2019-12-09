const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middelware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

 router.get('/products', shopController.getProducts);

 router.get('/products/:productId', shopController.getProduct); //productId correlates to the controller

 router.get('/cart', isAuth, shopController.getCart);

 router.post('/cart', isAuth, shopController.postCart);

 router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

 router.post('/create-order', isAuth, shopController.postOrder);

 router.get('/orders', isAuth, shopController.getOrders);

 router.get('/orders/:orderId', isAuth, shopController.getInvoice);

 router.get('/checkout', isAuth, shopController.getCheckout);

 

module.exports = router;
