import { show } from './view/calculator.js';

function app(window){
    let globalObject = window[window['calculator']];
    let queue = globalObject.q;
    if(queue){
        for(var i=0; i<queue.length;i++){
            apiHandler(queue[i][0]);
        }
    }

    globalObject = apiHandler;
}
function apiHandler(){
    show();
    
}
app(window);