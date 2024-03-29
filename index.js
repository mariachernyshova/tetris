import { Controller } from "./modules/controller.js";
import { Game } from "./modules/game.js";
import { View } from "./modules/view.js";

export const COLUMNS = 10;
export const ROWS = 20;
export const SIZE_BLOCK = 30;

const game = new Game();

// отрисовка
const view = new View(document.querySelector('.container'));

// управление
const controller = new Controller(game, view);
controller.init('Enter');