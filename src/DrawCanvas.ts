import { ElementUtil } from "./ElementUtil";
import { DrawUtil } from "./DrawUtil";
import { Point } from "./Geom";

import * as jQuery from "jquery";
const $ = (jQuery as JQueryStatic)["default"] as (selector, context?) => JQuery;

export class DrawCanvas {
  private canvasElement: HTMLCanvasElement;
  private drawState = "up";
  private points: Point[][] = [[]];

  brushSize = 24;
  W = 330;
  H = 330;
  hasGrid = true;
  canvas: CanvasRenderingContext2D;
  clearOnDown = false;

  constructor(elementId = "canvas") {
    var element = document.getElementById(elementId);
    if (!element) console.error("Invalid element ID");
    this.canvasElement = element as HTMLCanvasElement;
    this.canvasElement.width = this.W;
    this.canvasElement.height = this.H;

    $("#" + elementId)
      .on("mousedown touchstart", this.eDown.bind(this))
      .on("mousemove touchmove", this.eMove.bind(this))
      .on("mouseup touchend", this.eUp.bind(this));

    this.canvas = this.canvasElement.getContext("2d");
    this.draw();
  }
  dispose() {
    this.canvasElement.onmousedown = null;
    this.canvasElement.onmousemove = null;
    this.canvasElement.onmouseup = null;
  }
  getImageData() {
    return this.canvas.getImageData(0, 0, this.W, this.H);
  }
  clear() {
    this.points = [[]];
    this.draw();
  }
  toogleGrid() {
    this.hasGrid = !this.hasGrid;
    this.draw();
  }

  draw() {
    var ctx = this.canvas;
    ctx.clearRect(0, 0, this.W, this.H);

    if (this.hasGrid && this.drawState == "up")
      DrawUtil.drawGrid(ctx, this.W, this.H);
    else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, this.W, this.H);
    }

    ctx.save();
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = this.brushSize;
    this.points.forEach(points => {
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i == 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });

    ctx.restore();
  }

  lastPoint = null;
  getPoint(event) {
    if (event.type.indexOf("mouse") > -1)
      return (this.lastPoint = new Point(event.x, event.y));
    if (event.type.indexOf("touch") > -1 && event.touches.length > 0) {
      if (event.type === "touchend") return this.lastPoint;
      return (this.lastPoint = new Point(
        event.touches[0].clientX,
        event.touches[0].clientY
      ));
    }
    console.error("Unknown event " + event.type);
    return new Point(100, 100);
  }

  eDown(jEv) {
    if (this.clearOnDown) {
      this.clearOnDown = false;
      this.clear();
    }
    var e = jEv.originalEvent;
    // $('body').css('overflow-y', 'hidden' );
    this.drawState = "down";
    var p = this.getPoint(e);
    if (!p) return;
    var o = ElementUtil.pageOffset(this.canvasElement);
    this.points.push([{ x: p.x - o.x, y: p.y - o.y }]);
    this.draw();
  }
  eMove(jEv) {
    var e = jEv.originalEvent;
    if (e.type.indexOf("touch") > -1) {
      // http://stackoverflow.com/a/4770179
      e = e || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }

    if (this.drawState == "up") return;
    this.drawState = "move";
    var p = this.getPoint(e);
    var o = ElementUtil.pageOffset(this.canvasElement);
    this.points[this.points.length - 1].push({ x: p.x - o.x, y: p.y - o.y });
    this.draw();
  }
  eUp(jEv) {
    // $('body').css('overflow-y', 'auto' );
    this.drawState = "up";
  }
}
