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
水果队列管理
Engin类 控制整个游戏流程
 1.轮询更新水果状态，调用每个水果的update draw
 2.计算积分
 3.加入新的水果
touchmove事件判断切中了水果
通过水果圆点和鼠标坐标及半径判断
 */

function loop(duration: number, callback: Function, times?: number) {
  let leftTimes = times;
  let timer: NodeJS.Timer;
  timer = setTimeout(() => {
    // if (leftTimes > 0) {
    //   callback();
    //   leftTimes--;
    // } else {
    //   clearInterval(timer);
    //   return;
    // }
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

  constructor(x: number) {
    this.id = 1;
    this.type = "apple";
    this.score = 20;
    this.position = { x, y: 0 };
    this.isCutted = false;
    this.icon = "ddd";
    this.radius = 20;
  }

  update() {
    const { x, y } = this.position;
    this.position.x += 4;
    this.position.y += 10;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position;
    ctx.beginPath();
    ctx.fillStyle = "#FA6900";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(204, 204, 204, 0.5)";
    ctx.fillRect(x, y, 15, 15);
    // ctx.save();
  }

  cut() {}
}

// class FruitsQueue {
// TODO: 添加新的类
// }

export class Engine {
  newFruits: Fruit[];
  cuttedFruits: Fruit[];
  totalScore: number;
  isPause: boolean;
  ctx: CanvasRenderingContext2D | null;
  canvasWidth: number;
  canvasHeight: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
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
    const times = 20;
    const duration = 1000 / 16;

    let leftTimes = times;
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
    if (this.newFruits.length < 1) {
      this.newFruits.push(new Fruit(20));
    }
    for (const i in this.newFruits) {
      this.newFruits[i].update();
      if (this.newFruits[i].position.y > this.canvasHeight) {
        this.newFruits.splice(+i, 1);
      }
    }
    for (const newFruit of this.newFruits) {
      newFruit.draw(ctx);
    }
  }

  cut() {}
}

export {};
