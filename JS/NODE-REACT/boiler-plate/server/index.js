// index.js = 백엔드 시작점
// npm install express --save 

//express 모듈 가져오기
const express = require("express");
const app = express(); //앱 가져오기
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

const config = require("./config/key");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

//mongoose 모듈 가져오기
const mongoose = require("mongoose");
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology : true //useCreateIndex : true, useFindAndModify : false //안쓰면 에러나서 써줌 주석처리된 옵션들은 더이상 지원 x
}).then(() => console.log("MongoDB Connected...")) //잘 연결됐는지 확인
  .catch(err => console.log(err)) //에러시 확인

  
app.get('/', (req, res) => res.send("바뀜?")) //root directory에서 출력되게

//프론트에 보내기
app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~")
})


//회원가입
app.post("/api/user/register", (req, res) => {

  //회원 가입에 필요한 정보들을 client에서 가져오면 
  //그것들을 데이터 베이스에 넣어준다

  const user = new User(req.body)

  user.save((err, doc) => {
    if(err) return res.json({success : false, err})
    return res.status(200).json({
      success : true
    })
  }) //몽고db에서 오는 메소드

})


//로그인
app.post("/api/user/login", (req, res) => {

  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email : req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      }) 
    }

     //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다/"})

      //비밀 번호까지 같다면 user를 위한 token 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. where ? 쿠키 or 로컬스토리지
        //쿠키에 저장할 것-> cookie-parser 라이브러리 설치
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess : true, userId : user._id })
      })
    })
  })
})


app.get("/api/user/auth", auth, (req,res) => {
   
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 true 라는 말
  res.status(200).json({
    
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true, // role 0 -> 일반유저, 0이 아니면 관리자
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image

  })
})

app.get("/api/user/logout", auth, (req, res) => {
  
  User.findOneAndUpdate({ _id : req.user._id },
    { token : "" }, (err, user) => {
      if(err) return res.json({success : false});
      
      return res.status(200).send({
        success : true
      })
    })
})



app.listen(port, () => console.log(`Exampe app listining on port ${port}!`)) //port 5000에서 실행


