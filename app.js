var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var fs = require("fs");
var multer  = require('multer');
var FormData = require('form-data');
var app = express()
// var captionServiceUrl = "http://localhost:49160"
var captionServiceUrl = "http://caption-service:8080"
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')
app.get('/', function (req, res) {
  res.render('navbar', { title: 'Image Captioning Service', message: 'Hello there!' })
})
app.get('/url', function (req, res) {
  res.render('url', { title: 'Image Captioning Service', message: 'Hello there!' })
})
app.post('/url', function (req, res) {
  var url = req.body.url
  console.log("Getting caption for url " + url)
  // res.render('urlCaption', { imgUrl: url, imgCaption: "a man flying a kite" })
  getCaption(url)
     .then(caption => res.render('urlCaption', { imgUrl: url, imgCaption: caption }));
})

app.get('/recent', function (req, res) {
  res.render('recent', { title: 'Image Captioning Service', message: 'Hello there!' })
})

var upload = multer({ dest: './public/uploads/' })
app.get('/upload', function (req, res) {
  res.render('upload', { title: 'Image Captioning Service', message: 'Hello there!' })
})

app.post('/upload', upload.single('file'), function (req, res) {
   console.log(req.file.originalname);
   console.log(req.file.path);
   console.log(req.file.mimetype);
   var file = __dirname + "/public/images/" + req.file.originalname;
   
   fs.readFile( req.file.path, function (err, data) {
      fs.writeFile(file, data, function (err) {
         if( err ){
            console.log( err );
            }else{
               response = {
                  message:'File uploaded successfully',
                  filename:req.file.originalname
               };
            }
         console.log( response );
        var url="../../images/" + req.file.originalname;
        var imgLoc = file
        var formData = {
        	file:fs.createReadStream(imgLoc)
        };
		// form.append('file', fs.createReadStream(imgLoc), {
		//     filename: req.file.originalname,
		//     contentType: req.file.mimetype
	 //    });
		// form.getLength(function(err, length){
		//   if (err) {
		//     return cb(err);
		//   }
		//   var r = request.post(captionServiceUrl+"/img", cb);
		//   r._form = form;     
		//   r.setHeader('content-length', length);
		// });
        request.post({url:captionServiceUrl+"/img",formData: formData}, function (err, httpResponse, caption) {		  
		  if(err){
		  	console.log(err)
		  }else{
		  	console.log(caption);
		  	res.render('urlCaption', { imgUrl: url, imgCaption: caption });
		  }
		});
  //   	fs.stat(url, function(err, stats) {
  //   		console.log(stats)
		//     restler.post(captionServiceUrl+"/img", {
		//         multipart: true,
		//         data: {
		//             "folder_id": "0",
		//             "filename": restler.file(url, null, stats.size, null, "image/jpg")
		//         }
		//     }).on("complete", function(caption) {
		//         console.log(caption);
		//         res.render('urlCaption', { imgUrl: url, imgCaption: caption })
		//     });
		// });
      });
   });

});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


const getCaptionFromStream = stream => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                url: captionServiceUrl+"/img"
            };

            stream.pipe(request.post(requestData, (error, response, body) => {
                if (error) {
                    console.log(error)
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                }
                else {
                    resolve(body);
                }
            }));
        }
    );
}

const getCaption= url =>{
	if(url){
	    return new Promise(
	        (resolve, reject) => {
	            const requestData = {
	                uri: captionServiceUrl,
	                method: "POST",
	                headers: {"Content-Type":"application/json"},
	                json: { "url": url }
	            };

	            request(requestData, (error, response, body) => {
	                if (error) {
	                    reject(error);
	                }
	                else if (response.statusCode != 200) {
	                    reject(body);
	                }
	                else {
	                    console.log(body);
	                    resolve(body);
	                }
	            });
	        }
	    );
	}else{
		return new Promise(
			// error=Error('url empty!!')
			(resolve, reject) =>{
				reject(new Error('url empty!!'))
			}
		);
	}
}