
(function(){
    const Utility ={
        MAXSIZE:8,
        generateRandom:function(size){
            let arr =  Array.apply(null,{length:size+1}).map(Number.call,Number).map(n=>n+1);
            arr[size]=null;
            //console.log(arr);
            return arr;
        },
        checkFeasibility:function(array,size,rowSize){
            let count = 0;
            for(let i=0;i<size;i++){
                let y = i%rowSize;
                let x = Math.floor(i/rowSize);
                //console.log(x,y,y*rowSize+x,i);
                if(y*rowSize+x!=i && array[i]!=null && array[y*rowSize+x]!=null && array[y*rowSize+x]>array[i]){
                    count++;
                }
            }
            if(count%2==0){
                return false;
            }
            return true;
        },
        shuffleArray:function(array,size,rowSize){
            let flag=false;
            let count=0;
            //console.log(array);
            while(flag==false && count<=10){
                for(let i=0;i<size;i++){
                    let tempIndex = Math.floor(Math.random()*size);
                    let tempValue = array[tempIndex];
                    array[tempIndex]=array[i];
                    array[i]=tempValue;
                }
                flag = this.checkFeasibility(array,size,rowSize);
                count++;
            }
            return array;
        },
        returnXYCoordinates(location,rowSize){
            let xPos = location%rowSize;
            let yPos = Math.floor(location/rowSize);
            return [xPos,yPos];
        }
        
     }
     class Problem{
        constructor(size){
            this.resultDiv = null;
            this.puzzleDiv = null;
            this.centerDiv = null;
            this.holeDiv = null;
            this.init();
        }
        setSize(size){
            this.problemSize = size*size-1;
            this.rowSize=Number.parseInt(size);
            this.entries=Utility.generateRandom(this.problemSize);
            this.currentHolePosition = null;
            this.eachElementSize = 50;
            this.solved = false;
            this.reset();
        }
        shuffleArray(){
            this.entries = Utility.shuffleArray(this.entries,this.problemSize,this.rowSize);
        }
        setHole(){
            this.currentHolePosition = Math.floor(Math.random()*this.problemSize);
            let temp = this.entries[this.currentHolePosition];
            this.entries[this.currentHolePosition]=this.entries[this.problemSize];
            this.entries[this.problemSize]=temp;
        }
        checkIfSet(){
            for(let i=0;i<this.problemSize;i++){
                if(i!=this.entries[i]-1){
                    return false;
                }
            }
            this.solved = true;
            return true;
        }
        swapWithHole(location){
            let temp = this.entries[location];
            this.entries[location] = this.entries[this.currentHolePosition];
            this.entries[this.currentHolePosition]=temp;
        }
        setElementSize(div,xPos,yPos){
            div.style.height=div.style.width=`${this.eachElementSize}px`;
            div.style.transform=`translate(${xPos*this.eachElementSize}px,${yPos*this.eachElementSize}px)`;
            return div;
        }
        translateElement(div,xPos,yPos){
            div.style.transform=`translate(${xPos*this.eachElementSize}px,${yPos*this.eachElementSize}px)`;
            return div;
        }
        translateHole(xPos,yPos){
            this.holeDiv.style.transform=`translate(${xPos*this.eachElementSize}px,${yPos*this.eachElementSize}px)`;
        }
        init(){
            this.resultDiv = document.querySelector('.result');
            this.puzzleDiv = document.getElementsByClassName('puzzle')[0];
            this.centerDiv = document.querySelector('.center');
        }
        reset(){
            this.centerDiv.classList.remove('solved');
            this.puzzleDiv.innerHTML='';
            this.puzzleDiv.style.height=this.puzzleDiv.style.width=`${(this.rowSize*(this.eachElementSize))}px`;
            this.resultDiv.innerHTML = '';
        }
        setResultMessage(text,styleClass,removeClass){
            this.resultDiv.innerHTML = text;
            this.resultDiv.classList.add(styleClass);
            if(removeClass!=null){
                this.resultDiv.classList.remove(removeClass);
            }

            if(styleClass=='success'){
                this.centerDiv.classList.add('solved');
            }
            
        }
    }
    document.getElementById("clickme").addEventListener('click',function(event){
        
        let problem = new Problem();
        let size = event.target.parentNode.querySelector("#input-size").value;
        //document.querySelector('.center').classList.remove('solved');

        //Define the problem
        if(size > Utility.MAXSIZE){
            problem.setResultMessage(`Cannot exceed size : ${Utility.MAXSIZE}`,'error','success')
            return false;
        }else{
            problem.setSize(size);
            
        }
       
        //shuffle the array
        problem.shuffleArray();
        
        //Set the random hole
        problem.setHole();

        //construct the divs
        for(let i =0;i<=problem.problemSize;i++){
            let xPos = i%problem.rowSize;
            let yPos = Math.floor(i/problem.rowSize);
            let initial = yPos*problem.rowSize;
            let maximum = initial+problem.rowSize;

            let div = document.createElement('div');
            div = problem.setElementSize(div,xPos,yPos);

            
            if(problem.currentHolePosition!=i){
                div.classList.add('element');
                div.setAttribute('position',i);
                div.style.lineHeight=`${problem.eachElementSize-5}px`;
                div.innerHTML = problem.entries[i];
                problem.puzzleDiv.append(div);

                //Attach events
                div.addEventListener('click',function(event){
                    if(!problem.solved){
                        let targetDiv = event.target;
                        let currPosition = Number.parseInt(targetDiv.getAttribute('position'));
                        let location = -1;
                        let direction='NA';
                        //console.log(currPosition+1,direction,problem.currentHolePosition);
                        if((currPosition-1)===problem.currentHolePosition){
                            location = currPosition-1;
                            direction='L';
                        }else if((currPosition+1)===problem.currentHolePosition){
                            location = currPosition+1;
                            direction='R';
                        }else if((currPosition-problem.rowSize)===problem.currentHolePosition){
                            location = currPosition-problem.rowSize;
                            direction='U';
                        }else if((currPosition+problem.rowSize)===problem.currentHolePosition){
                            location = currPosition+problem.rowSize;
                            direction='D'
                        }
                        //console.log(currPosition,direction,problem.currentHolePosition,problem.rowSize);
                        if(direction!='NA'){
                            problem.swapWithHole(currPosition);
                            //let xPos = location%problem.rowSize;
                            //let yPos = Math.floor(location/problem.rowSize);
                            let [xPos,yPos] = Utility.returnXYCoordinates(location,problem.rowSize);
                            div.setAttribute('position',location);
                            //div.style.transform=`translate(${xPos*problem.eachElementSize}px,${yPos*problem.eachElementSize}px)`;
                            div = problem.translateElement(div,xPos,yPos);
                            
                            let [xHole,yHole] = Utility.returnXYCoordinates(currPosition,problem.rowSize);
                            problem.translateHole(xHole,yHole);

                            problem.currentHolePosition = currPosition;
                        }

                        if(problem.checkIfSet()){
                            problem.setResultMessage('Problem Solved. Try a new Pattern','success','error');
                        }
                    }
                });
            }else{
                div.classList.add('hole');
                div.style.lineHeight=`${problem.eachElementSize-5}px`;
                problem.holeDiv = div;
                problem.puzzleDiv.append(div);
            }   
        }
    });
})();