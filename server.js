var express=require('express');
var app=express();
const fileUpload = require('express-fileupload');
var session=require('express-session');
var bodyParser=require('body-parser');
app.use(fileUpload());
var fs = require('fs');
var path = require('path');
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', __dirname + '/view');
app.set('view engine','ejs');

app.use(express.static('public'));
app.use('/upload',express.static(__dirname + '/upload'));

app.use(session({
    secret: 'axxxxxxxxaaaaa',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000*60
    }
}))


app.get('/',function(req,res){
	var data={
		username:req.session.username,
		imgSrc:req.session.imgSrc,
	};
	res.render('index',{data:data});
});



app.get('/read',function(req,res){
	var filename="./top.txt";
	fs.readFile(filename, 'utf8', function(err, data) {
  	if (err) console.log(err);
  	console.log('OK: ' + filename);
 	res.send(data);
	});
});
app.post('/write',function(req,res){
	var filename="./top.txt";
	var data=JSON.stringify(req.body)+'\n';
	
	fs.appendFile(filename,data,'utf8', function(err) {
  		if (err) console.log(err);
		console.log('OK: ' + filename);
 	
	});
});
app.post('/login',function(req,res){
	var data={
		username:req.session.username,
		imgSrc:req.session.imgSrc,
	};
	var imgSrc;

	if (req.method == "POST") {
			var data=req.body;
			console.log(data);
			req.session.username=data.name;
			console.log(req.files);
			var fileUpload=req.files.image;
			imgSrc='/image/'+req.files.image.name;
			console.log(imgSrc);
			req.session.imgSrc=imgSrc;
			fileUpload.mv( __dirname+'/public/image/'+fileUpload.name, function(err) {
				if (err)
					console.log(err);
				else  {console.log('File uploaded!');

				res.send('Saved');
			}
			});
			
	}
});


app.set('port', process.env.PORT || 8080);
app.listen(process.env.PORT || 8080);
console.log("Create server done");
