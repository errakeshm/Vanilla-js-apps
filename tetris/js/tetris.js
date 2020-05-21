const Color = {
    BLUE: 1,
    GREEN: 2,
    NAVY: 3,
    PEACH: 4,
    PINK: 5,
    PURPLE: 6,
    YELLOW: 7
}

const Type = {
    SQUARE: 1,
    LSHAPE: 2,
    TSHAPE: 3
}

const Configuration= {
    MATRIX_SIZE : 3,
    GAME_MATRIX_SIZE : 60,
    BLOCK_HEIGHT :10
}

const GameConfiguration = {
   HEIGHT: Configuration.BLOCK_HEIGHT * Configuration.GAME_MATRIX_SIZE,
   WIDTH: Configuration.BLOCK_HEIGHT * Configuration.GAME_MATRIX_SIZE,
}

class Element {
    constructor(color, type, rotation) {
        this.color = color;
        this.type = type;
        this.rotation = rotation;
    }
    // Matrix that will store the structure of the element
    matrix = [];
    init() {
        let pMatrix = new Array(Configuration.MATRIX_SIZE);
        for (let i = 0; i < Configuration.MATRIX_SIZE; i++) {
            pMatrix[i] = new Array(Configuration.MATRIX_SIZE);
            for (let j = 0; j < Configuration.MATRIX_SIZE; j++) {
                pMatrix[i][j] = 0;
            }

        }
        return pMatrix;
    }
    build() {
        this.matrix = this.init();
        let middle = Math.floor(Configuration.MATRIX_SIZE / 2);
        for (let i = 0; i < Configuration.MATRIX_SIZE; i++) {
            for (let j = 0; j < Configuration.MATRIX_SIZE; j++) {
                switch (this.type) {
                    case Type.SQUARE:
                        this.matrix[i][j] = 1;
                        break;
                    case Type.LSHAPE:
                        if (j == 0 || (i == Configuration.MATRIX_SIZE - 1 && j < Configuration.MATRIX_SIZE - 1))
                            this.matrix[i][j] = 1;
                        else
                            this.matrix[i][j] = 0;
                        break;
                    case Type.TSHAPE:
                        if ((i >= middle && j == middle) || (i == Configuration.MATRIX_SIZE - 1)) {
                            this.matrix[i][j] = 1;
                        } else {
                            this.matrix[i][j] = 0;
                        }
                        break;
                }
            }
        }
        this.rotate(this.rotation);
       console.error(this.matrix);
    }

    rotate(noOfRotations) {
        let newMatrix = this.init();
        if (noOfRotations > 0) {
            for (let i = 0; i < Configuration.MATRIX_SIZE; i++) {
                for (let j = 0; j < Configuration.MATRIX_SIZE; j++) {
                    if (this.matrix[i][j] == 1)
                        newMatrix[j][Configuration.MATRIX_SIZE - i - 1] = this.matrix[i][j];
                }
            }
            this.matrix = newMatrix;
        }
        if (--noOfRotations > 0) {
            this.rotate(noOfRotations);
        }
    }

  
}

class Game {
    constructor(){
        this.matrix = this.init();
    }
    matrix = [];
    score = 0;
    initialized = false;
    init() {

        let pMatrix = new Array(Configuration.GAME_MATRIX_SIZE);
        for (let i = 0; i < Configuration.GAME_MATRIX_SIZE; i++) {
            pMatrix[i] = new Array(Configuration.GAME_MATRIX_SIZE);
            for (let j = 0; j < Configuration.GAME_MATRIX_SIZE; j++) {
                pMatrix[i][j] = 0;
            }

        }
        return pMatrix;
    }
    initGame(element){
        document.querySelector('.result').setAttribute("style",
        "width:"+GameConfiguration.WIDTH + 'px;'+"height:"+GameConfiguration.HEIGHT + 'px;');
        let blockCounter = 0;
        for(let i=0;i<Configuration.MATRIX_SIZE; i++){
            for(let j=0;j<Configuration.MATRIX_SIZE; j++){
                if(element.matrix[i][j]==1){
                    let node = document.createElement('img');
                    node.className = 'block'+ (++blockCounter)+" posAbsolute";
                    node.style="display:block;position:absolute;"
                    node.src = 'images/blue_block.png';
                    node.style.height=Configuration.BLOCK_HEIGHT+"px";
                    node.style.width = Configuration.BLOCK_HEIGHT+"px";
                    document.querySelector('.result').appendChild(node);
                }
            }
        }
    }

    playGame(element){
        this.initGame(element);
        this.play(element);
    }

    play(element, posX=(Math.floor(Configuration.GAME_MATRIX_SIZE/2)), posY=1){
        setInterval(()=>{
            posY++;
            this.draw(element, posX, posY);
            if(this.hasReachedBottom(element,posX,posY)){
                posX = (Math.floor(Configuration.GAME_MATRIX_SIZE/2));
                posY = 1;
            }
        },2000);
    }

    hasReachedBottom(element, posX,posY){
        if(posY==Configuration.GAME_MATRIX_SIZE-1 || posY+Configuration.MATRIX_SIZE == Configuration.GAME_MATRIX_SIZE){
            return true;
        } else{
            let collisionArray = new Array(Configuration.MATRIX_SIZE);
            for(let i=0;i<Configuration.MATRIX_SIZE; i++){
                for(let j=0;j<Configuration.MATRIX_SIZE;j++){
                    if(element.matrix[i][j]==1){
                        console.log(i,j);
                        collisionArray[j]=[posX+i,posY+j];
                    }
                }
            }
            
            console.log(collisionArray)
            for(let index of collisionArray){
                if(this.matrix[index[0]][index[1]+1] == 1){
                    return true;
                }
            }
        }
    }

    draw(element, posX, posY){
        let maxPosY = posY + Configuration.MATRIX_SIZE;
        let maxPosX = posX + Configuration.MATRIX_SIZE;
        let sqI = 0, sqJ = 0;
        
        this.clearMatrix(maxPosY>0?maxPosY-1:maxPosY);
        for(let i=posX; i<maxPosX; i++, sqI++){
            sqJ=0;
            for(let j=posY; j<maxPosY; j++, sqJ++){
                this.matrix[i][j] = 0;
                this.matrix[i][j] = element.matrix[sqI][sqJ];
            }
        }
        this.paint(posX,posY);
    }
    clearMatrix(fromPosY){
        for(let i=fromPosY;i<fromPosY+Configuration.MATRIX_SIZE;i++){
            for(let j=0;j<Configuration.GAME_MATRIX_SIZE;j++){
                this.matrix[i][j] = 0;
            }
        }
    }
    paint(posX, posY){
        let counter = 0;
        for(let i=posX;i<posX+Configuration.MATRIX_SIZE;i++){
            for(let j=posY;j<posY+Configuration.MATRIX_SIZE;j++){
                if(this.matrix[i][j] == 1){
                    let node = document.querySelector(".block"+(++counter));
                    node.style.top =  (j*Configuration.BLOCK_HEIGHT)+"px";
                    node.style.left = (i*Configuration.BLOCK_HEIGHT)+"px";
                }
            }
        }
    }
}


class CommonUtils {
    static print(pMatrix, size) {
        for (let i = 0; i < size; i++) {
            let rowData = '';
            for (let j = 0; j < size; j++) {
                if (pMatrix[i][j] == 0) {
                    rowData = rowData + '0';
                } else {
                    rowData = rowData + '1';
                }
            }
            console.log(rowData);
        }
    }
}

let lshapedElement = new Element(1, 3, 1);
lshapedElement.build();

let game = new Game()
game.playGame(lshapedElement);