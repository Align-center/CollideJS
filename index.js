'use strict';

class Shape {

    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.boundaries = false;
        this.collisions = [];
        this.shapes= [];
    }

    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    setInstances() {
        
        let instances = [this];

        for (let i = 0; i < arguments.length; i++) 
            instances.push(arguments[i]);

        return instances;
    }

    isRestricted(bool) {
        this.boundaries = bool;
    }

    instances(instance) {
        this.shapes.push(instance);
    }

    moveShape(ctx, canvas, instances, callback) {
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

            for (let j = 0; j < this.collisions.length; j++) {

                if (typeof callback == 'function')
                    this.setCollision(this.collisions[j], callback);
            }
        }

        window.requestAnimationFrame(this.moveShape.bind(this, ctx, canvas, instances, callback));
    }

    redraw(instances, ctx) {

        for (let i = 0; i < instances.length; i++) {

            instances[i].drawShape(ctx);
        }
    }

    addCollision() {

        for (let i = 0; i < arguments.length; i++) 
            this.collisions.push(arguments[i]);
    }
}

class Circle extends Shape {

    constructor(x, y, radius, color = 'black') {
        super(x, y, color);
        this.radius = radius;
        this.type = 'circle';

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

        //Make impossible for the circle the get out of the canvas
        if (this.x + this.radius > canvas.width) {

            this.x = canvas.width - this.radius;
        }
        else if (this.x - this.radius < 0) {

            this.x = 0 + this.radius;
        }

        if (this.y + this.radius < 0 ) {
            this.y = 0 + this.radius;
        }
        else if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
        }
    }

    setCollision (shape, callback) {

        if (shape.type == 'circle') {

            //Collision detection between 2 circles
            //Distance between the two circles, not using the sqrt method for performances
            let distance = (this.x - shape.x)*(this.x - shape.x) + (this.y - shape.y)*(this.y - shape.y);

            //Sum of the two radius, multiply by itself to match the distance
            let sum = (this.radius + shape.radius)*(this.radius + shape.radius);


            if (distance <= sum) {

                if (typeof callback == 'function') {
                    let shapes = [shape, this];
                    callback(shapes);
                }
            }
        }
        else if (shape.type == 'rectangle') {

            //Collision detection between a circle and a rectangle

            //We declare these vars in case none of the following conditions are true
            let testX = this.x;
            let testY = this.y;

            //We look for the closest rectangle's edges to the circle
            if (this.x < shape.x)
                testX = shape.x;
            else if (this.x > shape.x + shape.width)
                testX = shape.x + shape.width;

            if (this.y < shape.y)
                testY = shape.y;
            else if (this.y > shape.y + shape.height)
                testY = shape.y + shape.height;

            //Calculation of the distance between the found edges and the circles
            let distX = this.x - testX;
            let distY = this.y - testY;

            let distance = (distX*distX)+(distY*distY);

            if (distance <= (this.radius * this.radius)) {
                let shapes = [shape, this];
                callback(shapes);
            }

        }

    }
}

class Rectangle extends Shape{

    constructor(x, y, width, height, color = 'black') {
        super(x, y,color);
        this.width = width;
        this.height = height;
        this.type = 'rectangle';

        super.instances(this);
    }

    drawShape(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    setBoundaries(canvas) {
        //Upper and Lower Boundaries
        //Lower
        if (this.y + this.vy + this.height> canvas.height) {
                
            if (this.vy < .6) {

                this.vy = 0;
            }
            else {

                this.vy = -this.vy;
                this.vy *= .5;

                this.vx *= .6;
            }
        }

        //Upper
        if (this.y + this.vy < 0) {

            this.vy = - this.vy
            this.vy *= .5;
        }

        //Sides Boundaries
        if (this.x + this.vx + this.width > canvas.width || this.x + this.vx < 0) {
            
            if (this.vx < 2 && this.vx > -2) {

                this.vx = 0;
            }
            else {

                let number = .5
                this.vx *= number;
                this.vx = -this.vx;
                number -= .3;
            }  
        }

        //Make impossible for the shape the get out of the canvas
        if (this.x + this.width > canvas.width) {

            this.x = canvas.width - this.width;
        }
        else if (this.x < 0) {

            this.x = 0;
        }

        if (this.y < 0) {
            this.y = 0;
        }
        else if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
    }

    setCollision(shape, callback) {

        if (shape.type == 'rectangle') {

            if (shape.x > this.x + this.width) 
                return false;
            
            else if (this.x > shape.x + shape.width) 
                return false;
            
            else if (shape.y > this.y + this.height) 
                return false;
            
            else if (this.y > shape.y + shape.height) 
                return false;
            
            else {
                if (typeof callback == 'function') {
                    let shapes = [shape, this];
                    callback(shapes);
                }
            }
        }
        else if (shape.type == 'circle') {
            //Collision detection between a rectangle and a circle

            //We declare these vars in case none of the following conditions are true
            let testX = shape.x;
            let testY = shape.y;

            //We look for the closest rectangle's edges to the circle
            if (shape.x < this.x)
                testX = this.x;
            else if (shape.x > this.x + this.width)
                testX = this.x + this.width;

            if (shape.y < this.y)
                testY = this.y;
            else if (shape.y > this.y + this.height)
                testY = this.y + this.height;

            //Calculation of the distance between the found edges and the circles
            let distX = shape.x - testX;
            let distY = shape.y - testY;

            let distance = (distX*distX)+(distY*distY);

            if (distance <= (shape.radius * shape.radius)){
                let shapes = [shape, this];
                callback(shapes);
            }
        }
    }
}