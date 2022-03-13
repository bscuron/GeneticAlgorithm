class Population{
    constructor(){
        this.people = this.createGeneration();
        this.pool = [];
    }

    createGeneration(){
        let people = [];
        for(let i = 0; i < populationSize; i++){
            people.push(new Person(sx * dx + dx/2, sy * dy + dy/2, undefined));
        }
        return people;
    }

    show(){
        this.people.forEach(person => person.show());
    }

    update(){
        this.people.forEach(person => person.update());
        populationAge++;

        if(populationAge > populationLifespan || this.stillSearching() == 0){
            populationAge = 0;
            this.evaluate();
            this.selection();
        }
    }

    stillSearching(){
        let count = 0;
        for(let i = 0; i < this.people.length; i++){
            if(!this.people[i].dead && !this.people[i].foundTarget)
                count++;
        }
        return count;
    }

    evaluate(){
        this.people.forEach(person => person.calculateFitness());

        let maxFitness = this.people[0].fitness;
        for(let i = 0; i < this.people.length; i++){
            this.people[i].calculateFitness();
            if(this.people[i].fitness > maxFitness){
                maxFitness = this.people[i].fitness;
            } 
        }

        // normalize fitness values [0-1]
        for(let i = 0; i < this.people.length; i++){
            this.people[i].fitness /= maxFitness;
        }


        // higher fitness people have higher chance of reproducing
        this.pool = [];
        for(let i = 0; i < this.people.length; i++){
            let n = this.people[i].fitness * 100;
            for(let j = 0; j < n; j++){
                this.pool.push(this.people[i]);
            }
        }
    }

    selection(){
        // create next generation
        let nextGeneration = new Population();

        for(let i = 0; i < this.people.length; i++){
            let pa = this.pool[Math.floor(Math.random() * this.pool.length)];
            let pb = this.pool[Math.floor(Math.random() * this.pool.length)];
            let dna = [];
            let mid = Math.floor(pa.dna.length / 2);
            for(let j = 0; j < pa.dna.length; j++){
                if(Math.random() < MUTATION_RATE){
                    dna.push(p5.Vector.random2D());
                } else if(j < mid){
                    dna.push(pa.dna[j]);
                } else{
                    dna.push(pb.dna[j]);
                }
            }
            nextGeneration.people[i] = new Person(sx * dx + dx/2, sy * dy + dy/2, dna);
        }

        population = nextGeneration;
    }
}

class Person{
    constructor(x, y, dna){
        if(dna == undefined){
            this.dna = this.getRandomDna();
        } else{
            this.dna = dna;
        }
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.dead = false;
        this.deathAge = populationLifespan;
        this.foundTarget = false;
        this.visitedCells = [];
    }

    getRandomDna(){
        let dna = [];
        for(let i = 0; i < populationLifespan; i++){
            let rv = p5.Vector.random2D();
            dna.push(rv);
        }
        return dna;
    }

    update(){

        if(!this.dead && !this.foundTarget){
            this.acc = this.dna[populationAge];
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            let currentCell = createVector(Math.floor(this.pos.x / dx), Math.floor(this.pos.y / dy));
            let visitedCell = false;
            for(let i = 0; i < this.visitedCells.length; i++){
                if(currentCell.x == this.visitedCells[i].x && currentCell.y == this.visitedCells[i].y){
                    visitedCell = true;
                }
            }
            if(!visitedCell){
                this.visitedCells.push(currentCell);
            }
        }

        // off screen or hit wall
        if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0 || grid.grid[Math.floor(this.pos.y / dy)][Math.floor(this.pos.x / dx)].wall == true){
            this.dead = true;
            this.deathAge = populationAge;
        }

        if(Math.floor(this.pos.y / dy) == ty && Math.floor(this.pos.x / dx) == tx){
            this.foundTarget = true;
            this.vel.mult(0);
        }
    }

    show(){
        push();
        strokeWeight((width + height) / 100);
        point(this.pos.x, this.pos.y);
        pop();
    }

    calculateFitness(){
        // let distance = Math.sqrt(Math.pow(this.pos.x - (tx * dx), 2) + Math.pow(this.pos.y - (ty * dy), 2));
        let distance = Math.abs(this.pos.x - (tx * dx + dx/2)) + Math.abs(this.pos.y - (ty * dy + dy/2));
        let fitness = 1 / distance;
        if(this.foundTarget){
            fitness *= Number.MAX_SAFE_INTEGER;
        }
        fitness *= Math.exp(this.visitedCells.length);
        this.fitness = fitness;
    }
}
