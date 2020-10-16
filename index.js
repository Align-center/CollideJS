'use strict';

class Shape {

    constructor(x, y, vx, vy, color, boundaries){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.boundaries = boundaries;

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

        if (this.vy != 0) {

            this.vy += .2;
        }

        for (let i = 0; i < instances.length; i++) {

            if(instances[i].boundaries === true) {
                instances[i].setBoundaries(canvas);
            }
        }
        
        window.requestAnimationFrame(this.moveShape.bind(this, ctx, canvas, instances));
    }

    redraw(instances, ctx) {

        for (let i = 0; i < instances.length; i++) {

            instances[i].drawShape(ctx);
        }
    }
}

class Ball extends Shape {

    constructor(radius, x, y, vx = 0, vy = 5, color = 'black', boundaries) {
        super(x, y, vx, vy, color, boundaries);
        this.radius = radius;

        super.instances(this);
    }

    drawShape(ctx) {

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    setBoundaries(canvas) {
        
        //Upper and Lower Boundaries
        if (this.y + this.vy + this.radius > canvas.height) {
                
            if (this.vy < .6) {

                this.vy = 0;
            }
            else {

                this.vy = -this.vy;
                this.vy *= .7;
            }
        }

        if (this.y + this.vy - this.radius < 0) {

            this.vy = - this.vy
            this.vy *= .7;
        }

        //Sides Boundaries
        if (this.x + this.vx + this.radius > canvas.width || this.x + this.vx - this.radius < 0) {
            
            if (this.vx < 2 && this.vx > -2) {

                this.vx = 0;
            }
            else {

                let number = .8
                this.vx *= number;
                this.vx = -this.vx;
                number -= .3;
            }  
        }

        //Make impossible for the ball the get out of the canvas
        if (this.x + this.radius > canvas.width) {

            this.x = canvas.width - this.radius;
        }
        else if (this.x - this.radius < 0) {

            this.x = 0 + this.radius;
        }
    }
}

class Rectangle extends Shape{

    constructor(width, height, x, y, vx = 0, vy = 5, color = 'black', boundaries) {
        super(x, y, vx, vy, color, boundaries);
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