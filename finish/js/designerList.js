/**
 * Created by Administrator on 2016/8/11.
 */
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
    if($(window).width() >= 992){
        changeImg();
    }
});
function changeImg(){
    var prodDesiItem = $("#prodDesi").find(".item");
    var picDesiItem = $("#picDesi").find(".item");
    var str1,str2;
    prodDesiItem.each(function(index,ele){
        str1 = "prodDesc";
        $(ele).find("img").attr("src","../img/" + str1 + (index + 1) +".jpg");
    });
    picDesiItem.each(function(index,ele){
        str2 = "picDesc";
        $(ele).find("img").attr("src","../img/" + str2 + (index + 1) + ".jpg");
    });
}
function itemHover(){
    var $this,parentId;
    if($(window).width() >= 992){
        $("#prodDesi,#picDesi").find(".item").hover(function(){
            $this = $(this);
            parentId = $this.parent().attr("id");
            if(parentId === "proDesList") {
                allShow("prodDesc", $this);
            }
            if(parentId === "picDesList"){
                allShow("picDesc",$this)
            }
        },function(event){
            $this = $(this);
            parentId = $this.parent().attr("id");
            if(parentId === "proDesList") {
                maskShow("prodDesc", $this);
            }
            if(parentId === "picDesList"){
                maskShow("picDesc",$this)
            }
        });
    }
}
function maskShow(str,$this){
    var dataIndex = $this.attr("data-index");
    $this.find("img").attr("src","../img/" + str + dataIndex + ".jpg");
}
function allShow(str,$this){
    var dataIndex = $this.attr("data-index");
    $this.find("img").attr("src","../img/" + str + dataIndex + "_1.jpg");
}
untilEvent.addEvent(window,'load',getOuter);
untilEvent.addEvent(window,'load',itemHover);