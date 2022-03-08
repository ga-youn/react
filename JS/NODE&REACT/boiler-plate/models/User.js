const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const saltRounds = 10; //salt가 몇글자인지
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema({
    name : {
        type : String, 
        maxlength : 50
    },
    email : {
        type : String, 
        trim : true, //공백 없앰
        unique : 1
    },
    password : {
        type : String, 
        minlength : 5
    },
    lastname : {
        type : String, 
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

//register라우터에서 save 하기 전에 function을 준다.
userSchema.pre("save", function( next ){

    var user = this;

    //사용자가 비밀번호를 생성/수정할때만(이메일을 수정하는데 비밀번호를 새로 암호화할 수는 없으니까)
    if(user.isModified("password")){

        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
                
            if(err) return next(err)
            //myPlaintextPassword = user.password
            bcrypt.hash(user.password, salt, function (err, hash){
                
                if(err) return next(err)
                user.password = hash
                next()

            })
        })

    } else {
        next()
    }

    
})

//요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인하는 메소드
userSchema.methods.comparePassword = function(myPlaintextPassword, cb){

    //plainPassword 123456789 암호화된 비밀번호  $2b$10$sO0mpKqodhpAbzE67cZNEefN8w2aPdAt/ctLyIT42yUTnPi9v74/u
    //암호화된 비밀번호를 복호화시킬순 없기때문에
    //원래의 비밀번호를 암호화시킨후 맞는지 확인해야한다.
    bcrypt.compare(myPlaintextPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

//비밀 번호까지 같다면 user를 위한 token 생성하는 메소드
userSchema.methods.generateToken = function(cb){

    var user = this;
    //jasonwebtoken을 이용해서 토큰생성하기
    var token = jwt.sign(user._id.toHexString(), "secretToken")

    //user._id + "secretToden" = token
    //->
    //'secretToken' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })

}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {

        //유저아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports = {User} //다른파일에서 쓸수 있게함