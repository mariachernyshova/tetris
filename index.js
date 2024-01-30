import { Game } from "./modules/game.js";

const SIZE_BLOCK = 30;
const COLUMNS = 10;
const ROWS = 20;

const game = new Game();

// отрисовка
const container = document.querySelector('.container');

const canvas = document.createElement('canvas');
canvas.classList.add('game-area');
container.append(canvas);

canvas.width = SIZE_BLOCK * COLUMNS;
canvas.height = SIZE_BLOCK * ROWS;

const context = canvas.getContext('2d');

const showArea = (area) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < area.length; y++) {
        const line = area[y];

        for (let x = 0; x < line.length; x++) {
            const block = line[x];
            if (block !== 'o') {
                context.fillStyle = 'pink';
                context.strokeStyle = 'white';
                context.fillRect(x*SIZE_BLOCK, y*SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
                context.strokeRect(x*SIZE_BLOCK, y*SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
            }
        }
    }


}

let isStarting = false;

window.addEventListener('keydown', (event) => {
    const key = event.code;

    if (key === 'Enter') isStarting = true;
    if (isStarting) {
        switch (key) {
            case 'ArrowLeft':
                game.moveLeft();
                showArea(game.viewArea);
                break;
                
            case 'ArrowRight':
                game.moveRight();
                showArea(game.viewArea);
                break;
            case 'ArrowDown':
                game.moveDowm();
                showArea(game.viewArea);
                break;
            case 'ArrowUp':
                game.rotateTetromino();
                showArea(game.viewArea);
                break;
            default: break;
        }
    }
})

showArea(game.viewArea);