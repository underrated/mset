# Mandelbrot Set Viewer

This is a Mandelbrot set fractal viewer that I wrote to enhance my front-end development skills. It was a nice programming exercise and I think it's a good starting example for anyone trying to render 2D fractals on an HTML5 canvas. 

![Image Example](https://github.com/underrated/mset/blob/master/example.png)

Try demo here https://jsfiddle.net/wLgn31pz/

## Features
* Zoom in and out of the complex plane in real time using the mouse wheel or zoom gestures on touchpads/touchscreens
* Control the zoom speed
* Drag the complex plane around in real time using the mouse or drag gestures on touchpads/touchscreens
* Control the max number of iterations used to determine membership to the Mandelbrot set for a complex number
* Debug details displayed in real time on the right side for zoom, drag and mouse move gestures(e.g. when you move the mouse over the complex plane the 'cMouse' section show the value of the complex number at the position of the mouse)
* Switch back to the initial settings by clicking the Reset button

## Example use cases
* If you want to explore the Mandelbrot and discover complex and beautiful patterns, zoom in on some areas with a zoom speed of about 0.001 and low max iterations of about 100. When you reach your area of interest increase the max iterations to 1000 or more to see more detail.
* If you want to save the fractal image in Chrome, right-click the canvas and click "Save image as..."

## Limitations
* Only a gray-scale color scheme is currently supported 

## Bugs
* if you set the zoom speed to 0.1 or more and you zoom in and out really fast, the fractal gets flipped horizontally, not sure why

## TODO:
* document the implementation
* fix the known bugs
* make the debug section look nicer
* add more controls
* save settings to file(using blobs)
* load settings from file
* optimize
* refactor
* unit tests
* etc.
