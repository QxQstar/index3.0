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
//主导航条函数
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
//主导航条函数结束
function srcEvent(){
	$(document).scroll(function(){
		throttle(topNav);
		throttle(anchor);
		throttle(changeSildeState);
	});
}
function resizeEvent(){
	$(document).resize(function(){
		throttle(leftNav);
		throttle(topNav);
	});
}
function throttle(method){
	clearTimeout(method.tID);
	method.tID = setTimeout(method,70);
}
//当滑动到底部时改变左边栏的position值
function changeSildeState(){
	if($(document).width() >= 1100){
		if($(document).scrollTop() > $("footer").offset().top-700){
			$(".navFixedSlide").css({"position":"absolute","top":$("#content8").offset().top +10 + "px"});
		}else{
			$(".navFixedSlide").css({"position":"fixed","top":"0px"});
		}
	}
}
//当窗口的尺寸小于1100时顶部显示导航
function topNav(){
	if($(document).width() < 1100){
		if($(document).scrollTop() >= $('.warpContent').offset().top){
			$('.navFixedTop').css('display',"block");
		}else{
			$('.navFixedTop').css('display',"none");
		}
	}else{
		$('.navFixedTop').css('display',"none");
	}
}
//在滑动滚动条的过程中，显示当前位于页面中的部分
function anchor(){
	var className = '';
	if($(document).width() >= 1100){
			className = ".navFixedSlide";
			changeFouce(className);
		}else{
			className = ".navFixedTop";
			changeFouce(className);
		}
}
function changeFouce(className){
	var content = $(".contentList").find(".content");
	var navSlideLi = $(className).find("li");
	var curId = "content1";
	content.each(function(){
		if($(document).scrollTop() >= $(this).offset().top -500){
			curId = $(this).attr("id");
		}else{
			return false;
		}
	});
	navSlideLi.removeClass("curLi");
	var curAnchor = $("[href='#"+curId+"']");
	curAnchor.parent("li").addClass("curLi");
}
//设置左边导航的位置，左边导航的position值为fixed
function leftNav(){
	var docWidth = $(".warpContent").width();
	$(".navFixedSlide").css("marginLeft",-(docWidth/2 + 175) + "px");
}
//当窗口宽度小于1100px时，在上方显示导航条，
//该函数改变它的显示状态
function topNavToggle(){
	var navFixedTop = $("#navFixedTop");
	var button = navFixedTop.find(".show");
	button.click(function(){
		if(parseInt(navFixedTop.find("ul").css("right")) < 0){
			$(this).find("span").eq(0).addClass("one")
										.next("span").addClass("two")
										.next("span").addClass("three");

			navFixedTop.find(".mask").css("display","block")
								.next(".navContent").find("ul").animate({"right":"0"},400);
			}else{
				$(this).find("span").removeClass();
				navFixedTop.find(".mask").css("display","none")
								.next(".navContent").find("ul").animate({"right":"-300px"},400);
			}
	});
}
untilEvent.addEvent(window,'load',getOuter);
untilEvent.addEvent(window,'load',leftNav);
untilEvent.addEvent(window,'load',srcEvent);
untilEvent.addEvent(window,'load',resizeEvent);
untilEvent.addEvent(window,'load',anchor);
untilEvent.addEvent(window,'load',topNav);
untilEvent.addEvent(window,'load',topNavToggle);
untilEvent.addEvent(window,'load',changeSildeState);