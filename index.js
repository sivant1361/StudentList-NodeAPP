const express=require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "YOUR URL";
app=express();

// register view engine

app.set('view engine','ejs');

// middleware and static files

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));   

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/',(req, res)=>{
    res.sendFile('./views/index.html',{ root:__dirname });
})

app.get('/student',(req, res)=>{
    res.sendFile('./views/student.html',{ root:__dirname });
})

app.post('/student-submit',function(req, res){
    const id= req.body.sid;
    const sName= req.body.sName.toUpperCase();
    MongoClient.connect(url,function(err, db){
        if(err) console.log(err);
        var dbo = db.db('students');
        dbo.collection("students").insertOne({sid:id,sName:sName});
        db.close();
        });
    // console.log(id,sName);
    if(id){
        res.render('student-submit',{sName:sName,sid:id});
        // res.sendFile('./views/student.html',,{ root:__dirname });
    }
    else{
        res.sendFile('./views/student.html',{ root:__dirname });
    }
})

app.get('/students',(req, res)=>{
    var students=[];
    MongoClient.connect(url,function(err, db){
        if(err) throw err;
        var dbo = db.db('students');
        dbo.collection("students").find({}).toArray(function(err, result) {
            console.log("\nCollection Student:");
            if (err) throw err;
            for (var i of result){
                students.push({sid:i.sid,sName:i.sName})
            }
            console.log(students);
            res.render('students',{students:students});
            db.close();
        });
    if(err) console.log(err);
    });
})

app.use((req,res)=>{
    res.status(404).sendFile('./views/404.html',{ root:__dirname });
});

app.listen(process.env.PORT||3000,(req, res)=>{
    console.log("Server is running at port : 3000");
});
