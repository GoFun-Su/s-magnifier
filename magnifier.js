;(function($){
  var Magnifier = function(opt) {
      var self=this;
      self.setting = {
        fixed_one:"",
        fixed_two:"",
        big_img:"",
        small_width:0,
        small_height:0,
        big_width:0,
        big_height:0,
        mouse_width:0,
        mouse_height:0,
        img_list:[],
        small_list:[],
        big_list:[]
      };
      self.config=$.extend({},self.setting, opt);
      self.render();
      $(document).mousemove(function(event) {
         var _self=this;
         var x=event.pageX-$(self.config.fixed_one).offset().left-self.config.mouse_width/2;
         var y=event.pageY-$(self.config.fixed_one).offset().top-self.config.mouse_height/2;
         self.setPos(x,y,event.pageX,event.pageY,$(self.config.fixed_one).offset().left,$(self.config.fixed_one).offset().top)
      })
    }
Magnifier.prototype.render=function(){
  var self=this;
  //生成节点
  $(self.config.fixed_one).append("<img src='"+self.config.small_img_src+"' class='small'>");
  $(self.config.fixed_one).append("<span style='display:none;'></span>");
  var $bigWrap=$("<div class='bigWrap' style='display:none;'></div>");
  var $photo=$("<div class='bigPhoto'></div>");
  $(self.config.fixed_one).append($bigWrap.html($photo));
  self.setImageParam(self.config.small_img_src);
  self.setImageParam(self.config.big_img_src);//不用renderImage，直接一步到setImageParam，是因为图片加载是异步，返回的数据有误，所以去掉返回结果
}
// Magnifier.prototype.renderImage=function(){
//       var self=this;
//       var wait = function(dtd){
//     　　　　var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
//             self.setImageParam(self.config.small_img_src);
//             self.setImageParam(self.config.big_img_src);
//             dtd.resolve()
//     　　　　return dtd.promise(); // 返回promise对象
//     　　};
//     　　$.when(wait())
//     　　.done(function(){
//             self.renderCss();
//         })
// }

Magnifier.prototype.renderCss=function(){
  var self=this;
  self.config.small_width=self.config.img_list[0];//第一个大盒子的宽度和高度
  self.config.small_height=self.config.img_list[1];
  self.config.big_width=self.config.img_list[2];//第一个大盒子的宽度和高度
  self.config.big_height=self.config.img_list[3];
  self.config.mouse_width=self.config.small_width*self.config.small_width/self.config.big_width;
  self.config.mouse_height=self.config.small_height*self.config.small_height/self.config.big_height;

  //计算节点的宽和高
  $(self.config.fixed_one).css({
    width:self.config.small_width+"px",
    height:self.config.small_height+"px"
  });
  $(self.config.fixed_one).find("span").css({
    width:self.config.mouse_width+"px",
    height:self.config.mouse_height+"px"
  });
  $(self.config.fixed_one).find(".bigWrap").css({
    width:self.config.small_width+"px",
    height:self.config.small_height+"px",
    right:"-"+(parseInt(self.config.small_width)+10)+"px"
  });
  $(self.config.fixed_one).find(".bigPhoto").css({
    width:self.config.small_width+"px",
    height:self.config.small_height+"px",
    "background-position": "0 0",
    "background-image": "url('"+self.config.big_img_src+"')"
  });
}
Magnifier.prototype.setImageParam=function(src){
        var self=this;
        self.config.img_list=[];
        var img = new Image();
        img.src = src;

        var wait = function(dtd){
      　　　　var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
            img.onload = function(){
              self.config.img_list.push(img.naturalWidth);
              self.config.img_list.push(img.naturalHeight);
              dtd.resolve()
            };
      　　　　return dtd.promise(); // 返回promise对象
      　　};
      　　$.when(wait())
      　　.done(function(){
              return self.config.img_list
          })
          .done(function(){
              self.renderCss();
           })

}
Magnifier.prototype.setPos=function(x,y,pageX,pageY,l,t){
  if (pageX<l || (l+this.config.small_width)<pageX) {
    $(this.config.fixed_one).find("span").hide();
    $(this.config.fixed_one).find(".bigWrap").hide();
    return;
  }
  if (pageY<t || (t+this.config.small_height)<pageY) {
    $(this.config.fixed_one).find("span").hide();
    $(this.config.fixed_one).find(".bigWrap").hide();
    return;
  }
  $(this.config.fixed_one).find("span").show();
  $(this.config.fixed_one).find(".bigWrap").show();
    if(x<0){
      x=0;
    }
    if(y<0){
      y=0;
    }
    if(x>this.config.small_width-this.config.mouse_width){
      x=this.config.small_width-this.config.mouse_width;
    }
    if(y>this.config.small_height-this.config.mouse_height){
      y=this.config.small_height-this.config.mouse_height;
    };
    $(this.config.fixed_one).find("span").css({
      left: x,
      top: y
    });
    // 大盒子的宽度/大盒子的宽度减去小盒子的宽度*x*(第二个图片的宽度/第一个大盒子的宽度)=第二个大盒子的图片的宽度/(第二个大盒子的图片的宽度-第二个大盒子的宽度)*y
    // this.config.small_width/(this.config.small_width-this.config.mouse_width)*x*(this.config.big_width/this.config.small_width);
    var pos_w=(this.config.big_width-this.config.small_width)/(this.config.small_width-this.config.mouse_width)*x;
    var pos_h=(this.config.big_height-this.config.small_height)/(this.config.small_height-this.config.mouse_height)*y;
    $(this.config.fixed_one).find(".bigPhoto").css({
      "background-position": "-"+pos_w+"px -"+pos_h+"px",
    });
}

window["Magnifier"] = Magnifier;
})(jQuery);
