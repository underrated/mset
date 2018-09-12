
function debug(msg) {
    var dbg = document.getElementById("debug");
    dbg.innerHTML += "<p>" + msg +"</p>";
}

function cx_to_str(re,im) {
    return re + (Math.sign(im)>=0?' + ':' - ') + Math.abs(im) + " j";
}

var cvs = document.getElementById("fractal")
var ctx = cvs.getContext("2d");

function mset(s) {
    var pixel_stepX = (s.lower_right_re-s.upper_left_re)/s.xres;
    var pixel_stepY = (s.upper_left_im-s.lower_right_im)/s.yres;
    cvs.width = s.xres;
    cvs.height = s.yres;
    var id = new ImageData(s.xres, s.yres);
    var p = 0;
    for(var i = 0; i < s.yres; i++) {
        for(var j = 0; j < s.xres; j++) {
            var zre=s.seed_re;
            var zim=s.seed_im;
            cre = s.upper_left_re + j*pixel_stepX;
            cim = s.upper_left_im - i*pixel_stepY;
            var nr_iters = 0;
            var is_member = true;
            for(var k = 0; k < s.max_iters; k++) {
                nr_iters++;
                var old_zre = zre;
                var old_zim = zim;
                zre = old_zre*old_zre - old_zim*old_zim + cre;
                zim = 2*old_zre*old_zim + cim;
                if(zre*zre + zim*zim >= s.threshold) {
                    // console.log("Found infinite case");
                    is_member = false;
                    break;
                }
            }
            var color = 0;
            if(is_member) color = 0;
            else color = 51+nr_iters;
            // var p = (i*s.xres + j);
            id.data[p++] = color;
            id.data[p++] = color;
            id.data[p++] = color;
            id.data[p++] = 255;
        }
    }
    ctx.putImageData(id,0,0);
}

class MSettings {

    copy(s) {
        this.xres = s.xres;
        this.yres = s.yres;
        this.upper_left_re = s.upper_left_re;
        this.upper_left_im = s.upper_left_im;
        this.threshold = s.threshold;
        this.max_iters = s.max_iters;
        this.seed_re = s.seed_re;
        this.seed_im = s.seed_im;
        this.xwidth = s.xwidth;
        this.zoom_speed = s.zoom_speed;
        this.ywidth = this.xwidth*(this.yres/this.xres);
        this.lower_right_re = this.upper_left_re + this.xwidth;
        this.lower_right_im = this.upper_left_im - this.xwidth*(this.yres/this.xres);
    }

    constructor(s) {
        this.copy(s);
    }

    reset() {
        this.copy({
            xres : 800,
            yres : 600,
            upper_left_re : -2.15,
            upper_left_im : 1.31,
            xwidth : 3.5,
            threshold : 4,
            max_iters : 100,
            seed_re : 0,
            seed_im : 0,
            zoom_speed : 0.0001
        });
    }

    refresh() {
        this.ywidth = this.xwidth*(this.yres/this.xres);
        this.lower_right_re = this.upper_left_re + this.xwidth;
        this.lower_right_im = this.upper_left_im - this.xwidth*(this.yres/this.xres);
    }

    zoom(zoom_re, zoom_im, factor) {
        var dz0_re = zoom_re - this.upper_left_re;
        var dz0_im = zoom_im - this.upper_left_im;

        var tbeta = Math.abs(this.xwidth / dz0_re);
        var talpha = Math.abs(dz0_re / dz0_im);

        var dz1_re = this.xwidth/(factor * tbeta);
        var dz1_im = - dz1_re/talpha;

        this.upper_left_re = zoom_re - dz1_re;
        this.upper_left_im = zoom_im - dz1_im;
        this.xwidth /= factor;

        this.refresh();
    }
}

settings = new MSettings({
    xres : 800,
    yres : 600,
    upper_left_re : -2.15,
    upper_left_im : 1.31,
    xwidth : 3.5,
    threshold : 4,
    max_iters : 100,
    seed_re : 0,
    seed_im : 0,
    zoom_speed : 0.0001
});

var zoomX = 0;
var zoomY = 0;

var dragStartX = 0;
var dragStartY = 0;

var isDragging = false;

cvs.onmousedown = function(ev) {
    isDragging = true;
    var rect = cvs.getBoundingClientRect();
    dragStartX = ev.clientX - rect.left;
    dragStartY = ev.clientY - rect.top;
}

cvs.onmousemove = function(ev) {
    if(isDragging) do_drag(ev);
    else do_move(ev);
}

function do_drag(ev) {
    var s = settings;

    var rect = cvs.getBoundingClientRect();
    var dragX = ev.clientX - rect.left;
    var dragY = ev.clientY - rect.top;
    var pixel_stepX = (s.lower_right_re-s.upper_left_re)/s.xres;
    var pixel_stepY = (s.upper_left_im-s.lower_right_im)/s.yres;
    
    s.upper_left_re -= (dragX - dragStartX) * pixel_stepX;
    s.upper_left_im += (dragY - dragStartY) * pixel_stepY;
    s.refresh();
    mset(s);
    dragStartX = dragX;
    dragStartY = dragY;

    var dbg = document.getElementById("debug");
    dbg.innerHTML = "<strong>Drag debug:</strong><br/>";
    dbg.innerHTML += "<p> xwidth=" + s.xwidth +"</p>";
    dbg.innerHTML += "<p> upper_left=" + cx_to_str(s.upper_left_re, s.upper_left_im) +"</p>";
    dbg.innerHTML += "<p> lower_right=" + cx_to_str(s.lower_right_re, s.lower_right_im) +"</p>";
    dbg.innerHTML += "<p> dragX=" + dragX +"</p>";
    dbg.innerHTML += "<p> dragY=" + dragY +"</p>";
    dbg.innerHTML += "<p> pixel_stepX=" + pixel_stepX +"</p>";
    dbg.innerHTML += "<p> pixel_stepY=" + pixel_stepY +"</p>";  
}

