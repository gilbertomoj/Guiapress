const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');


//Achando todos os artigos
router.get('/admin/articles', (req, res) => {
    Article.findAll({
      include: [{ model: Category  }],//Include para permitir que a pagina acesse a tabela de categorias
    }).then((articles) => {
      res.render('admin/articles', { articles });
    });
  });

//Criação de Artigos
router.get("/admin/articles/new",(req , res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new" , {categories})
    })
});
//Salvando artigos na tabela
router.post("/articles/save",(req , res )=>{
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;

    Article.create({
        title,
        body,
        slug: slugify(title),
        categoryId
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

//Editando artigos
router.get("/admin/articles/edit/:id",(req, res)=>{
    var id = req.params.id;//Id passado pelo Input no index

    Article.findByPk(id).then(articles =>{
        Category.findAll().then( categories => {
            if (articles != undefined) {
                res.render("admin/articles/edit", {articles , categories})
            } else {
                res.redirect("/admin/articles");
            }
        })
        
    })
})

router.post("/articles/update", (req , res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;

    Article.update({ title , slug : slugify(title), body , categoryId}, {
        where : 
        { id }
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(err =>{
        res.redirect("/")
    })

})


//Delete de artigos
router.post("/articles/delete",(req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where:{
                    id
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            })


        }else{   // Não for um numero
            res.redirect("/admin/articles");
        }
    }else{ //Null
        res.redirect("/admin/articles");
    }
});

//Paginação de Artigos
router.get("/articles/page/:num",(req , res)=>{
    var page = req.params.num;
    var offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        if (page == 2) {
            offset = parseInt(page) * 2;
        } else {
            offset = parseInt(page) * 4;
        }
        
    }
    

    Article.findAndCountAll({
        limit: 4,
        //Define o limite de artigos(objetos) por pagina
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then( articles =>{
        var next;
        if (offset + 4 >= articles.count) {
            next = false;
        } else{
            next = true
        }

        var result = {
            page: parseInt(page),
            next,
            articles
            
        }

        Category.findAll().then(categories =>{
            res.render("admin/articles/page", {result , categories})
        })


    })

})

module.exports = router;