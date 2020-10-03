var Archipelago = function(Q) {


    function RGBA(red, green, blue, alpha){
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    RGBA.prototype.clone = function(){
        return new RGBA(this.red,this.green,this.blue,this.alpha);
    };

    RGBA.prototype.grayValue = function(){
        return  0.299 * this.red + 0.587 * this.green + 0.114 * this.blue;
    };

    RGBA.prototype.toFillStyleWithAlpha = function(alpha){
        return "rgba("+Math.floor(this.red)+","+Math.floor(this.green)+","+Math.floor(this.blue)+","+Math.max(0,Math.min(alpha,1)).toPrecision(5)+")";
    };

    Q.Class.extend("TerrainBlock",{

        init: function(x, y, w, h, grid, xGrid, yGrid){
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.grid = grid;
            this.xGrid = xGrid;
            this.yGrid = yGrid;
        },

        isWalkableFor: function(entity){
            return false;
        },

        isNeighbourOf: function(otherBlock){
            return (Math.abs(this.xGrid - otherBlock.xGrid)<=1)
                    && (Math.abs(this.yGrid - otherBlock.yGrid)<=1);
        },

        neighbourBlocks: function(){
            var grid = this.grid;
            var xMax = grid.p.w-1;
            var yMax = grid.p.h-1;

            var x = this.xGrid;
            var y = this.yGrid;

            var neighbours = [];

            if (x > 0){
                neighbours.push(grid.getBlock(new Point2D(x-1,y)));
                if (y > 0){
                    neighbours.push(grid.getBlock(new Point2D(x-1,y-1)));
                }
                if (y < yMax){
                    neighbours.push(grid.getBlock(new Point2D(x-1,y+1)));
                }
            }
            if (x < xMax){
                neighbours.push(grid.getBlock(new Point2D(x+1,y)));
                if (y > 0){
                    neighbours.push(grid.getBlock(new Point2D(x+1,y-1)));
                }
                if (y < yMax){
                    neighbours.push(grid.getBlock(new Point2D(x+1,y+1)));
                }
            }
            if (y > 0){
                neighbours.push(grid.getBlock(new Point2D(x,y-1)));
            }
            if (y < yMax){
                neighbours.push(grid.getBlock(new Point2D(x,y+1)));
            }

            return neighbours;
        }

    });

    Q.TerrainBlock.extend("WaterBlock",{
        init: function(x, y, w, h, grid, xGrid, yGrid){
            this._super(x, y, w, h, grid, xGrid, yGrid);
        },

        isWalkableFor: function(entity){
            if (entity instanceof Q.Ship){
                return true;
            }else{
                return false;
            }
        }
    });

    Q.TerrainBlock.extend("LandBlock",{
        init: function(x, y, w, h, grid, xGrid, yGrid){
            this._super(x, y, w, h, grid, xGrid, yGrid);
            this.island = null;
        },

        isWalkableFor: function(entity){
            return false;
        }
    });

    Q.TerrainBlock.extend("CoastlineBlock",{
        init: function(x, y, w, h, grid, xGrid, yGrid){
            this._super(x, y, w, h, grid, xGrid, yGrid);
            this.island = null;
        },

        isWalkableFor: function(entity){
            return false;
        },

        degreeOfSeaAccess: function(){
            var neighbours, degreeSeaAccess, i;
            neighbours = this.neighbourBlocks();
            degreeSeaAccess = 0;
            for (i=0;i<neighbours.length;i++){
                if (neighbours[i] instanceof Q.WaterBlock){
                    degreeSeaAccess++;
                }
            }
            return degreeSeaAccess;
        }
    });

    Q.Sprite.extend("TerrainGrid", {

        init: function(p){

            this._super(p, {
                blockSize: 1
            });

        },

        initializeFromTerrain: function(){

            var ground = Q.state.get("terrain.ground");
            var islands = Q.state.get("terrain.islands");
            var bSize = this.p.blockSize;
            var halfBSize = Math.round(bSize/2);
            var w = this.p.w = Math.floor((ground.p.w-halfBSize)/bSize);
            var h = this.p.h = Math.floor((ground.p.h-halfBSize)/bSize);
            var i, j, k, l, cntWater, cntLand, x, y, xk, row, gridPrimary, block, neighbours;
            
            this.p.grid = [];

            for (i=0;i<this.p.h;i++){
                row = [];
                for (j=0;j<this.p.w;j++){
                    row.push(null);
                }
                this.p.grid.push(row);
            }
            
            for (i=0;i<w;i++){
                x = i * bSize + halfBSize;
                for (j=0;j<h;j++){
                    y = j * bSize + halfBSize;
                    cntLand = 0;
                    cntWater = 0;
                    for (k=0;k<bSize;k++){
                        xk = x + k;
                        for (l=0;l<bSize;l++){
                            if (ground.heightAt(xk, y+l) >= 0.98){
                                cntLand++;
                            }else{
                                cntWater++;
                            }
                        }
                    }
                    if (((cntLand+1)/(cntWater+1)) < 0.66){
                        this.setBlock(
                            new Point2D(i,j),
                            new Q.WaterBlock(x, y, bSize, bSize, this, i, j)
                        );
                    }else{
                            this.setBlock(
                                new Point2D(i,j),
                                new Q.LandBlock(x, y, bSize, bSize, this, i, j)
                            );
                    }
                }
            }

            gridPrimary = this.p.grid.map(function(row){return row.slice()});

            for (i = 1; i < w-1; i++){
                for (j = 1; j < h-1; j++){
                    block = gridPrimary[j][i];
                    if (block instanceof Q.LandBlock){
                        neighbours = [];
                        neighbours.push(gridPrimary[j+1][i]);
                        neighbours.push(gridPrimary[j+1][i-1]);
                        neighbours.push(gridPrimary[j+1][i+1]);
                        neighbours.push(gridPrimary[j][i-1]);
                        neighbours.push(gridPrimary[j][i+1]);
                        neighbours.push(gridPrimary[j-1][i-1]);
                        neighbours.push(gridPrimary[j-1][i]);
                        neighbours.push(gridPrimary[j-1][i+1]);
                        for (k=0;k<8;k++){
                            if (neighbours[k] instanceof Q.WaterBlock){
                                this.setBlock(new Point2D(i,j), new Q.CoastlineBlock(block.x,block.y,block.w,block.h,this,block.xGrid, block.yGrid));
                                break;
                            }
                        }
                    }
                }
            }

            for (i in islands){
                if (islands.hasOwnProperty(i)) {
                    islands[i].bindGrid(this);
                }
            }
            
            return this;

        },

        toPFGridFor: function(entity){
            var w = this.p.w;
            var h = this.p.h;
            var grid = this.p.grid;
            var i, j;
            var pfGrid = new PF.Grid(w, h);
            for (i=0;i<w;i++){
                for (j=0;j<h;j++){
                    pfGrid.setWalkableAt(i, j, grid[j][i].isWalkableFor(entity));
                }
            }
            return pfGrid;
        },

        translateToGrid: function(point2D){
            var bSize, halfBSize;
            bSize = this.p.blockSize;
            halfBSize = Math.floor(bSize/2);
            return new Point2D(
                Math.round((point2D.x-halfBSize)/bSize),
                Math.round((point2D.y-halfBSize)/bSize)
            );
        },

        translateFromGrid: function(point2D){
            var bSize, halfBSize;
            bSize = this.p.blockSize;
            halfBSize = Math.floor(bSize/2);
            return new Point2D(
                point2D.x * bSize + halfBSize,
                point2D.y * bSize + halfBSize
            )
        },

        getBlock: function(point2D){
            return this.p.grid[point2D.y][point2D.x];
        },

        findBlockAt: function(point2DWorld){
            return this.getBlock(this.translateToGrid(point2DWorld));
        },

        setBlock: function(point2D, block){
            this.p.grid[point2D.y][point2D.x] = block;
        }

    });

    Q.component("childQuery", {
        extend: {

            $findAll: function (_class, selector, components){
                if (typeof components === "undefined"){
                    components = [];
                }
                return this.children.filter(function(c){
                    if (!(c instanceof _class)){
                        return false;
                    }
                    for (var p in selector){
                        if (selector.hasOwnProperty(p)){
                            if (c.p.hasOwnProperty(p)){
                                return c.p[p] === selector[p];
                            }else{
                                return false;
                            }
                        }
                    }
                    return true;
                }).filter(function(c){
                    return components.every(function(component){
                        return c.has(component);
                    })
                });
            },
            $findOne: function (_class, selector){
                var all = this.$findAll(_class,selector);
                if (all.length>0){
                    return all[0];
                }else{
                    return undefined;
                }
            }
        }
    });

    Q.component("positionResolver",{
        extend: {
            getAbsolutePosition: function(){
                var position, positionContainer;
                if (this instanceof Q.Sprite){
                    position = {
                        x: this.p.x,
                        y: this.p.y
                    };
                    if ((this.container instanceof Q.Sprite)){
                        if (this.container.has("positionResolver")) {
                            positionContainer = this.container.getAbsolutePosition();
                        }else{
                            positionContainer = {
                                x: this.container.p.x,
                                y: this.container.p.y
                            }
                        }
                        position.x += positionContainer.x;
                        position.y += positionContainer.y;
                    }
                    position.x = Math.round(position.x);
                    position.y = Math.round(position.y);
                    return position;
                }
            }
        }
    });


    Q.component("heightMap", {

        added: function() {
            this.entity.p.heightMap = [];
            this.entity.p._heightMap = undefined;
        },

        stackUp: function(stackMap){
            var i, j, w, h, cx, cy, children, heightMap, height;
            w = this.entity.p.w;
            h = this.entity.p.h;
            cx = this.entity.p.x - this.entity.p.cx;
            cy = this.entity.p.y - this.entity.p.cy;
            heightMap = this.entity.p.heightMap;

            for (i=0;i<w;i++){
                for (j=0;j<h;j++){
                    height = heightMap[j][i];
                    if (height>=0){
                        heightMap[j][i] += stackMap[j+cy][i+cx];
                        stackMap[j+cy][i+cx] += height;
                    }
                }
            }

            //process children
            children = this.entity.$findAll(Q.Sprite,{},["heightMap"]);
            for (i=0;i<children.length;i++){
                children[i].heightMap.stackUp(stackMap);
            }

            for (i=0;i<w;i++){
                for (j=0;j<h;j++){
                    this.entity.p.heightMap[j][i] = stackMap[j+cy][i+cx];
                }
            }

        },

        extend: {
            heightAt: function (x, y) {
                return this.p.heightMap[y][x];
            },
            averageHeightIn: function(x0, y0, x1, y1){
                var x, sumHeight, heightMap, n;
                heightMap = this.p.heightMap;
                sumHeight = 0;
                n = 0;
                for (;y0<=y1;y0++){
                    for (x=x0;x<=x1;x++){
                        sumHeight+=heightMap[y0][x];
                        n++;
                    }
                }
                return sumHeight/n;
            },
            stack: function(){
                var grid, row, x, y, wT, hT;
                grid = [];
                wT = this.p.w;
                hT = this.p.h;
                for (y=0;y<hT;y++){
                    row = [];
                    for (x=0;x<wT;x++){
                        row.push(0);
                    }
                    grid.push(row);
                }
                this.p._heightMap = this.p.heightMap;
                this.heightMap.stackUp(grid);
                this.p.heightMap = grid;
            }
        }
    });

    Q.component("depthMap", {

        added: function(){
            this.entity.p.levelHeight = 1;
            this.entity.p.container = null;
        },

        extend: {
            depthAt: function (x, y) {
                return Math.max(this.p.levelHeight - this.p.container.heightAt(x, y), 0);
            },
            averageDepthIn: function (x0, y0, x1, y1) {
                return Math.max(this.p.levelHeight - this.p.container.averageHeightIn(x0, y0, x1, y1), 0);
            }
        }
    });

    Q.component("sketchPad",{
        added: function(){
            this.entity.p.padContext =
                this.createOffscreenCanvas(
                        this.entity.p.w,
                        this.entity.p.h
                ).getContext('2d');

        },

        smoothenEdgesDownwards: function(grid){

            var w = grid[0].length;
            var h = grid.length;
            var padding = this.entity.p.padding;
            var maxFWH = padding/2;
            var seed = 674479;
            var iterations = 30000;
            var deltaDivisor = 1.5;
            var deltaExponent = 2;

            var randomX = new Random(Random.engines.mt19937().seed(seed));
            var randomY = new Random(Random.engines.mt19937().seed(seed*3+17));
            var randomW = new Random(Random.engines.mt19937().seed(seed+23));
            var randomH = Random(Random.engines.mt19937().seed(seed*7-1));
            var i, j, k, maxV, delta, deltaAvg, deltaSum, x, y, c;

            var xField, yField, wField, hField;
            for (i=0;i<iterations;i++){
                xField = randomX.integer(2,w-3);
                yField = randomY.integer(2,h-3);
                wField = randomW.integer(2,Math.min(maxFWH, w-xField));
                hField = randomH.integer(2,Math.min(maxFWH, h-yField));
                maxV = 0;
                for (j=0;j<wField;j++){
                    for (k=0;k<hField;k++){
                        if (grid[yField+k][xField+j] > maxV){
                            maxV = grid[yField+k][xField+j];
                        }
                    }
                }
                deltaSum = 0;
                for (j=0;j<wField;j++){
                    for (k=0;k<hField;k++){
                        deltaSum += maxV - grid[yField+k][xField+j];
                    }
                }
                deltaAvg = deltaSum / (wField*hField);
                for (j=0;j<wField;j++){
                    for (k=0;k<hField;k++){
                        x = xField+j;
                        y = yField+k;
                        c = Math.max(
                                0,
                                padding - x,
                                padding - y,
                                x - (w-padding),
                                y - (h-padding)
                        )/padding;
                        delta = maxV - grid[y][x];
                        if (delta > deltaAvg){
                            grid[yField+k][xField+j] += Math.pow(Math.sqrt(delta-deltaAvg)/deltaDivisor, deltaExponent) * (1-c);
                        }
                    }
                }

            }

            return grid;

        },

        createOffscreenCanvas: function(width,height){
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas;
        },
        transformToGrid: function(postProcessors){
            var grid, row, i;

            var wT = this.entity.p.w;
            var hT = this.entity.p.h;

            var fieldImageData = this.entity.p.padContext.getImageData(0, 0, wT, hT).data;
            var xi, yj, fk = 0;

            grid = [];

            for (yj = 0; yj < hT; yj++){
                row = [];
                for (xi = 0; xi < wT; xi++, fk+=4){
                    row.push(new RGBA(
                        fieldImageData[fk],
                        fieldImageData[fk+1],
                        fieldImageData[fk+2],
                        fieldImageData[fk+3]).grayValue() / 255);
                }
                grid.push(row);
            }

            if (postProcessors){
                for (i = 0;i < postProcessors.length; i++){
                    grid = postProcessors[i].call(this,grid);
                }
            }

            return grid;
        },

        sketchShape: function(){

            var i, cPoint1, cPoint2, ePoint, pathLen, padContext, path;

            padContext = this.entity.p.padContext;

            path = this.entity.p.points;

            pathLen = path.length;

            padContext.fillStyle = "white";

            padContext.beginPath();
            padContext.moveTo(path[pathLen-1][0],path[pathLen-1][1]);

            for (i = 2; i < pathLen - 2; i += 3) {
                cPoint1 = path[i-2];
                cPoint2 = path[i-1];
                ePoint  = path[i];
                padContext.bezierCurveTo(cPoint1[0], cPoint1[1], cPoint2[0], cPoint2[1], ePoint[0], ePoint[1]);
            }

            padContext.closePath();

            padContext.fill();

        },

        clear: function(){
            this.entity.p.padContext.fillStyle = "black";
            this.entity.p.padContext.fillRect(0,0,this.entity.p.w,this.entity.p.h);
        },

        extend: {
            rasterizeShape: function(postProcessors){
                this.sketchPad.clear();
                this.sketchPad.sketchShape(this);
                return this.sketchPad.transformToGrid(postProcessors);
            }
        }
    });

    Q.Sprite.extend("GridPathFinder", {

        init: function(p){
            this._super(p, {
                grid: null,
                entityOnWay: null,
                finderGrid: null,
                pathFinder: new PF.AStarFinder({
                    //allowDiagonal: true,
                    dontCrossCorners: true,
                    heuristic: PF.Heuristic.octile
                })
            });
            this.p.finderGrid = this.p.grid.toPFGridFor(this.p.entityOnWay);
        },

        findPath: function(x0, y0, x1, y1){
            return this.p.pathFinder.findPath(x0, y0, x1, y1, this.p.finderGrid.clone());
        }

    });

    Q.Sprite.extend("AStarGrid", {
        init: function(p){
            this._super(p, {
                grid: null,
                targetCellSize: 32,
                cellSize: 1,
                fillStyleWalkable: "rgba(0,0,0,0.15)",
                fillStyleBlocked: "rgba(0,255,0,0.25)"
            });
        },
        initializeFromCanvasContext: function(ctx){
            var aStarMap, d, n, x, y, i, j, row;
            aStarMap = [];
            this.p.x = this.container.p.x;
            this.p.y = this.container.p.y;
            this.p.w = this.container.p.w;
            this.p.h = this.container.p.h;
            this.p.cx = this.container.p.cx;
            this.p.cy = this.container.p.cy;
            x = this.p.w;
            y = this.p.h;

            d = ctx.getImageData(0,0,x,y).data;

            for (i=0,n=0;i<y;i++){
                row = [];
                for (j=0;j<x;j++){
                    row.push((d[n]===0 && d[n+1]===255 && d[n+2]===255) ? 0 : 1);
                    n+=4;
                }
                aStarMap.push(row);
            }
            this.p.cellSize = 1;
            this.p.grid = new PF.Grid(aStarMap[0].length,aStarMap.length,aStarMap);

            return this;
        },

        isWalkableAt: function(x, y){
            return this.p.grid.isWalkableAt(
                x,
                y
            );
        },

        world2Grid: function(worldPoint){
            return {
                x: Math.floor(worldPoint.x / this.p.cellSize),
                y: Math.floor(worldPoint.y / this.p.cellSize)
            };
        },

        grid2World: function(gridPoint){
            var cellSize = this.p.cellSize;
            var halfCellSize = cellSize/2-1;
            return {
                x: Math.floor(gridPoint.x * cellSize + halfCellSize),
                y: Math.floor(gridPoint.y * cellSize + halfCellSize)
            }
        },

        subFieldIsWalkable: function(x, y, grid, fieldSize){
            var xMax = x+fieldSize;
            var yMax = y+fieldSize;
            var xi, yj;

            for (xi=x;xi<xMax;xi++){
                for (yj=y;yj<yMax;yj++){
                    if (!grid.isWalkableAt(xi,yj)){
                        return false;
                    }
                }
            }
            return true;
        },

        reduce: function(){
            var grid = this.p.grid;
            var cellSize = Math.round(this.p.targetCellSize/this.p.cellSize);
            var gridReduced = new PF.Grid(Math.ceil(grid.width/cellSize), Math.ceil(grid.height/cellSize));
            var xi, yj;
            var xMax = Math.ceil(grid.width / cellSize);
            var yMax = Math.ceil(grid.height / cellSize);

            for (xi=0;xi<xMax;xi++){
                for (yj=0;yj<yMax;yj++){
                    gridReduced.setWalkableAt(
                        xi,
                        yj,
                        this.subFieldIsWalkable(
                            xi * cellSize,
                            yj * cellSize,
                            grid,
                            cellSize))
                }
            }
            this.p.cellSize = cellSize;
            this.p.grid = gridReduced;
            return this;
        },

        draw: function(ctx){
            var grid = this.p.grid;
            var cellSize =this.p.cellSize;
            var xi, yj;
            var xMax = Math.ceil(this.p.w / cellSize);
            var yMax = Math.ceil(this.p.h / cellSize);

            ctx.fillStyle = this.p.fillStyleBlocked;

            for (xi=0;xi<xMax;xi++){
                for (yj=0;yj<yMax;yj++){

                    if (grid.isWalkableAt(xi,yj)){
                        //do nothing
                    }else{
                        ctx.fillRect(xi*cellSize,yj*cellSize,cellSize,cellSize);
                    }

                }
            }
        }

    });


    Q.Sprite.extend("Village", {
        init: function(p) {
            this._super(p, {
                color: "red",
                strokeColor: "white",
                name: "incognopolis",
                villagesize: 6,
                findWaterSearchRadiusMax: 2
            });
            this.add("childQuery");
            this.add("positionResolver");
        }
        
    });

    Q.component("port", {
        added: function(){
            var neighbourBlocks, i;

            this.entity.p.ships = {};
            this.entity.on("ship.leaves", function(ship){
                this.shipLeft(ship);
            });
            this.entity.on("ship.enters", function(ship){
                this.shipEntered(ship);
            });
            this.entity.p.berths = [];
            //console.log("block",this.entity.p.block);
            neighbourBlocks = this.entity.p.block.block.neighbourBlocks();
            for (i=0;i<neighbourBlocks.length;i++){
                if (neighbourBlocks[i] instanceof Q.WaterBlock){
                    this.entity.p.berths.push({
                        xGrid: neighbourBlocks[i].xGrid,
                        yGrid: neighbourBlocks[i].yGrid,
                        ships: {}
                    });
                }
            }

        },

        allocBerthNumber: function(ship){
            var n = Math.round(Math.random()*(this.entity.p.berths.length-1));
            return n;
        },

        getBerthByN: function (nBerth) {
            return this.entity.p.berths[nBerth];
        },

        placeShipAtBerth: function(ship, berthNumber){
            this.entity.p.berths[berthNumber].ships[ship.p.name] = ship;
            this.entity.p.ships[ship.p.name] = [ship,berthNumber];
        },

        extend: {
            shipEntered: function(ship){
                this.port.placeShipAtBerth(ship,ship.p.destinationBerthNumber);
                this.p.ships[ship.p.name] = [ship,ship.p.destinationBerthNumber];
            },

            shipLeft: function(ship){
                var sInfo = this.p.ships[ship.p.name];
                delete this.p.berths[sInfo[1]].ships[ship.p.name];
                delete this.p.ships[ship.p.name];
            },

            getShips: function(){
                var s = [];
                for (var shipName in this.p.ships){
                    if (this.p.ships.hasOwnProperty(shipName)){
                        s.push(this.p.ships[shipName]);
                    }
                }
                return s;
            }

        }
    });


    Q.component("navigator", {
        added: function(){
            this.finder = new Q.GridPathFinder({grid: Q.state.get("terrain.grid"), entityOnWay: this.entity});
            this.on("cast.off", function(destination){
                this.entity.setDestination(destination);
                this.entity.updatePath();
                /*this.entity.on("step", function(dt){
                    this.moveNSteps(1); //TODO dt
                })*/
            });
        },

        extend: {
            findPath: function(x0, y0, x1, y1){
                return this.navigator.finder.findPath(
                    Math.round(x0),
                    Math.round(y0),
                    Math.round(x1),
                    Math.round(y1)
                );
            },
            castOffToDestination: function(destination){
                if (this.has("destination")){
                    throw "invoke castOff() instead of castOffToDestination() when ship already has a destination";
                }else{
                    this.setDestination(destination);
                    this.castOff();
                }

            },
            castOff: function(){
                if (this.has("destination")) {
                    this.navigator.trigger("cast.off", this.getDestination());
                }
            }
        }
    });

    Q.component("berth",{
        added: function(){
            var berth;
            if (this.entity.has("destination")){
                this.entity.p.berthVillage.trigger("ship.enters",this.entity);
                this.entity.del("destination");
                this.entity.del("origin");
            }else{
                this.entity.p.berthNumber = this.entity.p.berthVillage.port.allocBerthNumber(this.entity);
                this.entity.p.berthVillage.port.placeShipAtBerth(this.entity,this.entity.p.berthNumber);
                berth = this.entity.p.berthVillage.port.getBerthByN(this.entity.p.berthNumber);
                this.entity.updatePositionXY(
                    berth.xGrid,
                    berth.yGrid
                );
                console.log("berth at village "+this.entity.p.berthVillage.p.name,berth);
            }

        },
        extend: {
            getBerthVillage: function(){
                return this.p.berthVillage;
            }
        }
    });

    Q.component("origin",{
        added: function(){
            var berth;
            if (this.entity.has("berth")) {
                this.entity.getBerthVillage().trigger("ship.leaves", this.entity);
                this.entity.del("berth");
            }else{
                berth = this.entity.p.origin.port
                    .getBerthByN(this.entity.p.origin.port.allocBerthNumber(this.entity));
                this.entity.updatePositionXY(
                    berth.xGrid,
                    berth.yGrid
                )
            }
        },
        extend: {
            getOrigin: function(){
                return this.p.origin;
            }
        }
    });

    Q.component("destination",{
        added: function(){
            this.entity.p.path = [];
            this.entity.p.trace = [];
            this.entity.p.where = 0;
            if (!this.entity.has("origin")){
                if (this.entity.has("berth")){
                    this.entity.setOrigin(this.entity.getBerthVillage());    
                }else{
                    throw "destination.added() -> entity neither has origin nor berth";
                }
            }
            this.on("ship.moves",function(nmbSteps){
                this.entity.moveNSteps(nmbSteps);
            });
        },
        extend: {
            getDestination: function(){
                return this.p.destination;
            },
            updatePath: function(){
                var posBerthDestination = this.getDestination().port.getBerthByN(this.p.destinationBerthNumber);
                var t0 = new Date().getTime();
                this.p.path = this.findPath(
                    this.p.xGrid,
                    this.p.yGrid,
                    posBerthDestination.xGrid,
                    posBerthDestination.yGrid
                );
                var t1 = new Date().getTime();
                console.log("path finder needed "+(t1-t0)+" ms to find a path from "+this.p.name+" to "+this.getDestination().p.name+". Path has length = "+this.p.path.length);
            },
            moveNSteps: function(nSteps){
                var i, pathPoint;

                for (i=0;i<nSteps;i++){
                    if (this.p.path.length > 0) {
                        pathPoint = this.p.path.shift();
                        this.updatePositionXY(
                            pathPoint[0],
                            pathPoint[1]
                        );
                        this.p.trace.push(pathPoint);
                    }

                }
            },

            updateWhere: function(where){
                var stepsInPath;
                stepsInPath = Math.round(this.p.path.length * (where - this.p.where));
                if (stepsInPath > 0){

                    this.moveNSteps(stepsInPath);

                }
            }
        }
    });

    Q.Sprite.extend("Ship", {
        init: function(p) {
            this._super(p, {
                color: "yellow",
                strokeColor: "blue",
                name: "incognitoship",
                w:10,
                h:6,
                state: null,
                xGrid: 0,
                yGrid: 0,
                grid: null
            });
            this.add("navigator");
        },

        draw: function(ctx){

            if (this.has("destination")){
                this._super(ctx);
            }else{
                this._super(ctx);
            }

        },

        updateFromState: function(state){
            console.log(state);
            if (state.type === "at_berth"){

                if (!this.has("berth")) {
                    this.setBerthVillage(
                        Q.state.get("colonization.villages")[state.where.village]);
                }

            }else{
                if (state.type === "on_route"){

                    if (!this.has("origin"))
                    {

                        this.setOrigin(
                            Q.state.get("colonization.villages")[state.from.village]);

                        if (!this.has("destination")) {
                            this.setDestination(
                                Q.state.get("colonization.villages")[state.to.village]);
                        }

                        this.castOff();
                    }

                    this.updateWhere(state.where);

                }
            }
            this.p.state = state;
        },

        updatePositionXY: function(x, y){
            var p2DT;

            if (x<this.p.xGrid){
                this.play("sail_west");
            }else{
                if (x>this.p.xGrid){
                    this.play("sail_east");
                }else{
                    if (y<this.p.yGrid){
                        this.play("sail_north")
                    }else{
                        if (y>this.p.yGrid){
                            this.play("sail_south");
                        }
                    }
                }
            }

            this.p.xGrid = x;
            this.p.yGrid = y;

            p2DT = this.p.grid.translateFromGrid(new Point2D(x, y));

            this.p.x = p2DT.x;
            this.p.y = p2DT.y;
        },

        setDestination: function(destination){
            this.p.destination = destination;
            this.p.destinationBerthNumber = destination.port.allocBerthNumber(this);
            this.p.where = 0;
            this.add("destination");
        },
        setBerthVillage: function(berthVillage){
            this.p.berthVillage = berthVillage;
            this.add("berth");

        },

        setOrigin: function(origin){
            this.p.origin = origin;
            this.add("origin");
        }
    });

    Q.component("imageBuffered", {

        added: function(){
            this.entity.p.__offScreenCanvas = undefined;
            this.entity.p.__downScale = 1;
        },

        createOffscreenCanvas: function(width,height){
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas;
        },

        __bufferDraw: function(){
            var ctx;
            ctx = this.entity.p.__offScreenCanvas.getContext("2d");
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.clearRect(0, 0, this.entity.p.w, this.entity.p.h);
            this.entity._draw(ctx);
        },

        extend: {
            bufferImage: function(){
                if (!this.p.__offScreenCanvas){
                    this.p.__offScreenCanvas = this.imageBuffered.createOffscreenCanvas(
                            this.p.w,
                            this.p.h
                        );
                    this._draw  = this.draw;
                    this.imageBuffered.__bufferDraw();
                    this.draw = function(ctx){

                        ctx.scale(this.p.scale, this.p.scale);

                        ctx.globalAlpha = this.p.opacity;

                        ctx.drawImage(this.p.__offScreenCanvas, -this.p.cx, -this.p.cy);

                    };
                }else{
                    this.imageBuffered.__bufferDraw();
                }

            }
        }

    });

    Q.component("bufferedChild", {
        added: function(){
        }
    });

    Q.Sprite.extend("WaterCurrrent", {

        init: function(p){
            this._super(p, {
                colorMax: new RGBA(100,255,255,1),
                dtLife: 90,
                maxScale: 6,
                minScale: 4,
                maxOpacity: 0.8,
                minOpacity: 0.0,
                lifetimePassed: 0,
                x0: 0,
                y0: 0,
                x1: 100,
                y1: 100,
                x2: 200,
                y2: 200,
                scale: 1,
                opacity: 1.0,
                mapExtent: 256,
                w: 256,
                h: 256,
                mapRoughness: 20,
                map: null,
                ltRatio: 0,
                z: 2,
                sort: true,
                dir: 1

            });
            this.add("imageBuffered");
            this.on("inserted",function(){
                this.reset();
            });

        },

        reset: function(){
            this.p.dtLife = Math.round(Math.random()*60 + 60);
            this.p.lifetimePassed = 0;
            this.p.ltRatio = 0;
            this.p.x0 = Math.round(Math.random() * this.container.p.w);
            this.p.y0 = Math.round(Math.random() * this.container.p.h);
            this.p.x1 = Math.round(Math.random() * this.container.p.w);
            this.p.y1 = Math.round(Math.random() * this.container.p.h);
            this.p.x2 = Math.round(Math.random() * this.container.p.w);
            this.p.y2 = Math.round(Math.random() * this.container.p.h);
            this.p.maxOpacity = Math.random()*0.3 + 0.15;

            this.p.scale = this.p.minScale;
            this.p.x = this.p.x0;
            this.p.y = this.p.y0;
            this.p.opacity = this.p.minOpacity;
            this.p.dir = 1;
            this.p.map = generateTerrainMap(this.p.mapExtent,1,this.p.mapRoughness, new Date().getTime());
            this.bufferImage();

        },

        update: function(dt){

            var ltRatio;
            this.p.lifetimePassed += dt;
            ltRatio = parseFloat((this.p.lifetimePassed / this.p.dtLife).toPrecision(7));
            if (ltRatio > this.p.ltRatio) {
                if (ltRatio <= 1) {
                    this.p.scale = this.p.minScale + (this.p.maxScale - this.p.minScale) * ltRatio;
                    this.p.x = Math.round(this.p.x0 + (this.p.x1 - this.p.x0) * ltRatio);
                    this.p.y = Math.round(this.p.y0 + (this.p.y1 - this.p.y0) * ltRatio);
                    this.p.opacity = this.p.minOpacity + (this.p.maxOpacity - this.p.minOpacity) * ltRatio;
                    this.p.ltRatio = ltRatio;
                } else {
                    if (ltRatio <= 2){
                        ltRatio -= 1;
                        this.p.scale = this.p.maxScale - (this.p.maxScale - this.p.minScale) * ltRatio;
                        this.p.x = Math.round(this.p.x1 + (this.p.x2 - this.p.x1) * ltRatio);
                        this.p.y = Math.round(this.p.y1 + (this.p.y2 - this.p.y1) * ltRatio);
                        this.p.opacity = this.p.maxOpacity - (this.p.maxOpacity - this.p.minOpacity) * ltRatio;
                        this.p.ltRatio = ltRatio+1;
                    }else {
                        this.reset();
                    }
                }
            }
        },

        draw: function(ctx){
            var map, extent, color, i, j, opacity, cx, cy;
            //cx = this.p.x - this.p.cx;
            //cy = this.p.y - this.p.cy;
            map = this.p.map;
            extent = this.p.mapExtent;
            color = this.p.colorMax;
            //ctx.scale(this.p.scale,this.p.scale);
            //ctx.translate(this.p.x,this.p.y);
            for (i=0;i<extent;i++){
                for (j=0;j<extent;j++){
                    ctx.fillStyle = color.toFillStyleWithAlpha(map[i][j]);
                    ctx.fillRect(i,j,1,1);
                }
            }

        }

    });


    Q.Sprite.extend("CoastWater", {

        init: function(p){
            this._super(p, {
                maxColorCoastWater: new RGBA(73,243,221,1),
                maxOpacity: 0.8,
                minOpacity: 0.0,
                lifetimePassed: 0,
                scale: 1,
                opacity: 0.0,
                opacity0: 0.0,
                opacity1: 1.0,
                ltRatio: 0,
                z: 5,
                sort: true,
                threshold: -0.1,
                exponent: 1/3

            });
            this.add("imageBuffered");
            this.on("inserted",function(){
                this.bufferImage();

                this.reset();
            });

        },

        reset: function(){
            this.p.dtLife = Math.round(Math.random()*2 + 2);
            this.p.lifetimePassed = 0;
            this.p.ltRatio = 0;

            this.p.opacity0 = this.p.opacity;

            this.p.opacity1 = Math.random()*(this.p.maxOpacity-this.p.minOpacity)+this.p.minOpacity;

        },

        update: function(dt){

            var ltRatio;
            this.p.lifetimePassed += dt;
            ltRatio = parseFloat((this.p.lifetimePassed / this.p.dtLife).toPrecision(7));
            if (ltRatio > this.p.ltRatio) {
                if (ltRatio < 1) {
                    this.p.opacity = this.p.opacity0+ (this.p.opacity1 - this.p.opacity0) * ltRatio;
                    this.p.ltRatio = ltRatio;
                }else {
                    this.reset();
                }
            }

        },

        draw: function(ctx) {
            var w, h, i, j, colorCoastWater, heightXY;
            w = this.container.p.w;
            h = this.container.p.h;

            colorCoastWater = this.p.maxColorCoastWater;

            for (i = 0; i < w; i++) {
                for (j = 0; j < h; j++) {

                    heightXY = this.container.heightAt(i, j) - 0.9;

                    if (heightXY < 0) {

                        if (heightXY >= this.p.threshold) {

                            ctx.fillStyle = colorCoastWater.toFillStyleWithAlpha(Math.pow(1 + heightXY, this.p.exponent));
                            ctx.fillRect(i, j, 1, 1);

                        }
                    }

                }
            }
        }

    });

    Q.Sprite.extend("Land", {
        init: function(p) {
            this._super(p, {
                name: "Land",
                x:  0,
                y:  0,
                cx: 0,
                cy: 0,
                sort: true
            });
            this.add("childQuery");
            this.add("positionResolver");
        }
    });

    Q.Sprite.extend("Water", {
        init: function(p) {
            this._super(p, {
                name: "Water",
                maxColor: new RGBA(0,139,235,1), //blue
                x:  0,
                y:  0,
                cx: 0,
                cy: 0,
                sort: true
            });
            this.add("childQuery");
            this.add("positionResolver");
        },

        draw: function(ctx){

            var w, h, i, j, color, scale;
            w = this.p.w;
            h = this.p.h;
            scale = this.p.__downScale;
            color = this.p.maxColor;
            for (i=0;i<w;i+=scale){
                for (j=0;j<h;j+=scale){
                    ctx.fillStyle = color.toFillStyleWithAlpha(
                        Math.pow(Math.max(0,this.depthAt(i,j,i+scale-1,j+scale-1)),1/3)
                    );
                    ctx.fillRect(i, j, scale, scale);
                }
            }
        },

        insertCurrents: function(n, stage){
            var current;

            current = stage.insert(new Q.WaterCurrrent({
                maxColor: new RGBA(73, 243, 117, 1),
                mapRoughness: 20
            }), this);

            current = stage.insert(new Q.WaterCurrrent({
                maxColor: new RGBA(243, 73, 73, 1),
                mapRoughness: 25

            }), this);

            current = stage.insert(new Q.WaterCurrrent({
                maxColor: new RGBA(243, 73, 73, 1),
                mapRoughness: 20

            }), this);

            current = stage.insert(new Q.WaterCurrrent({
                maxColor: new RGBA(73, 113, 243, 1),
                mapRoughness: 30
            }), this);
        }
    });

    Q.Sprite.extend("Ground", {
        init: function(p) {
            this._super(p, {
                name: "Ground",
                maxColor: new RGBA(127,0,0,1), //brown
                x: 0,
                y: 0,
                cx: 0,
                cy: 0,
                sort: true
            });
            this.add("childQuery");
            this.add("positionResolver");
        },

        draw: function(ctx) {
            var w, h, i, j, color, scale;
            w = this.p.w;
            h = this.p.h;
            scale = this.p.__downScale;

            color = this.p.maxColor;

            for (i = 0; i < w; i+=scale) {
                for (j = 0; j < h; j+=scale) {
                    ctx.fillStyle = color.toFillStyleWithAlpha(this.averageHeightIn(i, j, i+scale-1, j+scale-1));
                    ctx.fillRect(i, j, scale, scale);
                }
            }

        }
    });
    
    Q.Class.extend("MappedGridBlock", {
        init: function(point2DGrid, block, grid){
            this.point2DGrid = point2DGrid;
            this.block = block;
            this.grid = grid;
        } 
    });

    Q.MappedGridBlock.extend("MappedGridBlockCoastline", {
        init: function(point2DGrid, block, grid){
            this._super(point2DGrid,block,grid);
            this.village = undefined;
        }
    });

    Q.Sprite.extend("Island",{

        init: function(p) {
            this._super(p, {
                brownianIsland: null,
                maxColor: new RGBA(127,0,0,1), //brown
                maxColorSnow: new RGBA(255,255,227,1),
                maxColorFlora: new RGBA(0,255,0,1),
                //maxColorCoastWater: new RGBA(0,255,235,1),
                maxColorBeach: new RGBA(255,255,0,1),
                x: 100,
                y: 100,
                w: 100,
                h: 100,
                padding: 20,
                cx: 50,
                cy: 50,
                z: 10,
                scale: 1,
                points: [],
                coastline: [],
                villages: []
            });
            this.add("childQuery");
            this.add("positionResolver");
            this.projectCoastline();
        },

        projectCoastline: function(){
            var origin = new Point2D(this.p.cx+(this.p.padding), this.p.cy+(this.p.padding)),
                scaleX = (this.p.w - (this.p.padding*2)) / this.p.brownianIsland.width(),
                scaleY = (this.p.h - (this.p.padding*2)) / this.p.brownianIsland.height(),
                scale =  Math.min(scaleX, scaleY),
                i, pProjected;

            this.p.points = [];
            for (i=0;i<this.p.brownianIsland.coastline.length;i++){
                pProjected = this.p.brownianIsland.coastline[i].project(origin,scale);
                this.p.points.push([Math.round(pProjected.x), Math.round(pProjected.y)]);
            }
        },

        draw: function(ctx) {
            var w, h, i, j, color, colorSnow, colorCoastWater, heightXY;
            w = this.p.w;
            h = this.p.h;

            color = this.p.maxColor;
            colorSnow = this.p.maxColorSnow;
            //colorCoastWater = this.p.maxColorCoastWater;

            for (i = 0; i < w; i++) {
                for (j = 0; j < h; j++) {

                    heightXY = this.heightAt(i, j) - 0.9;

                    if (heightXY >= 0) {
                        ctx.fillStyle = color.toFillStyleWithAlpha(1);
                        ctx.fillRect(i, j, 1, 1);

                        ctx.fillStyle = colorSnow.toFillStyleWithAlpha(Math.pow(heightXY, 2/3));
                        ctx.fillRect(i, j, 1, 1);

                    }else {

   /*                     if (heightXY >= -0.1) {

                            ctx.fillStyle = colorCoastWater.toFillStyleWithAlpha(Math.pow(1 + heightXY, 1/4));
                            ctx.fillRect(i, j, 1, 1);

                        }*/
                    }

                }
            }
        },

        bindGrid: function(grid){
            var w, h, i, j, step, block, coastline, point, cPoint;
            step = grid.p.blockSize;
            w = Math.floor(this.p.w/step);
            h = Math.floor(this.p.h/step);

            cPoint = grid.translateToGrid(new Point2D(this.p.x - this.p.cx, this.p.y - this.p.cy));
            coastline = this.p.coastline;
            for (i=0;i<w;i++){
                for (j=0;j<h;j++){
                    point = new Point2D(cPoint.x+i, cPoint.y+j);
                    block = grid.getBlock(point);
                    if (block instanceof Q.LandBlock){
                        block.island = this;
                    }else{
                        if (block instanceof Q.CoastlineBlock){
                            block.island = this;
                            coastline.push(new Q.MappedGridBlockCoastline(point, block, grid));
                        }
                    }
                }
            }
        },

        insertCoastWaters: function(stage){
            stage.insert(new Q.CoastWater({
                maxColorCoastWater: new RGBA(73,243,221,1),
                maxOpacity: 0.75,
                minOpacity: 0,
                lifetimePassed: 0,
                scale: 1,
                opacity: 1.0,
                ltRatio: 0,
                z: 5,
                sort: true,
                threshold: -0.15,
                exponent: 1/3,
                w: this.p.w,
                h: this.p.h,
                cx: Math.round(this.p.w/2)-this.p.padding,
                cy: Math.round(this.p.h/2)-this.p.padding
            }), this);

            stage.insert(new Q.CoastWater({
                maxColorCoastWater: new RGBA(226,248,240,1),
                maxOpacity: 0.755,
                minOpacity: 0,
                lifetimePassed: 0,
                scale: 1,
                opacity: 1.0,
                ltRatio: 0,
                z: 5,
                sort: true,
                threshold: -0.1,
                exponent: 1,
                w: this.p.w,
                h: this.p.h,
                cx: Math.round(this.p.w/2)-this.p.padding,
                cy: Math.round(this.p.h/2)-this.p.padding
            }), this);

            stage.insert(new Q.CoastWater({
                maxColorCoastWater: new RGBA(73,243,181,1),
                maxOpacity: 0.825,
                minOpacity: 0,
                lifetimePassed: 0,
                scale: 1,
                opacity: 1.0,
                ltRatio: 0,
                z: 5,
                sort: true,
                threshold: -0.2,
                exponent: 2,
                w: this.p.w,
                h: this.p.h,
                cx: Math.round(this.p.w/2)-this.p.padding,
                cy: Math.round(this.p.h/2)-this.p.padding

            }), this);

            stage.insert(new Q.CoastWater({
                maxColorCoastWater: new RGBA(73,255,181,1),
                maxOpacity: 0.825,
                minOpacity: 0,
                lifetimePassed: 0,
                scale: 1,
                opacity: 1.0,
                ltRatio: 0,
                z: 5,
                sort: true,
                threshold: -0.25,
                exponent: 1/4,
                w: this.p.w,
                h: this.p.h,
                cx: Math.round(this.p.w/2)-this.p.padding,
                cy: Math.round(this.p.h/2)-this.p.padding

            }), this);
        }
    });

    Q.Class.extend("Point", {
        init: function(x, y, grid){
            this.x = x;
            this.y = y;
            this.grid = grid;
        }
    });



    function Archipelago() {

        this.webSocket = null;



    }

    Archipelago.prototype.newWorld = function(worldStateModel, wampSession){

        var terrain, colonization, shipping, i, ship, ships;

        Q.clearStages();

        this.makeScenes(worldStateModel);

        Q.setup("archipelago_canvas");

        Q.load(["/images/Seats-of-power.png","/images/Sailship_s.png"],function(){

            Q.sheet("buildings",
                "/images/Seats-of-power.png",
                {
                    tilew: 140,  // Each tile is 40 pixels wide
                    tileh: 140,  // and 40 pixels tall
                    sx: 0,   // start the sprites at x=0
                    sy: 0    // and y=0
                });

            Q.sheet("ship",
                "/images/Sailship_s.png",
                {
                    tilew: 64,  // Each tile is 40 pixels wide
                    tileh: 64,  // and 40 pixels tall
                    sx: 0,   // start the sprites at x=0
                    sy: 0    // and y=0
                });

            Q.animations("ship", {
                sail_south: { frames: [0,1,2], rate: 1/1 },
                sail_west: { frames: [3,4,5], rate:1/1 },
                sail_east: { frames: [6,7,8], rate: 1/1 },
                sail_north: { frames: [9,10,11], rate: 1/1 }
            });

            terrain = Q.stageScene("terrain",0,
                {
                    terrainModel: worldStateModel.terrain,
                    scale: 2
                });

            terrain.viewport.scale = 1;

            colonization = Q.stageScene("colonization",1,
                {
                    colonizationModel: worldStateModel.colonization
                });

            colonization.viewport.scale = 1;

            wampSession.subscribe("archipelago/user/erwin/ingame/world/svbtranslation/shipping/ships", function(uri, payload){

                shipping = Q.stageScene("transport.shipping",2,
                    {
                        shippingModel: payload.shipping
                    });

                shipping.viewport.scale = 1;

                ships = Q.state.get("transport.shipping.ships");

                for (i in ships){
                    if (ships.hasOwnProperty(i)) {
                        (function (ship) {

                            wampSession.subscribe("archipelago/user/erwin/ingame/world/svbtranslation/shipping/ship/" + ship.p.name, function (uri, payload) {
                                var t0, t1;
                                t0 = new Date().getTime();
                                ship.updateFromState(payload.state);
                                //ship.castOff();
                                t1 = new Date().getTime();
                                console.log("time to update ship "+ship.p.name, (t1-t0));
                            });



                        })(ships[i]);
                    }
                }

                Q.stageScene("controls",10,
                    {
                        stages: [terrain, colonization, shipping]
                    });
            });


        });


    };

    Archipelago.prototype.generateGroundMap = function(extentFull, unitSize, seed){
        var extent, map, min=1000,max=-1000, scale;
        extent = extentFull / unitSize;
        map = generateTerrainMap(extentFull,unitSize,30,seed).map(
            function(row){

                return row.map(function(h){
                    return h;
                });

            }
        );
        for (var i=0;i<extentFull;i++) {
            for (var j = 0; j < extentFull; j++) {
                if (map[i][j] < min) min = map[i][j];
                if (map[i][j] > max) max = map[i][j];
            }
        }
        scale = max-min;
        for (var i=0;i<extentFull;i++) {
            for (var j = 0; j < extentFull; j++) {
                map[i][j] = map[i][j]/scale - min;
            }
        }

        return map;
    };

    Archipelago.prototype.makeScenes = function(){
        var archipelago = this;
        Q.scene("terrain", function(stage){

            var i, terrainModel, extent, scale, islandModel,
                island, water, land, ground, base, padding, bufferedSprites, islands,
                t0, t1, t2, t3, t4;

            t0 = new Date().getTime();

            terrainModel = stage.options.terrainModel;
            scale = stage.options.scale;
            extent = terrainModel.extent * scale;

            bufferedSprites = [];

            base = stage.insert(new Q.Sprite({
                name: "Base",
                x:  0,
                y:  0,
                cx: 0,
                cy: 0,
                w: extent,
                h: extent,
                color: "rgba(255,255,255,0)",
                z: 0,
                sort: true
            }));

            bufferedSprites.push(base);

            base.add("childQuery");
            base.add("imageBuffered");

            ground = stage.insert(new Q.Ground({
                x:  0,
                y:  0,
                cx: 0,
                cy: 0,
                w: extent,
                h: extent,
                z: 1,
                sort: true
            }), base);

            bufferedSprites.push(ground);

            ground.add("heightMap");
            ground.add("imageBuffered");

            ground.p.__downScale = 4;

            t1 = new Date().getTime();

            ground.p.heightMap =
                archipelago.generateGroundMap(
                    extent,
                    1,
                    terrainModel.levels.ground.displace.seed);

            t2 = new Date().getTime();

            console.log("time spent for generateGroundMap", (t2-t1));

            water = stage.insert(new Q.Water({
                x: 0,
                y: 0,
                cx: 0,
                cy: 0,
                w: extent,
                h: extent,
                z: 2,
                sort: true
            }), base);

            bufferedSprites.push(water);

            water.add("depthMap");
            water.p.container = ground;
            water.add("imageBuffered");
            water.p.levelHeight = 1;
            water.p.__downScale = 4;

            water.insertCurrents(5, stage);

            land = stage.insert(new Q.Land({
                x: 0,
                y: 0,
                cx: 0,
                cy: 0,
                w: extent,
                h: extent,
                z: 3,
                sort: true
            }), base);

            padding = 32 * scale;
            islands = {};
            for (i=0;i<terrainModel.islands.length;i++){

                islandModel = terrainModel.islands[i];
                t1 = new Date().getTime();
                island = stage.insert(new Q.Island({
                    name: islandModel.name,
                    brownianIsland: new BrownianIsland(islandModel.gestalt).grow(),
                    x:  islandModel.position.x * scale,
                    y:  islandModel.position.y * scale,
                    w:  islandModel.extent*scale+(2*padding),
                    h:  islandModel.extent*scale+(2*padding),
                    padding: padding,
                    cx: Math.floor((islandModel.extent*scale)/2),
                    cy: Math.floor((islandModel.extent*scale)/2),
                    z: 4,
                    sort: true
                }), land);
                t2 = new Date().getTime();
                console.log(island.p.name, "time spent for island.grow", (t2-t1));

                islands[island.p.name] = island;
                bufferedSprites.push(island);

                island.add("sketchPad");
                island.add("heightMap");
                island.add("imageBuffered");

                t1 = new Date().getTime();
                island.p.heightMap = island.rasterizeShape([island.sketchPad.smoothenEdgesDownwards]);

                island.heightMap.stackUp(ground.p.heightMap);
                island.insertCoastWaters(stage);
                t2 = new Date().getTime();
                console.log(island.p.name, "time spent for island.rasterize", (t2-t1));
            }

            t1 = new Date().getTime();
            for (i=0; i<bufferedSprites.length;i++){
                t3 = new Date().getTime();
                bufferedSprites[i].bufferImage();
                t4 = new Date().getTime();
                console.log("TIME BUFFERIMAGE", bufferedSprites[i].p.name, (t4-t3));
            }
            t2 = new Date().getTime();
            console.log("time spent for bufferImage*", (t2-t1));
            Q.state.set("terrain.ground", ground);
            Q.state.set("terrain.islands", islands);
            Q.state.set("terrain.grid", new Q.TerrainGrid({
                blockSize: 32
            }).initializeFromTerrain());
            t1 = new Date().getTime();
            console.log("time spent for grid.initializeFromGround", (t1-t2));
            console.log("TIME FOR TERRAIN STAGING ",(t1-t0));
            stage.add("viewport");
            

        }, {
            terrainModel: {
                extent: 0,
                levels: {
                    ground: {
                        height: 0,
                        displace: {
                            seed: 0
                        }
                    },
                    sea: {
                        depth: 1
                    }
                },
                islands: []
            },
            scale: 1
        });
        
        //colonization:
        Q.scene("colonization", function(stage){

            var i, colonizationModel, villageModel, corner, islands, island, villageBlock, village, villages, labelVillage, t0, t1;

            t0 = new Date().getTime();
            colonizationModel = stage.options.colonizationModel;
            islands = Q.state.get("terrain.islands");
            villages = {};

            corner = 0;

            for (i=0;i<colonizationModel.villages.length;i++){
                villageModel = colonizationModel.villages[i];
                island = islands[villageModel.island];
                corner += villageModel.corner;
                villageBlock = island.p.coastline[corner % island.p.coastline.length];

                while (
                        (villageBlock.village instanceof Q.Village)
                        || (villageBlock.block.degreeOfSeaAccess() < 2)
                        || (island.p.coastline.some(function(mappedBlock){
                            return (mappedBlock.village instanceof Q.Village) && mappedBlock.block.isNeighbourOf(villageBlock.block);
                        }))
                    ){
                    corner *= 3;
                    corner -= 11;
                    villageBlock = island.p.coastline[corner % island.p.coastline.length];
                }

                village = stage.insert(new Q.Village({
                    name: villageModel.name,
                    x: villageBlock.block.x,
                    y: villageBlock.block.y,
                    w: villageBlock.block.w+38,
                    h: villageBlock.block.h+38,
                    cx: 19,
                    cy: 19,
                    block: villageBlock,
                    sheet: "buildings",
                    frame: corner%8,
                    scale: 0.5
                }));

                labelVillage = stage.insert(new Q.UI.Text({
                    x: Math.round(village.p.w*0.5),
                    y: Math.round(village.p.h*1.75),
                    label: village.p.name,
                    weight: 600,
                    size: 26,
                    family: "Arial",
                    outlineColor: "black",
                    outlineWidth: 2,
                    color: "rgb(220,218,194)"

                }), village);

                village.add("port");

                villageBlock.village = village;

                villages[village.p.name] = village;
            }

            Q.state.set("colonization.villages", villages);

            stage.add("viewport");

            t1 = new Date().getTime();

            console.log("TIME STAGING COLONIZATION", (t1-t0));

        }, {
            colonizationModel: {
                villages: []
            }
        });

        //shipping model:
        Q.scene("transport.shipping", function(stage){

            var i, grid, shippingModel, shipModel, ships, villages, ship,
                t0, t1;

            t0 = new Date().getTime();
            shippingModel = stage.options.shippingModel;
            grid = Q.state.get("terrain.grid");
            villages = Q.state.get("colonization.villages");

            ships= {};

            for (i=0;i<shippingModel.ships.length;i++){
                shipModel = shippingModel.ships[i];

                ship = stage.insert(new Q.Ship({
                    name: shipModel.name,
                    grid: grid,
                    state: shipModel.state,
                    cx: 32,
                    cy: 32,
                    sprite: "ship",
                    sheet: "ship"
                }));

                ship.add("animation");

                ships[ship.p.name] = ship;
            }

            Q.state.set("transport.shipping.ships", ships);

            stage.add("viewport");

            t1 = new Date().getTime();

            console.log("TIME STAGING SHIPPING ",(t1-t0));

        }, {
            shippingModel: {
                ships: []
            }
        });

        //controls:

        Q.scene("controls", function(stage){
            var buttonPlus, buttonMinus, buttons;
            buttonPlus = stage.insert(new Q.UI.Button({
                x: Q.width - 80,
                y: Q.height - 40,
                w: 30,
                h: 30,
                label: '+',
                opacity: 0.8,
                hidden: false, // Set to true to not show the container
                fill:   "white", // Set to color to add background
                highlight:   "gray", // Set to color to for button
                radius: 5, // Border radius
                stroke: "#ffffff",
                border: 1, // Set to a width to show a border
                shadow: true, // Set to true or a shadow offest
                shadowColor: "gray", // Set to a rgba value for the shadow
                outlineWidth: false, // Set to a width to outline text
                outlineColor: "#000",
                callback: function(){
                    var i, _stage;
                    for (i=0;i<stage.options.stages.length;i++){
                        _stage = stage.options.stages[i];
                        _stage.viewport.scale *= 2;
                    }
                }
            }));
            buttonMinus = stage.insert(new Q.UI.Button({
                x: Q.width - 40,
                y: Q.height - 40,
                w: 30,
                h: 30,
                label: '-',
                opacity: 0.8,
                hidden: false, // Set to true to not show the container
                fill:   "white", // Set to color to add background
                highlight:   "gray", // Set to color to for button
                radius: 5, // Border radius
                stroke: "#ffffff",
                border: 1, // Set to a width to show a border
                shadow: true, // Set to true or a shadow offest
                shadowColor: "gray", // Set to a rgba value for the shadow
                outlineWidth: false, // Set to a width to outline text
                outlineColor: "#000",
                callback: function(){
                    var i, _stage;
                    for (i=0;i<stage.options.stages.length;i++){
                        _stage = stage.options.stages[i];
                        _stage.viewport.scale /= 2;
                    }
                }
            }));
            buttons = [buttonPlus, buttonMinus];

            Q.el.addEventListener("click", function(e){
                x = e.pageX - this.offsetLeft - $(Q.el).offset().left;
                y = e.pageY - this.offsetTop - $(Q.el).offset().top;

                var i, button, bx0, bx1 , by1, by0;
                for (i=0;i<buttons.length;i++) {
                    button = buttons[i];
                    bx0 = button.p.x - button.p.cx;
                    bx1 = bx0 + button.p.w;
                    by0 = button.p.y - button.p.cy;
                    by1 = by0 + button.p.h;

                    if (bx0 <= x
                        && bx1 >= x
                        && by0 <= y
                        && by1 >= y) {

                        button.p.callback();

                    }
                }
            });

        }, {
            stages: []
        });


    };

  /*


    AUTOBAHN ENGINE


  */

    Archipelago.prototype.run = function () {
        var archipelago = this;

        this.webSocket = WS.connect("ws://127.0.0.1:8080");

        this.webSocket.on("socket/connect", function(session){
            //session is an Autobahn JS WAMP session.

            session.subscribe("archipelago/user/erwin/ingame/world/svbtranslation/origin", function(uri, payload){

                archipelago.newWorld(payload.world, session);

            });

            console.log("Successfully Connected!");
        });

        this.webSocket.on("socket/disconnect", function(error){
            //error provides us with some insight into the disconnection: error.reason and error.code

            console.log("Disconnected for " + error.reason + " with code " + error.code);
        })
    };


    // === public:
    var archipelago = new Archipelago();

    return {
        run: function(){

            archipelago.run();

        }
    }

};