function do_move(ev) {
    var rect = cvs.getBoundingClientRect();
    mouseX = ev.clientX - rect.left;
    mouseY = ev.clientY - rect.top;
    var s = settings;
    
    var pixel_stepX = (s.lower_right_re-s.upper_left_re)/s.xres;
    var pixel_stepY = (s.upper_left_im-s.lower_right_im)/s.yres;
    var cMouse_re = s.upper_left_re + mouseX*pixel_stepX;
    var cMouse_im = s.upper_left_im - mouseY*pixel_stepY;
    
    var dbg = document.getElementById("debug");
    dbg.innerHTML = "<strong>Move debug:</strong><br/>";
    dbg.innerHTML += "<p> cMouse=" + cx_to_str(cMouse_re, cMouse_im) +"</p>";
    dbg.innerHTML += "<p> mouseX=" + mouseX +"</p>";
    dbg.innerHTML += "<p> mouseY=" + mouseY +"</p>";
    dbg.innerHTML += "<p> xwidth=" + s.xwidth +"</p>";
    dbg.innerHTML += "<p> upper_left=" + cx_to_str(s.upper_left_re, s.upper_left_im) +"</p>";
    dbg.innerHTML += "<p> lower_right=" + cx_to_str(s.lower_right_re, s.lower_right_im) +"</p>";
    dbg.innerHTML += "<p> pixel_stepX=" + pixel_stepX +"</p>";
    dbg.innerHTML += "<p> pixel_stepY=" + pixel_stepY +"</p>";  

}

cvs.onmouseup = function(ev) {
    isDragging = false;
}

cvs.onmousewheel = function(ev) {
    var rect = cvs.getBoundingClientRect();
    zoomX = ev.clientX - rect.left;
    zoomY = ev.clientY - rect.top;
    var delta=ev.detail? ev.detail*(-120) : ev.wheelDelta;
    var s = settings;
    
    var pixel_stepX = (s.lower_right_re-s.upper_left_re)/s.xres;
    var pixel_stepY = (s.upper_left_im-s.lower_right_im)/s.yres;
    var zoom_point_re = s.upper_left_re + zoomX*pixel_stepX;
    var zoom_point_im = s.upper_left_im - zoomY*pixel_stepY;
    var zoom_factor = 1;
    if(delta<0)
        zoom_factor = 1 - s.zoom_speed*(-delta);
    else
        zoom_factor = 1 + s.zoom_speed*delta;
    
    s.zoom(zoom_point_re, zoom_point_im, zoom_factor);
    
    mset(s);
   
    var dbg = document.getElementById("debug");
    dbg.innerHTML = "<strong>Zoom debug:</strong><br/>";
    dbg.innerHTML += "<p> scroll delta=" + delta +"</p>";
    dbg.innerHTML += "<p> zoom_factor=" + zoom_factor +"</p>";
    dbg.innerHTML += "<p> zoom_speed=" + s.zoom_speed +"</p>";
    dbg.innerHTML += "<p> xwidth=" + s.xwidth +"</p>";
    dbg.innerHTML += "<p> upper_left=" + cx_to_str(s.upper_left_re, s.upper_left_im) +"</p>";
    dbg.innerHTML += "<p> lower_right=" + cx_to_str(s.lower_right_re, s.lower_right_im) +"</p>";
    dbg.innerHTML += "<p> zoom_point=" + cx_to_str(zoom_point_re, zoom_point_im) +"</p>";
    dbg.innerHTML += "<p> zoomX=" + zoomX +"</p>";
    dbg.innerHTML += "<p> zoomY=" + zoomY +"</p>";
    dbg.innerHTML += "<p> pixel_stepX=" + pixel_stepX +"</p>";
    dbg.innerHTML += "<p> pixel_stepY=" + pixel_stepY +"</p>";

}

function redraw(ev) {
    settings.max_iters = parseInt(document.getElementById("max_iters").value);
    settings.zoom_speed = parseFloat(document.getElementById("zoom_speed").value);
    mset(settings);
}

document.getElementById("redraw").onclick = redraw; 

document.getElementById("reset").onclick = function(ev) { 
    settings.reset(); 
    document.getElementById("max_iters").value = settings.max_iters.toString();
    document.getElementById("zoom_speed").value = settings.zoom_speed.toString();
    mset(settings) 
}; 

document.getElementById("max_iters").onkeypress = function(ev) {
    if(ev.key == "Enter")
      redraw();
}; 

document.getElementById("zoom_speed").onkeypress = function(ev) {
    if(ev.key == "Enter")
      redraw();
}; 

cvs.onmouseover = function(ev) {
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

cvs.onmouseout = function(ev) {
    document.getElementsByTagName("html")[0].style.overflow = "auto";
    document.getElementsByTagName("body")[0].style.overflow = "auto";
}

mset(settings);
