
(function(){
    const Utility ={
        generateRandom:function(size,end){
            return Array.apply(null,{length:size}).map(Number.call,Number).map(n=>n+1);
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
        }
    }
    document.getElementById("clickme").addEventListener('click',function(event){
        let size = event.target.parentNode.querySelector("#input-size").value;

        //Define the problem
        let problem = new Problem(size*size-1);

        //shuffle the array
        problem.shuffleArray();

        let puzzleDiv = document.getElementsByClassName('puzzle')[0];
        puzzleDiv.style.height=puzzleDiv.style.width=`${(size*(problem.eachElementSize))+20}px`;
        
        //Set the random hole
        problem.setHole();

        //construct the divs
        for(let i =0;i<problem.problemSize;i++){
            let xPos = i%size;
            let yPos = Math.floor(i/size);
            
            let div = document.createElement('div');
            div.classList.add('element');
            div.style.transform=`translate(${xPos*problem.eachElementSize}px,${yPos*problem.eachElementSize}px)`;
            div.style.height=div.style.width=`${problem.eachElementSize}px`;
            div.style.lineHeight=`${problem.eachElementSize-5}px`
            div.innerHTML = problem.entries[i];
            puzzleDiv.append(div);
        }

        //find random position
       
        console.log(problem.currentHolePosition);

        //place the elements


    });
})();