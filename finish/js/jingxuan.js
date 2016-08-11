var untilEvent = {
  addEvent:function(element,type,hander){
    if(element.addEventListener){
      element.addEventListener(type,hander,false);
    }else if(element.attachEvent){
      element.attachEvent('on'+type,hander);
    }else{
      element['on'+type] = hander;
    }
  },
  getEvent:function(event){
    return event?event:window.event;
  },
  getTarget:function(event){
    return event.target||event.srcElement;
  },
  getRelated:function(event){
    if(event.relatedTarget){
      return event.relatedTarget;
    }else if(event.toElement){
      return event.toElement;
    }else if(event.fromElement){
      return event.fromElement;
    }else{
      return null;
    }
  }

};
function getOuter(){
  var outer = document.getElementById('outer');
  untilEvent.addEvent(outer,'mouseover',callBackOver);
  untilEvent.addEvent(outer,'mouseout',callBackOut);
}
function callBackOut(event){
  var event = untilEvent.getEvent(event);
  var relatedTarget = untilEvent.getRelated(event);
  var outerList1 = document.getElementById('outerList1');
  var inter1 = document.getElementById('inter1');
  var outerList2 = document.getElementById('outerList2');
  var inter2 = document.getElementById('inter2');
  var flag1 = false,flag2 = false;
  if(relatedTarget !== null){
    var parented = relatedTarget.parentNode;
    do{
      if(parented === outerList1 || relatedTarget === outerList1){
        flag1 = true;
        break;
      }else if(parented === outerList2 || relatedTarget === outerList2){
        flag2 = true;
        break;
      }else{
        parented = parented.parentNode;
      }
    }while(parented !== null);
  }
  if(!flag1){
    $(inter1).animate({height:'0px'},10);
  }
  if(!flag2){
    $(inter2).animate({height:'0px'},10);
  }
}
function callBackOver(event){
  var totalHeight = 170;
  var event = untilEvent.getEvent(event);
  var target = untilEvent.getTarget(event);
  var inter1 = document.getElementById('inter1');
  var inter2 = document.getElementById('inter2');
  if(target.id == 'outerList1' || target.id == "link1"){
    $(inter1).animate({height:totalHeight + "px"},300);
  }
  if(target.id == 'outerList2' || target.id == 'link2'){
    $(inter2).animate({height:totalHeight + 'px'},300);
  }
}
  $(document).ready(function(){
      var mySwiper = new Swiper('.swiper-container',{
      centeredSlides: true,
      mousewheelControl : true,
      watchActiveIndex: true,
          autoResize : false,
      onSlideNext:function(){
        checkIndex(mySwiper);
          sale();
      },
      onSlidePrev:function(){
        checkIndex(mySwiper);
          sale();
      }
    });
      mySwiper.enableKeyboardControl();
      checkIndex(mySwiper);
    $('.arrow-left').on('click', function(e){
      e.preventDefault();
      mySwiper.swipePrev();
      checkIndex(mySwiper);
        sale();
    });
    $('.arrow-right').on('click', function(e){
      e.preventDefault();
      mySwiper.swipeNext();
      checkIndex(mySwiper);
        sale();
    });
    changeImgSize();
      //购买
//    $("#list").on("click",sale);
      sale();
  });
//改变图片大小
  function changeImgSize(){
      var img = $("#list").find("img");
      var width,height;
      img.each(function(index,elem){
        width = $(elem).width();
        height = $(elem).height();
        $(elem).width(width/3).height(height/3).css({
          "marginTop": -($(elem).height()/2) +"px",
          "marginLeft": -($(elem).width()/2) + "px"
        });
      });
    }
  function checkIndex(mySwiper){
    var length = $('.swiper-container .item').length;
    $(".warp .info .total").text(length);
    $('.warp .info .cur').text(mySwiper.activeIndex + 1);
    if(mySwiper.activeIndex === 0){
      $(".arrow-left").hide();
      $(".arrow-right").show();
    }else if(mySwiper.activeIndex == length-1){
      $(".arrow-left").show();
      $(".arrow-right").hide();
    }else{
      $(".arrow-left").show();
      $(".arrow-right").show();
    }
  }
//改变水杯详情的显示
  function spreadOrFlod(){
    $('.mask').width($(".goodsDesc img").width());
      $(".All").on("click", function (event) {
          var target = event.target;
          if($(target).attr("class").indexOf("fold") > -1){
              $(this).find(".fold").css("display","none");
              $(this).find(".spread").css("display","inline");
              $(".goodsDesc .content").removeClass("isFold").addClass("isSpread");

          }
          if($(target).attr("class").indexOf("spread") > -1){
              $(this).find('.fold').css("display","inline");
              $(this).find('.spread').css("display","none");
              $(".goodsDesc .content").removeClass("isSpread").addClass("isFold");
          }
      })
  }
//购买
function sale(event){
    var cupWidth = 199;
    var cupHeight = 343;
    var curItem = $("#list").find(".swiper-slide-active");
    var img = curItem.find("img");
    var imgWidth = img.width();
    var imgHeight = img.height();
    var X = (cupWidth - imgWidth)/2;
    var Y = (cupHeight - imgHeight)/2;
    var coord = $(".coord");
    coord.attr("value",X + "_" + Y);
}
untilEvent.addEvent(window,'load',getOuter);
untilEvent.addEvent(window,'load',spreadOrFlod);
