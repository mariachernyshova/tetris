import { tetrominoes } from "./tetrominoes.js";

// механика игры
export class Game {
    area = [
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['x','o','o','o','o','o','o','o','o','o'],
        ['x','o','o','o','o','o','o','o','o','o'],
        ['x','o','o','o','o','o','o','o','o','x'],
        ['x','x','o','x','x','o','o','o','o','x'],
        ['x','x','x','x','x','o','o','o','x','x'],
    ];

    activeTetromino = this.createTetromino();

    nextTetromino = this.createTetromino();

    createTetromino() {
        const keys = Object.keys(tetrominoes);
        const letterTetromino = keys[Math.floor(Math.random() * keys.length)];
        const rotation = tetrominoes[letterTetromino];
        const rotationIndex = Math.floor(Math.random() * 4);
        const block = rotation[rotationIndex];

        return {
            x: 3,
            y: 0,
            block, //текущий блок по индексу
            rotationIndex, //индекс положения блока
            rotation, //все варианты расположения текущего блока
        }
    }

    changeTetromino() {
        this.activeTetromino = this.nextTetromino;
        this.nextTetromino = this.createTetromino();
    }

    moveLeft() {
        if (this.checkOutPosition(this.activeTetromino.x - 1, this.activeTetromino.y)) {
            this.activeTetromino.x -= 1;
        }
    }

    moveRight() {
        if (this.checkOutPosition(this.activeTetromino.x + 1, this.activeTetromino.y)) {
            this.activeTetromino.x += 1;
        }
    }

    moveDowm() {
        if (this.checkOutPosition(this.activeTetromino.x, this.activeTetromino.y + 1)) {
            this.activeTetromino.y += 1;
        } else {
            this.stopMove();
        }
    }

    rotateTetromino() {
        this.activeTetromino.rotationIndex = this.activeTetromino.rotationIndex < 3 
            ? this.activeTetromino.rotationIndex + 1
            : 0;

        this.activeTetromino.block = this.activeTetromino.rotation[this.activeTetromino.rotationIndex];

        if (!this.checkOutPosition(this.activeTetromino.x, this.activeTetromino.y)) {
            this.activeTetromino.rotationIndex = this.activeTetromino.rotationIndex > 0 
                ? this.activeTetromino.rotationIndex - 1
                : 3;

            this.activeTetromino.block = this.activeTetromino.rotation[this.activeTetromino.rotationIndex];
        }
    }

    get viewArea() {
        const area = JSON.parse(JSON.stringify(this.area));
        const {x, y, block: tetromino} = this.activeTetromino;

        for (let i = 0; i < tetromino.length; i++) {
            const row = tetromino[i];

            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 'o') {
                    area[y + i][x + j] = tetromino[i][j];
                }
            }
        }

        return area;
    }

    checkOutPosition(x, y) {
        const tetromino = this.activeTetromino.block;
        for (let i = 0; i < tetromino.length; i++) {
            const row = tetromino[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] === 'o') continue;
                
                if (!this.area[y + i] 
                    || !this.area[y + i][x + j] 
                    || this.area[y + i][x + j] !== 'o'
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    stopMove() {
        const {x, y, block: tetromino} = this.activeTetromino;

        for (let i = 0; i < tetromino.length; i++) {
            const row = tetromino[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 'o')
                    this.area[y + i][x + j] = row[j];
            }
        }

        this.changeTetromino();
    }
}