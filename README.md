# 基于原生javascript封装的Ajax插件
  > 待优化，根据学习理解，持续更新Ajax插件代码以及完善Node测试接口

* 欢迎 star 


  * 用法

  ```
    Ajax({
      url: "",
      datatype: "",
      JSONP: "",  // 跨域下的callback名
      method: "", // GET / POST
      timeout: , // 设置响应时间限制
      data: {},  // 传递数据,默认JSON格式
      success: function (res){

        // 响应数据处理逻辑代码
      }
      })
  ```

* index.html
  > 测试文件,默认本地浏览器运行,在Ajax请求本地Node服务时,是跨域请求,也可将Node服务访问 index.html,然后测试同源下Ajax请求

* ajax.js
  > 需在页面引入,代码中基于高程学习，用原生javascript做了封装，返回Ajax对象
  ```
      window.Ajax = function (params){
        return {
          Ajax: (function (params){
            new Ajax(params);
          })(params);  
        }   
    }
  ```

  > 同时也对IE的 ActiveXObject 做了兼容,见代码 createXHR()

  * 待完善
    * 对 Content-Type 的全面性未做兼顾，虽然ajax有很成熟的插件，但是在自己学习期间，去实现一个还是很有必要的
    * 在jsonp做POST请求时，没有考虑对表单做序列化处理时的问题
    * 代码有待优化，但目前不影响使用，暂且在做一些小项目时，不用再引入jquery(个人看法)


* server.js
  > 本地Node写了一个简单的响应接口，因为jsonp涉及处理URL的问题，在这个简单的测试接口上做了区分，测试Ajax的使用没有问题

  * 打开终端在当前目录运行
  * package.json中写入了必须的依赖模块
    ```
      npm install

      node server.js
    ```
  * 浏览器打开 index.html 刷新即可在控制台看到返回数据
