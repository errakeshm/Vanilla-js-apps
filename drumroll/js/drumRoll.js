/*
<div class="drum" id="A">
                <span>A</span>
                <span>CLAP</span>
            </div>
*/
var drumData=[{key:"A",sound:"CLAP"},
             {key:"S",sound:"HIHAT"},
             {key:"D",sound:"KICK"},
             {key:"F",sound:"OPENHAT"},
             {key:"G",sound:"BOOM"},
             {key:"H",sound:"RIDE"},
             {key:"J",sound:"SNARE"},
             {key:"K",sound:"TOM"},
             {key:"L",sound:"TINK"}];

(function(){
        var divElement="";
        for(var i=0;i<drumData.length;i++){
            divElement=divElement+'<div class="drum" id="'+drumData[i].key+'"><span>'+drumData[i].key+'</span><span>'+drumData[i].sound+'</span></div>'
        }
        
        document.getElementById("main").innerHTML=divElement;
    
    document.onkeydown = function(event){
        var keyCode =String.fromCharCode(event.keyCode).toUpperCase();
        const audio = document.querySelector('audio[data-key="'+keyCode+'"]');
        if(!audio){
            alert("yes");
            return;
        }
        document.getElementById(keyCode).classList.add("hitit");
        audio.currentTime=0;
        audio.play();
    }
    document.onkeyup = function(event){
        var keyCode = String.fromCharCode(event.keyCode).toUpperCase();
        document.getElementById(keyCode).classList.remove("hitit");
    }
})(document);