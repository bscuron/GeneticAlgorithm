let canvas;
let grid, rows = 7, cols = 7, dx, dy;
let population, populationSize = 100, populationAge = 0, populationLifespan = 400, sx = 1, sy = 1;
let tx = cols - 2, ty = rows - 2;
let slider;
let MUTATION_RATE = 0.005;

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
    population = new Population();
    slider = createSlider(1, 1000, 1);
    slider.position(0, 0);
}

function draw(){
    background(0);
    grid.show();
    population.show();
    for(let i = 0; i < slider.value(); i++){
        population.update();
    }
}

function mousePressed(){
    let x = Math.floor(mouseX / dx);
    let y = Math.floor(mouseY / dy);

    if(x < 0 || x > cols - 1 || y < 0 || y > rows - 1)
        return;

    grid.grid[y][x].wall = !grid.grid[y][x].wall;
    population = new Population();
}
