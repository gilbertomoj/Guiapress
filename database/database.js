const Sequelize = require("sequelize");

const connection = new Sequelize("blogpress", "gilbertomjunior","g71124650",{
    host: "mysql743.umbler.com",
    dialect : "mysql",
    timezone : "-03:00"
});

module.exports = connection;