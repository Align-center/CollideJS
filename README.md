Hello,
It is fairly simple to use this library.

Before using the library you need to create a canvas tag, create a variable with the canvas tag and a variable for the canvas context which is '2d' (the lowercase letter is important).

First you need to instantiate your shapes (only Circle et Rectangle are available for now) :
    const cirlce = new Circle(x, y, radius, color);
    const rectangle = new Rectangle(x, y, width, height, color);
You need x and y coordinates you want your shape to be, the radius for circle and width and height for rectangle and finally the color of your shape (default color is black).

Once you instantiate all the shapes you wanted, you need to create an array with all of the instances :
    Two ways of doing it :
        1 - var instances = shape1.setInstances(shape2, shape3, …);
            Using the setInstances method, which take as arguments as many shapes as you have. you call this method on one of your shape, it can be any shape.
        2 - var instances = [shape1, shape2, shape3, …];
            Simply by creating an array with all of the shapes inside.
Regardless of the way you choose to create the array, you should end up with an array containing all of your instances.

Now start the fun part of the library. You noticed that none of your shapes were moving etc.
To change that, you can use the following methods :
    shape.drawShape()
        Simply display the shape where its coordinates are. You don't need this methode if you are using the moveShape method.
    shape.setVelocity(vx, vy);
        set the velocity of the shape negative vx will move the shape to the left of the canvas and negative vy will move the shape to the top of the canvas.
    shape.isRestricted(boolean);
        if true, the shape can't go out of the canvas
    shape.addCollision(shape1, shape2, …);
        when detecting for collision to the shape, only shapes given as arguments in this method will be taken into account
    shape.moveShape(context, canvas, instances, function(shape) { });
        The main method, which animate the movement of your shapes. Even if you don't use the drawShape method, the shapes will be displayed. If a shape as a velocity, it'll be moving. Finally the callback method send back the shapes that collide. If your shape doesn't collide with any other shape, you don't have to write a callback function, you can just ignore it.

These methods can be used with every shape you'd like.

With the callback function you can do pretty much every thing you'd like : a bounce back, changing colors, etc.