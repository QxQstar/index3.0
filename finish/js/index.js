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
// 轮播的函数开始
//设置class为list的高度,因为图片的position为absolute所以.list元素的高度为零
//如果一个元素的父元素高度为0，那么设置这个元素的margin: auto 0; 不起作用
function setListHeight(){
	var list = document.getElementById('list');
	var myRow2 = document.getElementById('myRow2');
	var myRow3 = document.getElementById('myRow3');
	var imgItem = list.getElementsByTagName('img')[0];
	var height = imgItem.offsetHeight;
	var list = document.getElementById('list');
	list.style.height = height + 'px';
}
function setLiIndex(){
	var list = document.getElementById('list');
	var li = list.getElementsByTagName('li');
	var liLen = li.length;
	for(var i = 0;i<liLen;i++){
		li[i].style.zIndex = liLen-i;
	}
}
var index = 1;//index表示当前显示的页面,index是一个全局变量
var timer;
function btnClick(){
	var warp = document.getElementById('warp');
	untilEvent.addEvent(warp,'click',function(event){
		var event = untilEvent.getEvent(event);
		var target = untilEvent.getTarget(event);
        var targetName = target.nodeName.toLowerCase();
		if(targetName == 'div' || targetName == "p"){
			switch(target.className){
				case 'pre': if(index == 1){
						index = 3;
					}else{
						--index;
					}
					anmitate();
					break;
				case 'next':if(index == 3){
					index = 1;
					}else{
						++index;
					}
					anmitate();
					break;
			}
		}else if(targetName == 'span'){
			index = target.getAttribute('data-index');
			anmitate();
		}
	});
}
function removeClass(curIndex){
	var controll = document.getElementById('controll');
	var spans = controll.getElementsByTagName('span');
	for(var i = 0,len = spans.length; i<len;i++){
		if(i == curIndex-1){
			spans[i].className = "curIndex";
		}else{
			spans[i].className = "";
		}
	}
}
//切换图片的函数
function anmitate() {
    removeClass(index);
    var list = $("#list");
    var imgList = list.find("img");
    imgList.each(function(cur,ele){
        if(cur + 1 == index){
            $(ele).animate({"opacity":"1"},700);
        }else{
            $(ele).animate({"opacity":"0"},700);
        }
    });
}
//自动切换函数
function play() {
	timer = setTimeout(function () {
	if(index == 3){
			index = 1;
		}else{
			++index;
		}
		anmitate();
		play();
 }, 4000);
}
//停止切换函数,当鼠标点击了左箭头或者右箭头时会取消自动切换，当鼠标从箭头上移开，又开始自动切换
function stop() {
	clearTimeout(timer);
}
function getWarp(){
	var warp = document.getElementById('warp');
	untilEvent.addEvent(warp,"mouseout",play);
	untilEvent.addEvent(warp,"mouseover",stop);
}
//函数节流
function scrollEvent(){
	untilEvent.addEvent(window,"resize",function(){
		throttle(setListHeight);
		throttle(collapse);
	});
}
function throttle(method,context){
	clearTimeout(method.Tid);
	method.Tid = setTimeout(method,70);
}
// 轮播的函数结束
//用户测评和公司介绍蒙层
function addMask(){
	$(".customer .word").hover(function(){
		$(this).fadeTo(300,1);
	},function(){
		$(this).fadeTo(300,0);
	});
	$(".company").hover(function(){
		$(".company").find(".mask").fadeTo(150,0.6);
	},function(){
		$(".company").find(".mask").fadeTo(150,0.3);
	});
}
//用户晒单限定显示的字数
function collapse(){
	var p = $(".customer .word #p");
	var offsetWidth = p.width();
	var offsetHeight = p.height();
	var fontSize = parseInt(p.css('font-size'));
	var lettSpac = parseInt(p.css('letter-spacing'));
	var num = parseInt(offsetWidth/(fontSize + 2*lettSpac) * offsetHeight/(fontSize*1.5));
	$(".customer .word p").each(function(index,ele){
		var valueL = $(ele)[0].innerHTML.length;
		if(valueL > num){
			$(ele)[0].innerHTML = $(ele)[0].innerHTML.slice(0,num) + "...";
		}
	});
}
//手机上产品和服务列表
function smallScreenList(){
	var state = false;
	$(document).click(function(event){
		var state = false;
		var target = event.target;
		var targetName = target.nodeName.toLowerCase();
		var temp = null;
		if(targetName == 'span' && $(target).parent()[0].nodeName.toLowerCase() == 'li' || targetName == 'i'){
			if(targetName == 'span'){
				temp = $(target);
			}else{
				temp = $(target).parent('span');
			}
			if(temp.attr('class').indexOf('cur') >= 0){
				state = false;
				$('.smallScreen .list span').prev('div').removeClass('bar');
				$('.smallScreen .list span').removeClass('cur').next().addClass('hide');
			}else{
				state = true;
				$('.smallScreen .list span').prev('div').removeClass('bar');
				$('.smallScreen .list span').removeClass('cur').next().addClass('hide');
				temp.addClass("cur").next().removeClass("hide");
				temp.prev().addClass('bar');
                temp.parent('li').css("z-index","20").siblings('li').css("z-index","10");
			}
			spread(state);
		}else{
			state = false;
			$('.smallScreen .list span').prev('div').removeClass('bar');
			$('.smallScreen .list span').removeClass('cur').next().addClass('hide');
			spread(state);
		}
	});
}
//控制手机上产品和服务列表是显示还是折叠
function spread(state){
	if(state){
		$('.smallScreen').animate({height:'90px'},500);
	}else{
		$('.smallScreen').animate({height:'30px'},500);
	}
}
//动态为活动列表添加类
function addClass(){
    var activeList = $("#activeBar").find(".list li");
    var moreList = $("<li class='activeItem moreActiveItem'><a href='#'><img src='../img/3213.jpg'></a></li>");
    activeList.eq(3).before(moreList);
    activeList.eq(3).addClass("otherActive").nextAll("li").addClass("otherActive");
    $('#customer').find('li').last().addClass("lastItem");
}
untilEvent.addEvent(window,'load',scrollEvent);
untilEvent.addEvent(window,'load',setListHeight);
untilEvent.addEvent(window,'load',setLiIndex);
untilEvent.addEvent(window,'load',btnClick);
untilEvent.addEvent(window,'load',play);
untilEvent.addEvent(window,'load',getWarp);
untilEvent.addEvent(window,'load',getOuter);
untilEvent.addEvent(window,'load',addMask);
untilEvent.addEvent(window,'load',collapse);
untilEvent.addEvent(window,'load',smallScreenList);
untilEvent.addEvent(window,'load',addClass);