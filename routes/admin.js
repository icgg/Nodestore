const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middelware/is-auth');
const { body } = require('express-validator');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => GET
router.post(
    '/add-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('imageUrl'),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postAddProduct
  ); //multiple arguments denote sequence of Middelwares

// // /admin/products => GET
 router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
 router.post('/add-product', isAuth, adminController.postAddProduct); 

 router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);  //productId correlates to the controller

 router.post(
    '/edit-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postEditProduct
  );

 router.delete('/product/:productId', isAuth, adminController.deleteProduct);

 module.exports = router;
