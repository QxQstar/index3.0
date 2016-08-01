
  $(document).ready(function(){
      var mySwiper = new Swiper('.swiper-container',{
      centeredSlides: true,
      mousewheelControl : true,
      watchActiveIndex: true,
      onSlideNext:function(){
        checkIndex(mySwiper);
      },
      onSlidePrev:function(){
        checkIndex(mySwiper);
      }
    });
      mySwiper.enableKeyboardControl();
      checkIndex(mySwiper);
    $('.arrow-left').on('click', function(e){
      e.preventDefault();
      mySwiper.swipePrev();
      checkIndex(mySwiper);
    });
    $('.arrow-right').on('click', function(e){
      e.preventDefault();
      mySwiper.swipeNext();
      checkIndex(mySwiper);
    });
    changeImgSize();
  });
  function changeImgSize(){
      var img = $("#list").find("img");
      var width;
      img.each(function(index,elem){
        width = $(elem).width();
        $(elem).width(width/3).css({
          "marginTop": -($(elem).width()/2) +"px",
          "marginLeft": -($(elem).height()/2) + "px"
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
