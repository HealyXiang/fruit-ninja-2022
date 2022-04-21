// interface Fruit {
//   id: string;
//   type: string;
//   score: number;
//   isCutted: boolean;
//   icon: string;
//   position: { x: number; y: number };
// }

/*
Fruit类
 1.更新自身属性
 2.绘制
 3.裂开效果
水果队列管理类
 
Engin类 控制整个游戏流程
 1.轮询更新水果状态，调用每个水果的update draw
 2.计算积分
 3.加入新的水果
touchmove事件判断切中了水果
通过水果圆点和鼠标坐标及半径判断
 */

const Canvas_Height = 400;
const Canvas_Width = 300;

function loop(duration: number, callback: Function, times?: number) {
  let timer: NodeJS.Timer;
  timer = setTimeout(() => {
    callback();
    clearTimeout(timer);
    return loop(duration, callback);
  }, duration);
}

class Fruit {
  id: number;
  type: string;
  score: number;
  isCutted: boolean;
  icon: string;
  position: { x: number; y: number };
  radius: number;
  speed: number;

  constructor(x: number) {
    this.id = 1;
    this.type = "apple";
    this.score = 20;
    this.position = { x, y: Canvas_Height };
    this.isCutted = false;
    this.icon = "ddd";
    this.radius = 20;
    this.speed = -10;
  }

  update() {
    const { x, y } = this.position;
    if (this.isCutted) {
      // TODO:处理被切开的水果位置等
    } else {
      if (y < 2 * this.radius) {
        this.speed = -this.speed;
      }
      this.position.y += this.speed;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position;
    ctx.beginPath();
    // ctx.fillStyle = "#FA6900";
    // ctx.shadowOffsetX = 5;
    // ctx.shadowOffsetY = 5;
    // ctx.shadowBlur = 4;
    // ctx.shadowColor = "rgba(204, 204, 204, 0.5)";
    // ctx.fillRect(x, y, 15, 15);

    ctx.fillStyle = "#FA6900";
    ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
    // ctx.save();
  }

  cut() {}

  isCut(x: number, y: number) {
    //TODO: 判断鼠标位置是否在水果里面
  }

  transferType() {
    this.isCutted = true;
  }
}

// TODO: 添加新的类
class FruitsQueue {
  newFruits: Fruit[];
  cuttedFruits: Fruit[];

  canvasWidth: number;
  canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.newFruits = [];
    this.cuttedFruits = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  getNewFruits() {
    return this.newFruits;
  }

  getCuttedFruits() {
    return this.cuttedFruits;
  }

  traverseNewFruits(callback: Function) {
    for (let i = 0; i < this.newFruits.length; i++) {
      callback(this.newFruits[i]);
    }
  }

  traverseCuttedFruits(callback: Function) {
    for (let i = 0; i < this.cuttedFruits.length; i++) {
      callback(this.cuttedFruits[i]);
    }
  }

  deleteNewFruit(index: number) {
    return this.newFruits.splice(index, 1);
  }

  transfer(index: number) {
    const changedFruits = this.deleteNewFruit(index);
    changedFruits.forEach((item) => item.transferType());
    this.cuttedFruits.push(...changedFruits);
  }

  private getInitX(num: number) {
    // TODO: 优化 增加随机性
    let res = [];
    const offset = 24;
    const baseWidth = Math.floor(this.canvasWidth / num);
    for (let i = 0; i < num; i++) {
      res.push(i * baseWidth + offset);
    }
    return res;
  }

  addNewFruits(num: number) {
    const initXArr = this.getInitX(num);
    while (num > 0) {
      this.newFruits.push(new Fruit(initXArr[num - 1]));
      num--;
    }
  }
}

export class Engine {
  newFruits: Fruit[];
  cuttedFruits: Fruit[];
  totalScore: number;
  isPause: boolean;
  ctx: CanvasRenderingContext2D | null;
  canvasWidth: number;
  canvasHeight: number;
  fruitsQueue: FruitsQueue;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.fruitsQueue = new FruitsQueue(canvasWidth, canvasHeight);
    this.newFruits = [];
    this.cuttedFruits = [];
    this.totalScore = 0;
    this.isPause = false;
    this.ctx = ctx;
  }

  start() {
    if (!this.ctx) {
      return;
    }
    const FPS = 20;
    const duration = 1000 / FPS;

    const update = this.update;
    // let timer = setInterval(() => {
    //   if (leftTimes > 0) {
    //     update.call(this);
    //     leftTimes--;
    //   } else {
    //     clearInterval(timer);
    //     return;
    //   }
    // }, duration);
    loop(duration, update.bind(this));
  }

  update() {
    if (!this.ctx) {
      return;
    }
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    if (this.fruitsQueue.getNewFruits().length < 1) {
      this.fruitsQueue.addNewFruits(5);
    }
    const newFruits = this.fruitsQueue.getNewFruits();
    for (let i = 0; i < newFruits.length; i++) {
      newFruits[i].update();
      if (newFruits[i].position.y > this.canvasHeight) {
        this.fruitsQueue.deleteNewFruit(i);
      }
    }
    for (const newFruit of this.fruitsQueue.getNewFruits()) {
      newFruit.draw(ctx);
    }
  }

  cut() {}
}

export {};
