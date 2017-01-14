const hourHand = document.querySelector(".hour");
const minHand=document.querySelector(".min");
const secHand=document.querySelector(".sec");
(function(){
putNumbers();
setInterval(draw,1000);    
})(document);
var degHour=[-90,-60,-30,0,30,60,90,120,150,180,210,240];
function draw(){
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    drawHour(hours,minutes,seconds);
}
function putNumbers(){
    var label = document.querySelector(".numbers");
    var heightOfChild=(document.querySelector("#clock1").offsetHeight-100)/2;
    var widthOfChild=(document.querySelector("#clock1").offsetWidth-100)/2;
    var timeLabelDiv="";
    var xVal=0;
    var yVal=0;
    var angle=0;
    for(var i=0;i<12;i++){
        var val=12;
        yVal=heightOfChild-Math.round(heightOfChild*Math.cos(angle*(Math.PI/180)));
        xVal=Math.round(widthOfChild*Math.sin(angle*(Math.PI/180)));
        if(i>0)
            val=i;
        var spanEle = document.createElement("span");
        spanEle.classList.add("numbers");
        spanEle.textContent=val;
        spanEle.style=`-webkit-transform:translate(${xVal}px,${yVal}px)`;
        label.appendChild(spanEle);
        angle=angle+30;
    }
}
function drawHour(hours,min,sec){
    var deg = (hours%12)*30-90;
    hourHand.style=`-webkit-transform:rotate(${deg}deg)`;
    
    var degMin = min *6-90;
    minHand.style=`-webkit-transform:rotate(${degMin}deg)`;
    
    var degSec=sec*6-90;
    secHand.style=`-webkit-transform:rotate(${degSec}deg)`;
    
    var spanEle = document.querySelectorAll(".numbers > span");
    
    for(var i=0;i<degHour.length;i++){
        if(deg==degHour[i]){
            spanEle[i].classList.add("glow");
        }else{
            spanEle[i].classList.remove("glow");
        }
    }
    if(degMin!=degHour){
        for(var i=0;i<degHour.length;i++){
            if(degMin==degHour[i]){
                spanEle[i].classList.add("glow");
                break;
            }
        }
    }
}