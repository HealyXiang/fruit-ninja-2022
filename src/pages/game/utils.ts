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

import rn from "random-number";

const Canvas_Height = 400;
const Canvas_Width = 300;
const Half_Canvas_Width = Canvas_Width / 2;
const Half_Canvas_Height = Canvas_Width / 2;

const G = 30;
const V_Range = { min: 100, max: 120 };
const MinVy = Math.floor(Math.sqrt(G * Half_Canvas_Height));
const MaxVy = Math.floor(Math.sqrt(2 * G * Canvas_Height));
const meterToPixelRatio = 60;

const earth = new Image();
earth.src = "https://mdn.mozillademos.org/files/1429/Canvas_earth.png";

function getCurrentTime(): number {
  return new Date().getTime();
}

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
  initX: number;
  position: { x: number; y: number };
  radius: number;
  speed: { vx: number; vy: number };
  startTime: number;

  constructor(x: number) {
    this.id = 1;
    this.type = "apple";
    this.score = 20;
    this.initX = x;
    this.position = { x, y: 0 };
    this.isCutted = false;
    this.icon = "ddd";
    this.radius = 20;
    this.speed = this.getInitVelocity(x);
    this.startTime = getCurrentTime();
  }

  getInitVelocity(positionX: number): { vx: number; vy: number } {
    let vy = rn({ min: MinVy, max: MaxVy, integer: true });
    vy = MaxVy - vy < 5 ? MaxVy - vy : vy;
    let vx = 0;
    if (positionX > Half_Canvas_Width) {
      const mixVx = -Math.floor((positionX * G) / 2 / vy);
      vx = rn({ min: mixVx, max: 0, integer: true });
    } else {
      const maxVx = Math.floor(((Canvas_Width - positionX) * G) / 2 / vy);
      vx = rn({ min: 0, max: maxVx, integer: true });
    }
    return { vx, vy };
  }

  update() {
    const { x, y } = this.position;
    const { vx, vy } = this.speed;
    // console.table({ x, y });
    const dt = (getCurrentTime() - this.startTime) / 1000;
    // console.log("dt dt:", dt);
    if (this.isCutted) {
      // TODO:处理被切开的水果位置等
    } else {
      // if (y < 2 * this.radius) {
      //   this.speed = -this.speed;
      // }
      // this.position.y += this.speed;
      this.position.x = this.initX + vx * dt;
      this.position.y = vy * dt - (Math.pow(dt, 2) * G) / 2;
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

    // ctx.fillStyle = "#FA6900";
    // ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
    // ctx.fill();
    ctx.drawImage(earth, x, y);
    // ctx.restore();
    // ctx.save();
    // const requestAnimationFrame = window.requestAnimationFrame;
    // const that = this;
    // requestAnimationFrame(() => {
    //   that.draw.bind(that);
    // });
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
    const offset = 40;
    const baseWidth = Math.floor((Canvas_Width - offset) / num);
    for (let i = 0; i < num; i++) {
      // res.push(i * baseWidth + offset);
      res.push(
        rn({ min: i * baseWidth, max: (i + 1) * baseWidth, integer: true })
      );
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
    const FPS = 10;
    const duration = 1000 / FPS;

    const ctx = this.ctx;
    ctx.save();
    ctx.translate(0, Canvas_Height);
    ctx.scale(1, -1);
    // ctx.fillRect(50, 50, 20, 20); // 使用默认设置绘制一个矩形
    // (function ff() {
    //   console.log("start");
    // })();
    // ctx.save(); // 保存默认状态

    // ctx.fillStyle = "#09F"; // 在原有配置基础上对颜色做改变
    // ctx.fillRect(50, 200, 120, 120);

    this.update();
    // update();
    // let timer = setInterval(() => {
    //   if (leftTimes > 0) {
    //     update.call(this);
    //     leftTimes--;
    //   } else {
    //     clearInterval(timer);
    //     return;
    //   }
    // }, duration);
    // loop(duration, update.bind(this));
    // const requestAnimationFrame = window.requestAnimationFrame;
    // requestAnimationFrame(update.bind(this));
  }

  update() {
    if (!this.ctx) {
      return;
    }
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    const currentCount = this.fruitsQueue.getNewFruits().length;
    if (currentCount < 6) {
      this.fruitsQueue.addNewFruits(6 - currentCount);
    }
    const newFruits = this.fruitsQueue.getNewFruits();
    for (let i = 0; i < newFruits.length; i++) {
      newFruits[i].update();
      if (newFruits[i].position.y < 0) {
        this.fruitsQueue.deleteNewFruit(i);
      }
    }
    for (const newFruit of this.fruitsQueue.getNewFruits()) {
      newFruit.draw(ctx);
    }

    requestAnimationFrame(this.update.bind(this));
  }

  cut() {}
}

export {};
