'use strict';

class Shape {

    constructor(x, y, vx, vy, color){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.shapes= [];
    }

    instances(instance) {
        this.shapes.push(instance);
    }

    moveShape(ctx, canvas, instances) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.redraw(instances, ctx);

        this.y += this.vy;
        this.x += this.vx;
        
        window.requestAnimationFrame(this.moveShape.bind(this, ctx, canvas, instances));
    }

    redraw(instances, ctx) {

        for (let i = 0; i < instances.length; i++) {

            instances[i].drawShape(ctx);
        }
    }
}

class Ball extends Shape {

    constructor(radius, x, y, vx = 0, vy = 5, color = 'black') {
        super(x, y, vx, vy, color);
        this.radius = radius;

        super.instances(this);
    }

    drawShape(ctx) {

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Rectangle extends Shape{

    constructor(width, height, x, y, vx = 0, vy = 5, color = 'black') {
        super(x, y, vx, vy, color);
        this.width = width;
        this.height = height;

        super.instances(this);
    }

    drawShape(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}