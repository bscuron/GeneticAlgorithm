let canvas;
let grid, rows = 7, cols = 7, dx, dy;
let population, populationSize = 25, populationAge = 0, populationLifespan = 200, sx = 1, sy = 1;
let tx = cols - 2, ty = rows - 2;
let slider;

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
    slider = createSlider(1, 100, 1);
    slider.position(0, 0);
}

function draw(){
    background(0);
    grid.show();

    for(let i = 0; i < slider.value(); i++){
        population.update();
    }
}
