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

//Home do aplicativo 
app.get("/",(req, res)=>{
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit : 4
        //Linha para ajustar a ordem na exibição de artigos
    }).then(articles =>{
        Category.findAll().then( categories =>{
            res.render("index", {articles , categories})
        })
    })


});
//Página de leitura de artigos
app.get("/:slug",(req , res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug
        }
    }).then(article =>{
        if (article != undefined) {
            Category.findAll().then( categories =>{
                res.render("article", {article , categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        res.redirect("/");
    })
})

app.get("/category/:slug",(req, res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug
        },
        include : [{model: Article}]
    }).then(category =>{
        if (category != undefined) {
            Category.findAll().then( categories =>{
                res.render("index", {articles : category.articles, categories})//Passando todos os artigos com joins das categorias
            });
        } else {
            res.redirect("/")
        }
    }).catch(err =>{
        res.redirect("/")
    })
})

app.listen(8080, ()=>{
    console.log("Servidor rodando")
})