# 响应式瀑布流布局 + 懒加载

* 基于原生JS和CSS编写(试水ES6，正在学)

### 使用

* 引入masonry.js文件

* 创建实例
  ```js
      // 这里变量名自有设置
      let Masonry = new masonry();
  ```

* 加载IMG创建展示块
  ```js
      // 这里默认传入参数为当前需要加载的图片链接的存储数组arr
      // 可调用AJax从后端获取
      // 由于用了原型封装，支持链式调用

      /*
      * @params {arr}
      * @return this
      */
      Masonry.create(arr).layout().lazyload();  
  ```

  create(arr) 用于根据传入数据创建瀑布流布局块

  layout() 会根据当前块进行布局渲染

  lazyload() 用于支持懒加载和初次加载(加了逻辑，所以不存在初次加载与懒加载混合导致全部加载的问题)

  这里需要提到一点，在create(arr)中，对于item(瀑布流布局块)的高度是跑了一个随机数，也就是如下代码:

  ```js
    item.style.height = parseInt(Math.random()*(300-100+1))+100 + 'px';
  ```
  这么写是因为图片素材没有处理，设置成图片宽高，会导致无法检测效果，如果具体操作时，可替换为如下代码:

  ```js
    item.style.height = arr[i].height + 'px';
  ```
  也就是之后即将加载的图片的高度，

  * 封装节流函数，优化window.resize() 和 window.scroll() 操作

    如果不添加函数节流限制，window.resize() 和 widnow.scroll 的操作会导致浏览器频繁进行渲染，很大程度上进入假死状态，所以做了节流限制，使得无论多频繁操作，具体的Dom渲染会在500/1000ms间隔后进行，也不存在频繁操作倒置延时函数频繁刷新的问题，具体可以看代码。

    以下是绑定resize() 和 scroll() 操作的方式:

    ```js
      // 当然，具体时间又你自己设定
      window.onresize = function (){
        throttle(Masonry.layout().lazyload(),1000,1000);
      };

      window.onscroll = function (){
        throttle(Masonry.lazyload(),1000,1000);
      };
    ```
    * 没有实现预加载，因为实现方式不唯一，这里就不做提及，会在之后的总结里提到。 
