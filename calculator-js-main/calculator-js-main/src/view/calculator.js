import html from './calculator.html';
import './calculator.css';

var textBox = '';
var currentNumber = '';

String.prototype.replaceAt = function(position,replacement){
    let rlength = (replacement.length==0)?1:replacement.length;
    return this.substr(0,position-1)+replacement+this.substr(position-1+rlength,this.length);
}

String.prototype.isEmpty = function(){
    if(this==null||this===undefined)
        return true;
    else{
        if(this.trim()==null||this.trim()===""){
            return true;
        }
    }
    return false;
}

String.prototype.containsFromList = function(list){
    for(let item of list){
        if(item!='' && this.indexOf(item)!=-1)
            return true;
    }
    return false;
}

const map={
    "DIV":"/",
    "PLUS":"+",
    "MINUS":"-",
    "DIV":"/",
    "MULTI":"x",
    "EQ":""
}
export function show(){
    let temp = document.createElement('div');
    temp.innerHTML = html;
    let body = document.getElementsByClassName('calculator')[0];
    while(temp.children.length > 0){
        body.appendChild(temp.children[0]);
    }
    //Adding event listeners for Numbers and dots
    systemOpsListener();
    //Adding event listener for number operation
    speialOpsListener();
    //Adding event listener for system commands like C,CE,DEL
    systemEventListener();
    //handle Drag event
    dragAndDropWidget();

}
var position=[];
function dragAndDropWidget(){
    document.getElementById("calc-widget").addEventListener('dragstart',(event)=>{
        position=[];
        event.dataTransfer.effectAllowed = "move";
        let style = window.getComputedStyle(event.target, null);
        let left = style.getPropertyValue("left");
        let top = style.getPropertyValue("top");
        left = left.replace("px","");
        top = top.replace("px","");
        if(Number.isNaN(left))
            left = 10;
        if(Number.isNaN(top))
            top = 10;
        position.push(left-event.clientX);
        position.push(top-event.clientY);
        event.target.style.cursor = 'move'; 
    });
    document.getElementById("calc-widget").addEventListener('dragover',(event)=>{
        event.preventDefault();
        event.target.style.cursor = 'move'; 
    });
    document.getElementById("calc-widget").addEventListener('dragend',(event)=>{
        event.preventDefault();
        let id = event.target.id;
        document.getElementById(id).style.position='relative';
        document.getElementById(id).style.left=event.clientX+position[0];
        document.getElementById(id).style.top=event.clientY+position[1];
        
    });
}

function systemEventListener(){
    var systemNodeList = document.querySelectorAll("span.system");
    for(let i=0;i<systemNodeList.length;i++){
        let childElement = systemNodeList[i];
        childElement.addEventListener('click',(event)=>{
            let value = event.target.getAttribute("value");
            switch(value){
                case "C":
                    textBox=currentNumber="";
                    break;
                case "CE":
                    currentNumber="";
                    break;
                case "DEL":
                    let totalLen = currentNumber.length;
                    if(totalLen!=0)
                        currentNumber = currentNumber.replaceAt(totalLen,"");
                    break;
            }                     
            document.getElementsByClassName("total-expr")[0].textContent = textBox;
            document.getElementsByClassName("current-number")[0].textContent = currentNumber;
        })
    }
}

function speialOpsListener(){
    var specialNodeList = document.querySelectorAll("span.special-symbols");
    for(let i=0;i<specialNodeList.length;i++){
        let childElement = specialNodeList[i];
        childElement.addEventListener('click',(event)=>{
            let value = event.target.getAttribute("value");
            let lastChar = null;
            let totalLen = textBox.length;
            if(!textBox.isEmpty() && currentNumber.isEmpty() && Number.isNaN(Number.parseFloat(textBox.charAt(totalLen-1))) && Number.isNaN(Number.parseFloat(value))){
                //If the user enters the symbol twice or more
                if(totalLen!=0)
                    textBox = textBox.replaceAt(totalLen,map[value]);
            }else{
                //Evaluate the expression
                if((textBox.containsFromList(Object.values(map)))){
                    textBox = eval(textBox.replace("x","*")+currentNumber)+'';
                }
                //Execute the if block if those are the normal symbols like - + (binary ops), else block of they are unary operation
                if(!textBox.isEmpty() && (map[value]!=null || map[value]!=undefined)){
                    textBox=textBox+map[value];
                    currentNumber="";
                }else{
                    [textBox,currentNumber] = specialFunctionCalculator(textBox,currentNumber,value,null)
                }
            }           
            document.getElementsByClassName("total-expr")[0].textContent = textBox;
            document.getElementsByClassName("current-number")[0].textContent = currentNumber;
        })
    }
}
function specialFunctionCalculator(all,current,symbol,otherSymbol){
    let result = new Array(2);
    let text = (all.isEmpty())?current:all;
    result.fill('',0,2);
    if(!text.isEmpty()){
        switch(symbol){
            case 'INV':
                result[0]=result[0]+(eval('1/'+text));
                result[1]=result[0];
                break;
            case 'SQR':
                result[0]=result[0]+(eval(text+'*'+text));
                result[1]=result[0];
                break;
            case 'CUBE':
                result[0]=result[0]+(eval(text+'*'+text+'*'+text));
                result[1]=result[0];
                break;
            case 'SQRT':
                result[0]=result[0]+(Math.sqrt(Number.parseFloat(text)));
                result[1]=result[0];
                break;
            default:
                result[0]=(text+otherSymbol);
            }
    }
    return result;
}
function systemOpsListener(){
    var numberNodeList = document.querySelectorAll("span.number");
    for(let i=0;i<numberNodeList.length;i++){
        let childElement = numberNodeList[i];
        childElement.addEventListener('click',(event)=>{
            let value = event.target.getAttribute("value");
            switch(value){
                case "dot":
                    let totalLen = currentNumber.length;
                    if(currentNumber.indexOf(".")==-1 && currentNumber.charAt(totalLen-1)!=="."){
                        if(currentNumber.isEmpty()){
                            currentNumber="0.";
                        }else{
                            currentNumber=currentNumber+".";
                        }
                    }
                    break;
                default:
                    currentNumber=currentNumber+value;
                    break;
            }            
            document.getElementsByClassName("total-expr")[0].textContent = textBox;
            document.getElementsByClassName("current-number")[0].textContent = currentNumber;
        })
    }
}
