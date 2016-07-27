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
	// if($(window).width() >= 768){
	// 	totalHeight = 170;
	// }else{
	// 	totalHeight = 100;
	// }
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
		if(target.nodeName.toLowerCase() == 'div'){
			switch(target.id){
				case 'pre': if(index == 1){
						index = 4;
					}else{
						--index;
					}
					anmitate();
					break;
				case 'next':if(index == 4){
					index = 1;
					}else{
						++index;
					}
					anmitate();
					break;
			}
		}else if(target.nodeName.toLowerCase() == 'span'){
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
//减小图片透明度
function decline(cur,inverTime,inverOpacity){
	var opacityed = parseFloat(cur.style.opacity);
	if (!opacityed) opacityed = 1;
	if(opacityed > 0){
		cur.style.opacity = opacityed-inverOpacity;
		setTimeout(function(){
			decline(cur,inverTime,inverOpacity);
		},inverTime);
	}
}
//切换图片的函数
function anmitate(){
	removeClass(index);
	var list = document.getElementById('list');
	var imgs = list.getElementsByTagName('img');
	var imgsLen = imgs.length;
	var whole = 300;//切换一张图片用的时间
	var inverTime = 5;//时间间隔
	var inverOpacity = 1/(whole/inverTime);
	for(var i = 0;i<imgsLen;i++){
		decline(imgs[i],inverTime,inverOpacity);
	}
	var go = function(){
		var opacityed = parseFloat(imgs[index - 1].style.opacity);
		if(!opacityed)opacityed = 0;
		if(opacityed < 1){
			var newOpacity = opacityed + inverOpacity;
			if ( newOpacity > 1) {
				imgs[index-1].style.opacity = 1;
			}else{
				imgs[index-1].style.opacity = newOpacity;
			}
			setTimeout(go,inverTime);
		}
	};
	go();
}
//自动切换函数
function play() {
	timer = setTimeout(function () {
	if(index == 4){
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
		throttle(checkWidth);
	});
}
function throttle(method,context){
	clearTimeout(method.Tid);
	method.Tid = setTimeout(method,70);
}
// 轮播的函数结束
function discussMask(){
	$(".customer .word").hover(function(){
		$(this).fadeTo(300,1);
	},function(){
		$(this).fadeTo(300,0);
	});
}
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
// function checkWidth(){
// 	var width = $(window).width();
// 	if(width >= 768){
// 		$('.cupItem #chunse').attr('src',"../img/纯色.png");
// 	}else{
// 		$('.cupItem #chunse').attr('src',"../img/纯色2.png");
// 	}
// }
function smallScreenList(){
	var state = false;
	// $('.smallScreen .list span').click(function(){
	// 	state = true;
	// 	$('.smallScreen .list span').removeClass('cur').addClass('hide');
	// 	$(this).addClass("cur").next('ul').removeClass("hide");
	// 	spread(state);
	// });
	$(document).click(function(event){
		var state = false;
		var target = event.target;
		var targetName = target.nodeName.toLowerCase();
		if(targetName == 'span' && $(target).parent()[0].nodeName.toLowerCase() == 'li'){
			
			if($(target).attr('class').indexOf('cur') >= 0){
				state = false;
				$('.smallScreen .list span').prev('div').removeClass('bar');
				$('.smallScreen .list span').removeClass('cur').next().addClass('hide');
			}else{
				state = true;
				$('.smallScreen .list span').prev('div').removeClass('bar');
				$('.smallScreen .list span').removeClass('cur').next().addClass('hide');
				$(target).addClass("cur").next().removeClass("hide");
				$(target).prev().addClass('bar');
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
function spread(state){
	if(state){
		$('.smallScreen').animate({height:'80px'},500);
	}else{
		$('.smallScreen').animate({height:'20px'},500);
	}
}
untilEvent.addEvent(window,'load',scrollEvent);
untilEvent.addEvent(window,'load',setListHeight);
untilEvent.addEvent(window,'load',setLiIndex);
untilEvent.addEvent(window,'load',btnClick);
untilEvent.addEvent(window,'load',play);
untilEvent.addEvent(window,'load',getWarp);
untilEvent.addEvent(window,'load',getOuter);
untilEvent.addEvent(window,'load',discussMask);
untilEvent.addEvent(window,'load',collapse);
//untilEvent.addEvent(window,'load',checkWidth);
untilEvent.addEvent(window,'load',smallScreenList);