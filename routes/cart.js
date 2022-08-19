var mongoose = require('mongoose');


var cartSchema = mongoose.Schema({
  bookname:String,
  price:String,
  image:String,
  edition:String,
  cart:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'cart'
  }
});

module.exports = mongoose.model('cart',cartSchema);