const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const mongoose = require('mongoose');

const csrf = require('csurf');
const flash = require('connect-flash');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //yields a constructor function MongoDBStore()

const User = require('./models/user');
const errorController = require('./controllers/error');


const MONGODB_URI = ''; //MongoDB API Key

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfTokenMachine = csrf();

const fileStorage = multer.diskStorage({  //store images directly on to the server
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, (Math.random() * 11111)  + file.originalname )
  }
})

const fileFilter = (req, file, cb) => { //set file/image upload filter
  if(file.mimetype === 'image/png' ||
     file.mimetype === 'image/jpg' ||
     file.mimetype === 'image/jpeg')
    cb(null, true)
  else
    cb(null, false)
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image')); //name field in form is 'image'
app.use(express.static(path.join(__dirname, 'public'))); //static serves files as if they were accessed from the root directory
app.use('/images', express.static(path.join(__dirname, 'images'))); //path '/images' must be specified, because that's how image paths are stored in file.path
app.use(session({secret: 'a secret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfTokenMachine);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {

      if(!user)
        return next();

      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err)
    });
});

//MIddelware must be registered after session is created
app.use((req, res, next) => {

  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get505);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(3030);
  })
  .catch(err => {
    console.log(err);
  });


//SEQUELIZE
//Declare associations
// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); //CASCADE drops prodcut related to User
// User.hasMany(Product); //lends a Sequelize.createProduct() method through the 1 to many relation
// User.hasOne(Cart);
// Crypto.belongsTo(User);
// Cart.belongsToMany(Product, {through: CartItem}); //through defines the model which stores the
// Product.belongsToMany(Cart, {through: CartItem}); //intermediate data between the tables, thus Product IDs and cart IDs
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

//syncs your models to the database by creating associated tables and relations
// sequelize.sync({force: true})

// .then(result => {
//     //console.log(result);
//     app.listen(3000);
// })
// .catch(err => console.log(err)) 


