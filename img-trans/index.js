var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    Canvas = require('canvas'),
    app;

app = express();

/*
* 处理跨域操作，设置响应头
*/
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",'3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(bodyParser.json()); // 解析json中间件
app.use(bodyParser.urlencoded({extended: true}));
/*
* 处理请求，转换图片格式
*/
app.post('/imgtrans',function (req,res,next){

    var src = req.body.src,
        width = Number(req.body.width),
        height = Number(req.body.height),
        type = req.query.type;

    var trans = (function (){
        // 转换方法构造函数get
        function Method(){}

        Method.prototype.png = function (src){

            var result = (function (){
              return  new Promise(function (resolve,reject){
                  var canvas = new Canvas(width,height),  // 创建canvas
                      ctx = canvas.getContext('2d'),
                      newSrc,
                      img;

                  fs.readFile(src, function(err,data){
                    if (err) throw err;

                    img = new Canvas.Image();
                    img.src = data;
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    resolve(canvas);
                  });
                });
            })();

            result.then(function (canvas){
                fs.writeFile('./image/newImg/test.png',canvas.toBuffer(),function (err){
                   if(err) throw err;

                   newSrc = './image/newImg/test.png';
                   var data = {
                     src: newSrc
                   };

                   res.status(200).json(data);
                });
              });
        };

        Method.prototype.svg = function (src){
          var result = (function (){
            return  new Promise(function (resolve,reject){
                var canvas = new Canvas(width,height,'svg'),  // 创建canvas
                    ctx = canvas.getContext('2d'),
                    newSrc,
                    img;

                fs.readFile(src, function(err,data){
                  if (err) throw err;

                  img = new Canvas.Image();
                  img.src = data;
                  ctx.drawImage(img, 0, 0, img.width, img.height);

                  resolve(canvas);
                });
              });
          })();

          result.then(function (canvas){
              fs.writeFile('./image/newImg/test.svg',canvas.toBuffer(),function (err){
                 if(err) throw err;

                 newSrc = './image/newImg/test.svg';
                 var data = {
                   src: newSrc
                 };

                 res.status(200).json(data);
              });
            });
        };

        Method.prototype.jpeg = function (src){
          var result = (function (){
            return  new Promise(function (resolve,reject){

                var canvas = new Canvas(width,height),  // 创建canvas
                    ctx = canvas.getContext('2d'),
                    newSrc,
                    img;

                fs.readFile(src, function(err,data){
                  if (err) throw err;

                  img = new Canvas.Image();
                  img.src = data;
                  img.dataMode = Image.MODE_MIME | Image.MODE_IMAGE; // 添加数据流跟踪(虽然看了文档，我也不明白这个加速有什么用，因为测试什么效果也没有)
                  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0,img.width,img.height);

                  resolve(canvas);
                });
              });
          })();

          result.then(function (canvas){
               // 捕获返回的 writeStream
               var stream = canvas.syncJPEGStream({bufsize:2048,quality:80}).pipe(fs.createWriteStream('./image/newImg/test.jpeg'));

              // 异步回调，执行完写入操作，返回文件路径
              stream.on('close',function (){
                newSrc = './image/newImg/test.jpeg';
                var data = {
                  src: newSrc
                };

                res.status(200).json(data);
              });
            });
        };

        Method.prototype.pdf = function (src,textObj){
            var result = (function (){
                return new Promise(function (resolve,reject){
                    var canvas = new Canvas(width,height,'pdf'),
                        ctx = canvas.getContext('2d'),
                        newSrc,
                        img,
                        x,
                        y;

                    function reset(){
                        x = 50;
                        y = 50;
                    }

                    // 标题创建函数
                    function h1(str){
                      ctx.font = '18px Helvetica';
                      ctx.fillText(str,x,y);
                    }

                    // 段落创建函数
                    function p(str){
                      ctx.font = '16px Arial';
                      y = y + 20;
                      ctx.fillText(str,x,y);
                    }

                    // 图片创建函数
                    function Img(src){
                      var img = new Canvas.Image();

                      img.src = src;
                      y = y + 20;
                      ctx.drawImage(img,x,y);
                      y = y + img.height;
                    }

                    //　创建PDF
                    reset();
                    h1(req.query.h1);
                    p(req.query.p);
                    Img(req.query.img);
                    ctx.addPage();  //　生成实例

                    fs.writeFile('./image/newImg/test.pdf',canvas.toBuffer(),function (err){
                      if(err) throw err;

                      newSrc = './image/newImg/test.pdf';
                      var data = {
                        flag: newSrc
                      };
                      res.status(200).json(data);
                    });
                });
            })();
        };
      return Method;
    })();

    var Trans = new trans(),
        textObj = req.query.text;

    Trans.pdf(src,textObj);

});

app.listen(3000, function () {
    console.log('Express server listening on port 3000');
});
