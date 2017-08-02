/*
* 瀑布流
*/
;(function (){
  function masonry() {
    this.items = [];
  }

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

  masonry.prototype.layout = function (){
    let cols = parseInt(document.documentElement.clientWidth/200),
        masonryCtn = document.getElementById('masonry'),
        flagHeight = [],
        minHeight = 0,
        minFlag = 0;

    masonryCtn.style.width = cols*200 + 100 * (cols - 1)+20;

    // 初始化最短列
    for(let i = 0; i < cols; i++){
      flagHeight[i] = 10;
    }

    // 求最短列
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
      minHeight = flagHeight[minFlag];  // 保存当前列长度改变位置
    }

    return this;
  };

  let arr = ["1.png","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","7.jpg","8.jpg","9.jpg","10.jpg"],
      Masonry = new masonry();

  Masonry.create(arr).layout();

  window.onresize = function (){
    Masonry.layout();
  };
})();
