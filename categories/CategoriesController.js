const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify")
router.get("/admin/categories/new",(req , res )=>{
    res.render("admin/categories/new")
})


//Criação de categorias 
router.post("/categories/save",(req , res)=>{
    var title = req.body.title;

    if(title != undefined){
        Category.create({
            title : title,
            slug : slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        })
    }else{
        res.redirect("/admin/categories/new");
    }
});
//Achando todas as categorias
router.get("/admin/categories",(req , res )=>{
    Category.findAll().then(categories => {
        res.render("admin/categories/index", { categories});
    });
});

//Delete de categorias 
router.post("/categories/delete",(req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where:{
                    id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })


        }else{   // Não for um numero
            res.redirect("/admin/categories");
        }
    }else{ //Null
        res.redirect("/admin/categories");
    }
});

//Edição de categorias
router.get("/admin/categories/edit/:id",(req, res)=>{
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then(category =>{
        if (category != undefined) {
            
            res.render("admin/categories/edit", { category })

        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro =>{
        res.redirect("/admin/categories")
    })
});
router.post("/categories/update",(req , res)=>{
    var id = req.body.id;
    var title = req.body.title;

    Category.update({ title , slug : slugify(title) },{
        where:{
            id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })

})



module.exports = router;