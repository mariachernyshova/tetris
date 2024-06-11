
export class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;

    }

    init(codeKey) {
        const handler = (event) => {
            if (event.code === codeKey) {
                this.view.init();
                this.start();
                window.removeEventListener('keydown', handler);
            }
        };
        window.addEventListener('keydown', handler);
    }

    start() {
        this.view.showArea(this.game.viewArea);

        const showScore = this.view.createBlockScore();
        const showNextTetramino = this.view.createBlockNextTetramino();

        const showHint = this.view.createHintPanel();
        this.game.createUpdatePanels(showScore, showNextTetramino);

        const tick = () => {
            const time = (1100 - 100 * this.game.level);
            if (this.game.gameOver) {
                this.view.showEndGameModal();
                return
            }
            setTimeout(() => {
                if (!this.game.pause) {
                    this.game.moveDown();
                }
                
                this.view.showArea(this.game.viewArea);
                tick();
            }, time > 100 ? time : 100);
        }

        tick();

        window.addEventListener('keydown', (event) => {
            const key = event.code;
            if (key === 'ShiftRight') {
                this.game.pause = !this.game.pause;

                if (this.game.pause) {
                    this.view.showPauseModal();
                } else {
                    this.view.closeModal();
                }
            }

            if (this.game.pause) return;
            if (this.game.gameOver) {
                this.view.showEndGameModal();
            }
            switch (key) {
                case 'ArrowLeft':
                    this.game.moveLeft();
                    this.view.showArea(this.game.viewArea);
                    break;
                    
                case 'ArrowRight':
                    this.game.moveRight();
                    this.view.showArea(this.game.viewArea);
                    break;
                case 'ArrowDown':
                    this.game.moveDown();
                    this.view.showArea(this.game.viewArea);
                    break;
                case 'ArrowUp':
                    this.game.rotateTetramino();
                    this.view.showArea(this.game.viewArea);
                    break;
                default: break;
            }
        })
    }
}
