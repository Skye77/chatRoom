
//引入模块
var http = require("http");
var path = require("path");
var express = require("express");

var app = express();
// 2.处理对静态资源的请求
var publicPath = path.resolve(__dirname,"chatRoom");
app.use(express.static(publicPath));  // 使用中间件

var httpServer = http.createServer(app);

// 3.运行socket服务器
require("./socketServer")(httpServer);

httpServer.listen(7000,function(){
    console.log("服务器正运行在7000端口...");
});


