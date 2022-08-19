var express = require('express');
var router = express.Router();

const user = require('./users')
const cart = require('./cart')

var passport = require('passport');
const ls = require('passport-local');

passport.use(new ls(user.authenticate()))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Register', function(req, res, next) {
  res.render('Register');
});

router.get('/loginn', function(req, res, next) {
  res.render('loginn');
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/upload', function(req, res, next) {
  res.render('upload');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/categories', function(req, res, next) {
  res.render('categories');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.get('/blog', function(req, res, next) {
  res.render('blog');
});


router.get('/cartAll',isLoggedIn,function(req, res, next) {
  user.findOne({
    username:req.session.passport.user
  })
  .populate('items')
  .then(function(user) {
    res.render('cartAll',{user})

  })
})
router.post('/register', function(req, res, next) {
  var newUser = new user({
    username: req.body.username,
    email: req.body.email
  })

user.register(newUser,req.body.password)
  .then(function(response) {
    passport.authenticate('local')(req,res,function(){
      res.redirect('/allItems');
    })
  })
    .catch(function(err) {
      res.send(err)
    })
})


router.post('/login',passport.authenticate('local',{
  successRedirect:'/allItems',
  failureRedirect:'/'
}),function(req, res){})

router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect('/')
})


router.post('/cart',function (req, res, next) {
  cart.create({
    bookname:req.body.bookname,
    price:req.body.price,
    image:req.body.image,
    edition:req.body.edition
  })
  .then(function (createdItem) {
    res.redirect('/')
  })
})

router.get('/allItems',isLoggedIn,function (req, res) {
  user.findOne({
    username: req.session.passport.user
  }).then(function (loginuser){
    cart.find({})
    .then(function (items){
      res.render('allitems',{items})
    })
  })
})

router.get('/addCart/:id',isLoggedIn,function (req, res){
  user.findOne({username:req.session.passport.user})
  .then(function (loginuser){
    cart.findOne({_id:req.params.id})
  .then(function (itemfound){
    loginuser.items.push(itemfound._id)
    loginuser.save();
    res.redirect(req.headers.referer)  
  })
  })
})

router.get('/removeCart/:id',isLoggedIn,function (req, res){
  user.findOne({username:req.session.passport.user})
  .then(function (loginuser){
    cart.findOne({_id:req.params.id})
  .then(function (itemfound){
    var kaha = loginuser.items.indexOf(itemfound._id) 
      loginuser.items.splice(kaha, 1);
      loginuser.save();
      res.redirect(req.headers.referer)  
    })
  })
})

router.get('/c/:id',isLoggedIn,function(req, res){
  user.findOne({username:req.session.passport.user})
  .then(function(loginuser){
    cart.findOne({_id:req.params.id})
    .then(function(item){
      res.send(item);
    })
  })

})



router.get('/cartitems',isLoggedIn,function (req, res){
 res.redirect("/cartAll")
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    redirect('/')
  }
}
module.exports = router;
