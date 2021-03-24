const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs")

router.get("/admin/users",(req , res)=>{
    
    User.findAll().then(users =>{
        res.render("admin/users/index", {users})
    })
})

router.get("/admin/users/create", (req , res)=>{
    res.render("admin/users/create")
})

router.post("/users/create",(req, res)=>{
    var email = req.body.email;
    var password = req.body.password;

    //Verificação de email
    User.findOne({
        where: {
            email
        }
    }).then(user =>{
        if(user == undefined){

            //Configuração do Bcrypt
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email,
                password: hash
            }).then(()=>{
                res.redirect("/")
            }).catch(err =>{
                res.redirect("/") 
            })

            
        }else{
            res.redirect("/admin/users/create")
        }
    })

   

})




//Configurações da Session para login e logout
router.get("/login",(req, res)=>{
    res.render("admin/users/login")
})

router.post("/authenticate", (req , res)=>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ 
        where : 
        { email }
    }).then(user => {
        if (user != undefined) {//Caso o email esteja correto
            //Validação de senha
            var correct = bcrypt.compareSync(password, user.password);

            if (correct) {
                req.session.user = {
                    id : user.id,
                    email : user.email
                }
                res.redirect("/admin/articles")
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login");
        }
    })

})

router.get("/logout",(req , res)=>{
    req.session.user = undefined;
    res.redirect("/")
})

module.exports = router;