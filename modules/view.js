import { COLUMNS, ROWS, SIZE_BLOCK } from "../index.js";

export class View {
    constructor(container) {
        this.container = container;
        this.preview();
    }

    colors = {
        J: 'FireBrick', // todo заменить цвета
        I: 'CadetBlue',
        O: '#e18d41',
        L: '#7d1356',
        2: '#134a7d',
        T: 'Indigo',
        S: 'Pink',
    };
    canvas = document.createElement('canvas');
    // context = this.canvas.getContext('2d');

    preview() {
        this.container.textContent = '';
        const preview =  document.createElement('div');
        preview.innerHTML = "Press ENTER to start";
        preview.style.cssText = `
            border: 3px solid black;
            font-size: 18px;
            text-align: center;
            padding: 50px;
            grid-column: 1 / 4;
        `;

        this.container.append(preview);
    }

    init() {
        this.container.textContent = '';
        this.canvas.style.gridArea = 'game';
        this.canvas.classList.add('game-area');
        this.container.append(this.canvas);
        this.canvas.width = SIZE_BLOCK * COLUMNS;
        this.canvas.height = SIZE_BLOCK * ROWS;
    }

    createBlockScore() {
        const scoreBlock = document.createElement('div');
        scoreBlock.style.cssText = `
            border: 2px solid black;
            font-size: 18px;
            text-align: center;
            padding: 20px;
            grid-area: score;
        `;

        const linesElem = document.createElement('p');
        const scoreElem = document.createElement('p');
        const levelElem = document.createElement('p');
        const recordElem = document.createElement('p');

        scoreBlock.append(linesElem, scoreElem, levelElem, recordElem);

        this.container.append(scoreBlock);

        return (lines, score, level, record) => {
            linesElem.textContent = `lines: ${lines}`;
            scoreElem.textContent = `score: ${score}`;
            levelElem.textContent = `level: ${level}`;
            recordElem.textContent = `record: ${record}`;
        }
    }

    createBlockNextTetramino() {
        const tetraminoBlock = document.createElement('div');
        tetraminoBlock.style.cssText = `
            border: 2px solid black;
            width: ${SIZE_BLOCK * 4}px;
            height: ${SIZE_BLOCK * 4}px;
            padding: 10px;
            grid-area: next;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        tetraminoBlock.append(canvas);

        this.container.append(tetraminoBlock);

        return (tetramino) => {
            canvas.width = SIZE_BLOCK * tetramino.length;
            canvas.height = SIZE_BLOCK * tetramino.length;
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            for (let y = 0; y < tetramino.length; y++) {
                const line = tetramino[y];
        
                for (let x = 0; x < line.length; x++) {
                    const block = line[x];
                    if (block !== 'o') {
                        context.fillStyle = this.colors[block];
                        context.strokeStyle = 'white';
                        context.fillRect(x*SIZE_BLOCK, y*SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
                        context.strokeRect(x*SIZE_BLOCK, y*SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
                    }
                }
            }
        }
    }

    createHintPanel() {
        const hintPanel = document.createElement('div');
        hintPanel.innerHTML = "Press <p><b>Right Shift</b></p> to pause";
        hintPanel.style.cssText = `
            border: 2px solid black;
            font-size: 18px;
            text-align: center;
            padding: 10px;
            grid-area: hint;
        `;

        this.container.append(hintPanel);
    }

    showPauseModal() {
        const popupBg = document.querySelector('.popup__bg');
        popupBg.classList.add('active');


        const pauseModal =  document.createElement('div');
        pauseModal.className = 'popup active';
        pauseModal.innerHTML = "Press RIGHT SHIFT to continue";

        popupBg.append(pauseModal);
    }

    closeModal() {
        const popupBg = document.querySelector('.popup__bg');
        popupBg.innerHTML = '';
        popupBg.classList.remove('active');
    }
    
    showArea(area) {
        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        for (let y = 0; y < area.length; y++) {
            const line = area[y];
    
            for (let x = 0; x < line.length; x++) {
                const block = line[x];
                if (block !== 'o') {
                    context.fillStyle = this.colors[block];
                    context.strokeStyle = 'white';
                    context.fillRect(x*SIZE_BLOCK, y*SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
                    context.strokeRect(x*SIZE_BLOCK, y*SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
                } else {
                    context.strokeStyle = '#9191911c';
                    context.strokeRect(x*SIZE_BLOCK, y*SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
                }
            }
        }
    }
}
