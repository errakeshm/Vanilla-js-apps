
(function(){
    const Utility ={
        generateRandom:function(size){
            let arr =  Array.apply(null,{length:size+1}).map(Number.call,Number).map(n=>n+1);
            arr[size+1]=null;
            console.log(arr);
            return arr;
        },
        shuffleArray:function(array,size){
            for(let i=0;i<size;i++){
                let tempIndex = Math.floor(Math.random()*size);
                let tempValue = array[tempIndex];
                array[tempIndex]=array[i];
                array[i]=tempValue;
            }
            return array;
        }
     }
     class Problem{
        constructor(size){
            this.problemSize = size*size-1;
            this.rowSize=Number.parseInt(size);
            this.entries=Utility.generateRandom(this.problemSize);
            this.currentHolePosition = null;
            this.eachElementSize = 50;
           
            console.log(this.rowSize)
        }
        shuffleArray(){
            this.entries = Utility.shuffleArray(this.entries,this.problemSize);
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
            return true;
        }
        swapWithHole(location){
            let temp = this.entries[location];
            this.entries[location] = this.entries[this.currentHolePosition];
            this.entries[this.currentHolePosition]=temp;
        }
    }
    document.getElementById("clickme").addEventListener('click',function(event){
        
        let size = event.target.parentNode.querySelector("#input-size").value;

        //Define the problem
        let problem = new Problem(size);

        //shuffle the array
        problem.shuffleArray();

        let puzzleDiv = document.getElementsByClassName('puzzle')[0];
        puzzleDiv.innerHTML='';
        puzzleDiv.style.height=puzzleDiv.style.width=`${(problem.rowSize*(problem.eachElementSize))}px`;
        
        //Set the random hole
        problem.setHole();

        //construct the divs
        for(let i =0;i<=problem.problemSize;i++){
            let xPos = i%problem.rowSize;
            let yPos = Math.floor(i/problem.rowSize);
            let initial = yPos*problem.rowSize;
            let maximum = initial+problem.rowSize;

            let div = document.createElement('div');
            div.style.height=div.style.width=`${problem.eachElementSize}px`;
            div.style.transform=`translate(${xPos*problem.eachElementSize}px,${yPos*problem.eachElementSize}px)`;
            
            if(problem.currentHolePosition!=i){
                div.classList.add('element');
                div.setAttribute('position',i);
                div.style.lineHeight=`${problem.eachElementSize-5}px`;
                div.innerHTML = problem.entries[i];
                puzzleDiv.append(div);

                //Attach events
                div.addEventListener('click',function(event){
                    let targetDiv = event.target;
                    let currPosition = Number.parseInt(targetDiv.getAttribute('position'));
                    let location = -1;
                    let direction='NA';
                    console.log(currPosition+1,direction,problem.currentHolePosition);
                    if((currPosition-1)===problem.currentHolePosition){
                        location = currPosition-1;
                        direction='L';
                    }else if((currPosition+1)===problem.currentHolePosition){
                        location = currPosition+1;
                        direction='R';
                    }else if((currPosition-problem.rowSize)===problem.currentHolePosition){
                        console.log('upper');
                        location = currPosition-problem.rowSize;
                        direction='U';
                    }else if((currPosition+problem.rowSize)===problem.currentHolePosition){
                        location = currPosition+problem.rowSize;
                        direction='D'
                    }else{
                        console.log('others');
                    }
                    //console.log(currPosition,direction,problem.currentHolePosition,problem.rowSize);
                    if(direction!='NA'){
                       problem.swapWithHole(location);
                       let xPos = location%problem.rowSize;
                       let yPos = Math.floor(location/problem.rowSize);
                       div.setAttribute('position',location);
                       div.style.transform=`translate(${xPos*problem.eachElementSize}px,${yPos*problem.eachElementSize}px)`;
                       problem.currentHolePosition = currPosition;
                       console.log(problem.entries);
                    }

                    if(problem.checkIfSet()){
                        console.log('done');
                    }
                });
            }   
        }
    });
})();