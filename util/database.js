// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let db;

// const mongoConnect = cb => {
//     MongoClient.connect('mongodb+srv://notredame:LODnh5enrVIfeOLn@muster-7ahno.mongodb.net/test?retryWrites=true&w=majority')
//     .then(client => {
//         console.log('Connected');
//         db = client.db();   //storing a connection to the database
//         cb();
//     })
//     .catch(err => {
//         console.log(err);
//         throw err;
//     });
// }

// const getDb = () => {
//     if(db){
//         return db;
//     }
//     throw 'No database found';
// }

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;








q

//SEQUELIZE CODE

// const Sequelize  = require('sequelize'); //importing a class

// //create a new Sequelize object which takes (name, admin, passwd {args})
// const sequelize = new Sequelize('nodestore', 'root', '', {
//     dialect: 'mysql', 
//     host:'localhost'});

// module.exports = sequelize;