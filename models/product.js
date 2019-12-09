const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl:{
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', //references the User model, specifying that id is a user id
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema);
//arguments, name of entity, Object model
















//RAW MONGO DB

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product{
//   constructor(title, price, description, imageUrl, id, userId){
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null; //creates a new mongoDB id if an id is given to the constructor
//     this.userId = userId;
//   }


//     save(){
//       const db = getDb();
//       let dbOp;
//       if (this._id) {
//         // Update the product
//         dbOp = db
//           .collection('products')
//           .updateOne({ _id: this._id }, { $set: this });
//       } else {
//         dbOp = db.collection('products').insertOne(this);
//       }
//       return dbOp
//         .then(result => {
//           console.log(result);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }

//     static fetchAll(){
//       const db = getDb();
//       return db.collection('products').find().toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(err => console.log(err))
//     }

//     static findById(prodId) {
//       const db = getDb();
//       return db
//         .collection('products')
//         .find({ _id: new mongodb.ObjectId(prodId) })
//         .next()
//         .then(product => {
//           console.log(product);
//           return product;
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }

//     static deleteById(prodId) {
//       const db = getDb();
//       return db
//         .collection('products')
//         .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//         .then(result => {
//           console.log('Deleted');
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }

// }


// module.exports = Product;


//SEQUELIZE

// //create a model 
// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,

//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: true
//   },
//   description:{
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// }); 

