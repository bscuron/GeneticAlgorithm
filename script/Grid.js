class Grid{
    constructor(rows, cols){
        this.grid = this.resetGrid(rows, cols);
        this.createMaze();
    }

    resetGrid(rows, cols){
        let grid = [];
        for(let y = 0; y < rows; y++){
            grid.push([]);
            for(let x = 0; x < cols; x++){
                grid[y].push(new Cell(x, y));
            }
        }
        return grid;
    }

    show(){
        push();
        for(let y = 0; y < this.grid.length; y++){
            for(let x = 0; x < this.grid[y].length; x++){
                if(this.grid[y][x].wall){
                    fill(255, 0, 0);
                } else{
                    fill(255);
                }
                rect(this.grid[y][x].x * dx, this.grid[y][x].y * dy, dx, dy);
            }
        }
        pop();
    }

    // dfs maze generation algorithm
    createMaze(){
        let current = this.grid[1][1];
        current.wall = false;
        current.visited = true;
        let stack = [current];

        while(stack.length > 0){
            current = stack.pop();
            let neighbors = [];

            //north neighbor
            if(current.y >= 2 && !this.grid[current.y - 2][current.x].visited){
                neighbors.push(this.grid[current.y - 2][current.x]);
            }

            //south neighbor
            if(current.y < rows-2 && !this.grid[current.y + 2][current.x].visited){
                neighbors.push(this.grid[current.y + 2][current.x]);
            }

            //west neighbor
            if(current.x >= 2 && !this.grid[current.y][current.x - 2].visited){
                neighbors.push(this.grid[current.y][current.x - 2]);
            }

            //east neighbor
            if(current.x < cols-2 && !this.grid[current.y][current.x + 2].visited){
                neighbors.push(this.grid[current.y][current.x + 2]);
            }

            for(let i = 0; i < neighbors.length; i++)
                neighbors[i].wall = false;

            if(neighbors.length > 0){
                stack.push(current);
                let chosen = neighbors[Math.floor(Math.random() * neighbors.length)];

                //north of current
                if(chosen.y == current.y - 2){
                    this.grid[current.y-1][current.x].wall = false;
                }

                //south of current
                else if(chosen.y == current.y + 2){
                    this.grid[current.y+1][current.x].wall = false;
                }

                //east of current
                else if(chosen.x == current.x + 2){
                    this.grid[current.y][current.x+1].wall = false;
                }

                //west of current
                else if(chosen.x == current.x - 2){
                    this.grid[current.y][current.x-1].wall = false;
                }

                chosen.visited = true;
                stack.push(chosen);
            }
        }
    }

    getUnvisitedCellsCount(){
        let count = 0;
        for(let y = 0; y < this.grid.length; y++){
            for(let x = 0; x < this.grid.length; x++){
                if(this.grid[y][x].visited == false)
                    count++;
            }
        }
        return count;
    }
}

class Cell{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.wall = true;
        this.visited = false;
    }
}
