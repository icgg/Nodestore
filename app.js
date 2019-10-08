const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Declare associations
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); //CASCADE drops prodcut related to User
User.hasMany(Product); //lends a Sequelize.createProduct() method through the 1 to many relation
User.hasOne(Cart);
Crypto.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem}); //through defines the model which stores the
Product.belongsToMany(Cart, {through: CartItem}); //intermediate data between the tables, thus Product IDs and cart IDs
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//syncs your models to the database by creating associated tables and relations
sequelize.sync({force: true})

.then(result => {
    //console.log(result);
    app.listen(3000);
})
.catch(err => console.log(err)) 


