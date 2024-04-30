import { tetraminoes } from "./tetraminoes.js";
import { ROWS, COLUMNS } from "../index.js";
// механика игры
export class Game {
    score = 0;
    lines = 0;
    level = 1;
    record = localStorage.getItem('tetris-record') || 0;
    viewSizeTetromino = 0;

    points = [0, 100, 300, 700, 1500];

    //todo create game over modal
    gameOver = false;
    pause = false;

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
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
        ['o','o','o','o','o','o','o','o','o','o'],
    ];

    activeTetramino = this.createTetramino();
    nextTetramino = this.createTetramino();

    createTetramino() {
        const keys = Object.keys(tetraminoes);
        const letterTetramino = keys[Math.floor(Math.random() * keys.length)];
        const rotation = tetraminoes[letterTetramino];
        const rotationIndex = Math.floor(Math.random() * 4);
        const block = rotation[rotationIndex];
        const visibleBlock = [];

        return {
            x: 3,
            y: 0,
            visibleBlock, //текущий блок отображаемый
            block, //текущий блок по индексу
            rotationIndex, //индекс положения блока
            rotation, //все варианты расположения текущего блока
        }
    }

    changeTetramino() {
        if (this.gameOver) return;
        this.activeTetramino = this.nextTetramino;
        this.viewSizeTetromino = 0;
        this.nextTetramino = this.createTetramino();
    }

    moveLeft() {
        if (this.gameOver) return;
        if (this.checkOutPosition(this.activeTetramino.x - 1, this.activeTetramino.y)) {
            this.activeTetramino.x -= 1;
        }
    }

    moveRight() {
        if (this.gameOver) return;
        if (this.checkOutPosition(this.activeTetramino.x + 1, this.activeTetramino.y)) {
            this.activeTetramino.x += 1;
        }
    }

    moveDown() {
        if (this.gameOver) return;
        if (this.checkOutPosition(this.activeTetramino.x, this.activeTetramino.y + 1)) {
            if (this.viewSizeTetromino == this.activeTetramino.block.length)
                this.activeTetramino.y += 1;
        } else {
            this.stopMove();
        }
    }

    rotateTetramino() {
        this.activeTetramino.rotationIndex = this.activeTetramino.rotationIndex < 3 
            ? this.activeTetramino.rotationIndex + 1
            : 0;

        this.activeTetramino.block = this.activeTetramino.rotation[this.activeTetramino.rotationIndex];

        if (!this.checkOutPosition(this.activeTetramino.x, this.activeTetramino.y)) {
            this.activeTetramino.rotationIndex = this.activeTetramino.rotationIndex > 0 
                ? this.activeTetramino.rotationIndex - 1
                : 3;

            this.activeTetramino.block = this.activeTetramino.rotation[this.activeTetramino.rotationIndex];
        }
    }

    cutBlock(size, tetramino) {
        const cutBlock = [];

        // Loop to initialize 2D array elements.
        for (let i = 0; i < size; i++) {
            cutBlock[i] = [];
            for (let j = 0; j < tetramino[i].length; j++) {
                cutBlock[i][j] = tetramino[tetramino[i].length - size + i][j];
            }
        }
        // console.log('cutBlock: ', cutBlock);

        return cutBlock;
    }

    returnValidBlock(size, tetramino) {
        let validBlock = false;
        let currSize = size;
        let cutBlock = [];
        while (!validBlock) {
            cutBlock = this.cutBlock(currSize, tetramino);

            for (let i = 0; i < cutBlock.length; i++) {
                const row = cutBlock[i];
    
                for (let j = 0; j < row.length; j++) {
                    if (row[j] !== 'o') {
                        validBlock = true;
                        break;
                    }
                }
            }

            if (!validBlock) currSize++;
        }

        return cutBlock;
    }

    get viewArea() {
        const area = JSON.parse(JSON.stringify(this.area));
        const {x, y, block: tetramino} = this.activeTetramino;

        if (this.gameOver) return area;

        if (this.viewSizeTetromino != tetramino.length) {
            this.viewSizeTetromino++;
            this.activeTetramino.visibleBlock = this.cutBlock(this.viewSizeTetromino, tetramino);
            // console.log('this.activeTetramino.visibleBlock: ', this.activeTetramino.visibleBlock);
        } else {
            this.activeTetramino.visibleBlock = tetramino;
        }

        for (let i = 0; i < this.activeTetramino.visibleBlock.length; i++) {
            const row = this.activeTetramino.visibleBlock[i];

            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 'o') {
                    area[y + i][x + j] = this.activeTetramino.visibleBlock[i][j];
                }
            }
        }

        return area;
    }

    checkOutPosition(x, y, tetramino = null) {
        if (tetramino == null) {
            tetramino = this.activeTetramino.visibleBlock;
        }
        // console.log('checkOutPosition tetramino: ', tetramino);
        // console.log('checkOutPosition this.area: ', this.area);

        for (let i = 0; i < tetramino.length; i++) {
            const row = tetramino[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] === 'o') continue;
                
                if (!this.area[y + i] 
                    || !this.area[y + i][x + j] 
                    || this.area[y + i][x + j] !== 'o'
                ) {
                    if (this.area[y + i] >= 0 && this.area[y + i] <= 1)
                        this.gameOver = true;
                    return false;
                }
            }
        }

        return true;
    }

    stopMove() {
        const {x, y, visibleBlock: tetramino} = this.activeTetramino;
        // console.log('tetramino stopMove: ', tetramino);

        for (let i = 0; i < tetramino.length; i++) {
            const row = tetramino[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 'o')
                    this.area[y + i][x + j] = row[j];
            }
        }
        
        if (this.activeTetramino.block.length != this.viewSizeTetromino) {
            this.gameOver = true;
            // console.log('this.gameOver: ', this.gameOver);
            return;
        }

        this.changeTetramino();
        const countRow = this.clearRow();
        this.calcScore(countRow);
        this.updatePanels();
        this.gameOver = !this.checkOutPosition(this.activeTetramino.x, this.activeTetramino.y, this.returnValidBlock(1, this.activeTetramino.block));
        if (this.gameOver) {
            // console.log('this.gameOver: ', this.gameOver);
        }
    }

    clearRow() {
        const rows = [];

        for (let i = ROWS - 1; i >= 0; i--) {
            let countBlock = 0;
            for (let j = 0; j < COLUMNS; j++) {
                if (this.area[i][j] !== 'o') {
                    countBlock += 1;
                }
            }

            if (!countBlock) break;
            if (countBlock == COLUMNS) {
                rows.unshift(i); // добавляем в начало, так как удалять будем сверху вниз
            }
        }

        rows.forEach(i => {
            this.area.splice(i, 1);
            this.area.unshift(Array(COLUMNS).fill('o'));
        });

        return rows.length;
    }

    calcScore(lines) {
        this.score += lines > 4 ? this.points[3] : this.points[lines];
        this.lines += lines;
        this.level = Math.floor(this.lines / 10) + 1;

        if (this.score > this.record) {
            this.record = this.score;
            localStorage.setItem('tetris-record', this.record);
        }
    }

    createUpdatePanels(showScore, showNextTetramino) {
        showScore(this.lines, this.score, this.level, this.record);
        showNextTetramino(this.nextTetramino.block);

        this.updatePanels = () => {
            showScore(this.lines, this.score, this.level, this.record);
            showNextTetramino(this.nextTetramino.block);
        }
    }
}