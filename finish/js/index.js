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
			//兼容DOM的浏览器将相关元素保持在relatedTarget属性中
			return event.relatedTarget;
		}else if(event.toElement){
			//在IE浏览器中mouseout事件的相关元素保存在toElement属性中
			return event.toElement;
		}else if(event.fromElement){
			//在IE浏览器中mouseover事件的相关元素保持在fromElement属性中
			return event.fromElement;
		}else{
			return null;
		}
	}

};
//下面这四个元素用于表示四个定时器的标识，最开始我只使用两个定时器，当快速移动时
//动画会乱。
// var timeDec1,timeAdd1,timeAdd2,timeDec2;
function getOuter(){
	var outer = document.getElementById('outer');
	untilEvent.addEvent(outer,'mouseover',callBackOver);
	untilEvent.addEvent(outer,'mouseout',callBackOut);
}
//mouseout事件：当鼠标从一个元素移入另一个元素时在鼠标离开的那个元素
//上触发，获得鼠标的元素可能在失去鼠标元素的外部也可能在失去鼠标元素的
//内部.所以需要判断mouseout事件的相关元素是否为外部li（即id为outerList或id为outerList2）元素
//的子孙元素，如果是子孙元素，则内部无序列表无须收起。
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
		//changeHeightDec(inter1);
		$(inter1).animate({height:'0px'},10);
	}
	if(!flag2){
		//changeHeightDec(inter2);
		$(inter2).animate({height:'0px'},10);
	}
}
function changeHeightDec(element){
	$(element).animate({height:"0px"},10);
	// change();
	// function change(){
	// 	var height = parseInt(element.style.height);
	// 	if(height > 0){
	// 		if(height%offHeight){
	// 			height = height-height%offHeight;
	// 		}
	// 		if(height >= offHeight){
	// 		element.style.height = height - offHeight +'px';
	// 		}else{
	// 			element.style.height = 0+'px';
	// 		}
	// 		if(flag === 'flag1'){
	// 		 timeDec1= setTimeout(change,inverTimer);
	// 		}else{
	// 			timeDec2 = setTimeout(change,inverTimer);
	// 		}
	// 	}
	// }
}
function callBackOver(event){
	var totalHeight = 180;
	var event = untilEvent.getEvent(event);
	var target = untilEvent.getTarget(event);
	var inter1 = document.getElementById('inter1');
	var inter2 = document.getElementById('inter2');
	if(target.id == 'outerList1' || target.id == "link1"){
		//changeHeight(inter1);
		$(inter1).animate({height:totalHeight + "px"},300);
	}
	if(target.id == 'outerList2' || target.id == 'link2'){
		//changeHeight(inter2);
		$(inter2).animate({height:totalHeight + 'px'},300);
	}
}
function changeHeight(element){
	 var totalHeight = 160;
	// var inverHeight = 10;
	// var inverTimer = 20;
	// clearTimeout(timer);
	$(element).animate({height:totalHeight + 'px'},300);
	//当鼠标移入时清除让内部ul长度减小的定时器，保证鼠标移入后
	//内部ul长度立即增加
	//change();
	// function change(){
	// 	var height = parseInt(element.style.height);
	// 	if(!height) height = 0;
	// 	if(height < totalHeight){
	// 		if(height + inverHeight > totalHeight){
	// 			element.style.height = totalHeight + "px";
	// 		}else{
	// 			element.style.height = height + inverHeight +'px';
	// 		}
	// 		if(flag === 'flag1'){
	// 			timeAdd1 = setTimeout(change,inverTimer);
	// 			}else{
	// 				timeAdd2 = setTimeout(change,inverTimer);
	// 			}
	// 	}
	// }
	
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
	});
}
function throttle(method,context){
	clearTimeout(method.Tid);
	method.Tid = setTimeout(method,70);
}
// 轮播的函数结束
function getInfoMask(){
	$("#mask1,#mask2,#imgmask1,#imgmask2").hover(function(){
		$(this).fadeTo(300,1);
	},function(){
		$(this).fadeTo(300,0);
	});
}
untilEvent.addEvent(window,'load',scrollEvent);
untilEvent.addEvent(window,'load',setListHeight);
untilEvent.addEvent(window,'load',setLiIndex);
untilEvent.addEvent(window,'load',btnClick);
untilEvent.addEvent(window,'load',play);
untilEvent.addEvent(window,'load',getWarp);
untilEvent.addEvent(window,'load',getOuter);
untilEvent.addEvent(window,'load',getInfoMask);