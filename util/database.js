const Sequelize  = require('sequelize'); //importing a class

//create a new Sequelize object which takes (name, admin, passwd {args})
const sequelize = new Sequelize('nodestore', 'root', '', {
    dialect: 'mysql', 
    host:'localhost'});

module.exports = sequelize;