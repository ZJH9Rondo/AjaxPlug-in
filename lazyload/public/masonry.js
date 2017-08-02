/*
* masonry and lazyload
*/
;(function (){
  function masonry() {
    this.items = [];
  }

  /*
  * create ul->li(item)
  */
  masonry.prototype.create = function (arr){
     let masonryCtn = document.getElementById('masonry');

     for(let i=0;i < arr.length;i++){
       let item = document.createElement('li'),
           img = document.createElement('img');

       img.setAttribute("data",'./img/' + arr[i]);
       item.style.height = parseInt(Math.random()*(300-100+1))+100 + 'px';
       masonryCtn.appendChild(item);
       item.appendChild(img);
       this.items.push(item);
     }

     return this;
  };

  /*
  * layout  UI
  */
  masonry.prototype.layout = function (){
    let cols = parseInt(document.documentElement.clientWidth/200), // 可视区域宽度
        masonryCtn = document.getElementById('masonry'),
        flagHeight = [],
        minHeight = 0,
        minFlag = 0;

    masonryCtn.style.width = cols*200 + 100 * (cols - 1)+20;

    // reset flagHeight
    for(let i = 0; i < cols; i++){
      flagHeight[i] = 10;
    }

    // get minHeight
    minHeight = flagHeight[0];
    for(let i = 0; i < this.items.length; i++){
      for(let j = 0; j < cols; j++){
        if(minHeight > flagHeight[j]){
          minHeight = flagHeight[j];
          minFlag = j;
        }
      }
      this.items[i].style.left = 10 + 210*minFlag + 'px';
      this.items[i].style.top = flagHeight[minFlag] + 'px';
      flagHeight[minFlag] = flagHeight[minFlag] + this.items[i].offsetHeight + 10;
      minHeight = flagHeight[minFlag];  // 暂存当前列长度改变位置
    }

    return this;
  };

  masonry.prototype.lazyload = function (){
    let limit = document.documentElement.clientHeight,
        scrollChange = document.body.scrollTop || document.documentElement.scrollTop; // 兼容 IE Chrome FireFox

    for(let i = 0;i < this.items.length; i++){
      if(((this.items[i].offsetTop - scrollChange) < limit) && !this.items[i].childNodes[0].src){
        this.items[i].childNodes[0].src = this.items[i].childNodes[0].getAttribute('data');
      }
    }
  };

/*
* throttle
*/
function throttle(method,delay,duration){
    var begin = new Date();
    var timer = null;
    return function(){
        var current = new Date(), args = Array.prototype.slice.call(arguments), context = this;
        clearTimeout(timer);
        if(current - begin >= duration){
            method.apply(context,args);
            begin = current;
        }else{
            timer = setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    };
}

  /*
  * test data
  */
  let arr = ["1.png","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","1.png","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","1.png","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","1.png","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","1.png","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","1.png","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg"],
      changelimit = false,
      scrolllimit = false,
      Masonry = new masonry();
      
  Masonry.create(arr).layout().lazyload();

  window.onresize = function (){
    throttle(Masonry.layout().lazyload(),1000,1000);
  };
  window.onscroll = function (){
    throttle(Masonry.lazyload(),1000,1000);
  };
})();
