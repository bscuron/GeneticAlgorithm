let canvas;
let grid, rows = 15, cols = 15, dx, dy;

function setup(){
    let parentName = 'canvas';
    let parentDom = document.getElementById(parentName);
    let w = parentDom.offsetWidth;
    let h = parentDom.offsetHeight;
    canvas = createCanvas(w, h);
    canvas.parent(parentName);
    grid = new Grid(rows, cols);
    dx = width / cols;
    dy = height / rows;
}

function draw(){
    background(0);
    grid.show();
}
