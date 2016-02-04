var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.send('To Do api!');
})

app.listen(port, function(){
    console.log('Express server started!!!');
})