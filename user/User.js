const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define("users",{
    email:{
        type: Sequelize.STRING,
        allowNull : false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//User.sync({force : false})//Utilizar o comando apenas para criar as tabelas 

module.exports = User;