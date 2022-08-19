var mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb://localhost/boook');

var userSchema = mongoose.Schema({
  username:String,
  email:String,
  password:String,
  items:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'cart'
    }
  ]
  
})

userSchema.plugin(plm);
module.exports = mongoose.model('user',userSchema)