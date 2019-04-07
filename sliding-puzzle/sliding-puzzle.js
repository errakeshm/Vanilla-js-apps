
(function(){
    const Utility ={
        generateRandom:function(size,end){
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
            this.problemSize = size;
            this.entries=Utility.generateRandom(size);
            this.currentHolePosition = null;
            this.eachElementSize = 50;
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
            for(let i=0;i<this.problemSize*this.problemSize;i++){
                if(i!=this.entries[i]-1){
                    return false;
                }
            }
            return true;
        }
    }
    document.getElementById("clickme").addEventListener('click',function(event){
        
        let size = event.target.parentNode.querySelector("#input-size").value;

        //Define the problem
        let problem = new Problem(size*size-1);

        //shuffle the array
        problem.shuffleArray();

        let puzzleDiv = document.getElementsByClassName('puzzle')[0];
        puzzleDiv.innerHTML='';
        puzzleDiv.style.height=puzzleDiv.style.width=`${(size*(problem.eachElementSize))}px`;
        
        //Set the random hole
        problem.setHole();

        //construct the divs
        for(let i =0;i<=problem.problemSize;i++){
            let xPos = i%size;
            let yPos = Math.floor(i/size);
            let initial = yPos*size;
            let maximum = initial+size;

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
                    let currPosition = targetDiv.getAttribute('position');
                    if(currPosition-1==problem.setHole){
                        
                    }
                    if(!problem.checkIfSet()){

                    }
                });
            }   
        }
    });
})();