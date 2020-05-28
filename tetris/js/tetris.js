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

const Configuration = {
    MATRIX_SIZE: 3,
    GAME_MATRIX_SIZE: 40,
    BLOCK_HEIGHT: 10
}

const KeyCodes = {
    LEFT_ARROW: 37,
    RIGHT_ARROW :39,
    DOWN_ARROW : 40
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
                        this.matrix[i][j] = this.color;
                        break;
                    case Type.LSHAPE:
                        if (j == 0 || (i == Configuration.MATRIX_SIZE - 1 && j < Configuration.MATRIX_SIZE - 1))
                            this.matrix[i][j] = this.color;
                        else
                            this.matrix[i][j] = 0;
                        break;
                    case Type.TSHAPE:
                        if ((i >= middle && j == middle) || (i == Configuration.MATRIX_SIZE - 1)) {
                            this.matrix[i][j] = this.color;
                        } else {
                            this.matrix[i][j] = 0;
                        }
                        break;
                }
            }
        }
        this.rotate(this.rotation);
    }

    rotate(noOfRotations) {
        let newMatrix = this.init();
        if (noOfRotations > 0) {
            for (let i = 0; i < Configuration.MATRIX_SIZE; i++) {
                for (let j = 0; j < Configuration.MATRIX_SIZE; j++) {
                    if (this.matrix[i][j] !== 0)
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
    constructor() {
        this.matrix = this.init();
    }
    matrix = [];
    score = 0;
    ctx = null;
    posX = 0;
    posY = (Math.floor(Configuration.GAME_MATRIX_SIZE / 2));
    gameInterval = null;
    buttonPressed = false;
    currentElement = null;

    isButtonPressed(){
        return this.buttonPressed;
    }
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
    initGame(element) {
        var context = document.querySelector('.result');
        context.setAttribute("style",
            "width:" + GameConfiguration.WIDTH + 'px;' + "height:" + GameConfiguration.HEIGHT + 'px;border:1px solid black;');
        context.height = GameConfiguration.HEIGHT;
        context.width = GameConfiguration.WIDTH;
        this.ctx = context.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }

    playGame(element) {
        this.initGame(element);
        this.play(element);
    }

    resume(){
        this.buttonPressed = false;
        this.play(this.currentElement);
    }

    play(element) {
        this.currentElement = element;
        this.gameInterval = setInterval(() => {
            this.posX++;
            this.moveElement(element, 'ArrowDown');
        }, 1000);
    }

    clear(){
        window.clearInterval(this.gameInterval);
    }

    moveLeft(){
        this.buttonPressed = true;
        if(this.posY > 0){
            this.posY--;
            this.moveElement(this.currentElement,'ArrowLeft');
        }
    }

    moveRight(){
        this.buttonPressed = true;
        if(this.posY <= Configuration.GAME_MATRIX_SIZE-Configuration.MATRIX_SIZE){
            this.posY++;
            this.moveElement(this.currentElement,'ArrowRight');
        }
    }

    moveDown(){
        this.buttonPressed = true;
        if(this.posX <= Configuration.GAME_MATRIX_SIZE){
            this.posX++;
            this.moveElement(this.currentElement, 'ArrowDown');
        }
    }

    hasReachedBottom(element, posX, posY) {
        if (posX == Configuration.GAME_MATRIX_SIZE - 1 || posX + Configuration.MATRIX_SIZE == Configuration.GAME_MATRIX_SIZE) {
            console.log("yes")
            return true;
        } else {
            let collisionArray = new Array(Configuration.MATRIX_SIZE);
            collisionArray.fill([-1,-1],0,Configuration.MATRIX_SIZE);

            for (let i = 0; i < Configuration.MATRIX_SIZE; i++) {
                for (let j = 0; j < Configuration.MATRIX_SIZE; j++) {
                    if (element.matrix[i][j] !== 0) {
                        if (i > collisionArray[j][0]){
                            collisionArray[j] = [i, j];
                        }
                    }
                }
            }
            console.log(collisionArray)
            for (let i=0; i< collisionArray.length; i++) {
                let index = collisionArray[i];
                if ( index[0] !== -1 && index[1] !== -1 && this.matrix[posX+index[0]+1][posY+index[1]] !== 0 ) {
                    return true;
                }
            }
        }
        return false;
    }

    moveElement(element, direction){
        this.draw(element, this.posX, this.posY, direction);
            if (this.hasReachedBottom(element, this.posX, this.posY)) {
                this.posX = 1;
                this.posY = (Math.floor(Configuration.GAME_MATRIX_SIZE / 2));
            }
    }
    draw(element, posX, posY , direction) {
        let maxPosY = posY + Configuration.MATRIX_SIZE;
        let maxPosX = posX + Configuration.MATRIX_SIZE;
        let sqI = 0, sqJ = 0;
        this.clearMatrix(posX, posY, maxPosX, maxPosY, direction);
        for (let i = posX; i < maxPosX; i++, sqI++) {
            sqJ = 0;
            for (let j = posY; j < maxPosY; j++, sqJ++) {
                    this.matrix[i][j] = element.matrix[sqI][sqJ];
            }
        }
        this.ctx.clearRect(0, 0, Configuration.GAME_MATRIX_SIZE * Configuration.BLOCK_HEIGHT, Configuration.GAME_MATRIX_SIZE * Configuration.BLOCK_HEIGHT);
        this.paint(element, posX, posY);
    }


    clearMatrix(posX, posY, maxPosX, maxPosY, direction) {
        console.log(direction)
        for (let i = 0; i < maxPosX; i++) {
            for (let j = 0; j < Configuration.GAME_MATRIX_SIZE; j++) {
                if ( (direction == 'ArrowDown' && (i >= posX-2 && i<posX && j>=posY && j<=maxPosY))
                        || (direction == 'ArrowRight' && (i >= posX && i<maxPosX && j>=posY-2 && j<maxPosY))
                        || (direction == 'ArrowLeft' && (i >= posX && i<maxPosX && j>=maxPosY-2 && j>=maxPosY))
                        
                    //(i >= 0 && i < posX && j >= 0 && j < Configuration.GAME_MATRIX_SIZE)
                   // || (i >= posX && i <= maxPosX && ((j >= 0 && j < posY) || (j >= maxPosY && j < Configuration.GAME_MATRIX_SIZE)))) {
                ){
                    this.matrix[i][j] = 0;
                }
            }
        }
    }

    paint(element, posX, posY) {
        for (let i = 0; i < Configuration.GAME_MATRIX_SIZE; i++) {
            for (let j = 0; j < Configuration.GAME_MATRIX_SIZE; j++) {
                if (this.matrix[i][j] !== 0)
                    this.paintElement(i, j);
            }
        }
    }

    paintElement(x, y) {
        let image = null;
        switch (this.matrix[x][y]) {
            case Color.BLUE:
                image = "blue_block.png";
                break;

            case Color.GREEN:
                image = "green_block.png";
                break;

            case Color.NAVY:
                image = "navy_block.png";
                break;

            case Color.PEACH:
                image = "peach_block.png";
                break;

            case Color.PINK:
                image = "pink_block.png";
                break;

            case Color.PURPLE:
                image = "purple_block.png";
                break;

            case Color.YELLOW:
                image = "yellow_block.png";
                break;
        }
        // console.log(this.ctx);
        if (image != null) {
            let imgObj = new Image();
            imgObj.src = "images/" + image;
            imgObj.onload = function (ctx) {
                ctx.drawImage(imgObj, y * Configuration.BLOCK_HEIGHT, x * Configuration.BLOCK_HEIGHT, Configuration.BLOCK_HEIGHT, Configuration.BLOCK_HEIGHT);
            }(this.ctx);
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


window.addEventListener('load', function () {

    let lshapedElement = new Element(1, 3, 1);
    lshapedElement.build();

    let game = new Game()
    game.playGame(lshapedElement);

    document.addEventListener('keyup',function(event){
        event.preventDefault();
        event.stopPropagation();
        let key = event.key || event.keyCode;
        if( key === 37 || key === 'ArrowLeft' ){
            game.resume();
        } else if(key === 39 || key === 'ArrowRight'){
            game.resume();
        } else if(key === 40 || key === 'ArrowDown'){
            game.resume();
        }
    });

    document.addEventListener('keydown',function(event){
        event.preventDefault();
        event.stopPropagation();
        let key = event.key || event.keyCode;
        if( key === 37 || key === 'ArrowLeft' ){
            if(!game.isButtonPressed())
                game.clear();
            game.moveLeft();
        } else if(key === 39 || key === 'ArrowRight'){
            if(!game.isButtonPressed())
                game.clear();
            game.moveRight();
        } else if(key === 40 || key === 'ArrowDown'){
            if(!game.isButtonPressed())
                game.clear();
            game.moveDown();
        }
    });
})