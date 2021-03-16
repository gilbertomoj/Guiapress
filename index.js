const express = require("express");
const bodyParser = require('body-parser');
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const app = express();
const connection = require("./database/database");
//Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
//View engine
app.set("view engine","ejs")

//Static
app.use(express.static("public"))
//Body parser 
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(bodyParser.json());


//Database
connection
.authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso")
})
.catch((error)=>{
    console.log("Ocorreu um erro", error)
})


app.use("/",categoriesController);
app.use("/",articlesController);

app.get("/",(req, res)=>{
    res.render("index")

});

app.listen(8080, ()=>{
    console.log("Servidor rodando")
})