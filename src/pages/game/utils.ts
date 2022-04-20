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
    this.position.y += y;
  }

  draw() {}

  cut() {}
}

export class Engine {
  newFruits: Fruit[];
  cuttedFruits: Fruit[];
  totalScore: number;
  isPause: boolean;
  ctx: CanvasRenderingContext2D | null;

  constructor(ctx: CanvasRenderingContext2D | null) {
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
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 300, 200);
    ctx.beginPath();
    ctx.fillStyle = "#FA6900";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(204, 204, 204, 0.5)";
    ctx.fillRect(0, 0, 15, 15);
    ctx.save();
  }

  update() {}

  cut() {}
}

export {};
