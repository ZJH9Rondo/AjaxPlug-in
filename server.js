var http = require('http'),
    urllib = require('url');

var data = {'name': "Ajax","status": 'right'};

http.createServer(function (req,res){
    var params = urllib.parse(req.url,true);
    console.log(params);

    if(params.query && params.query.callback){
      console.log(params.query.callback);
      var str = params.query.callback + '(' + JSON.stringify(data) + ')';

      res.end(str);
    }else{
      res.end(JSON.stringify(data));
    }
}).listen(8120,'127.0.0.1');
