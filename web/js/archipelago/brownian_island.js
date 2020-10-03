/**
 * Created by martin on 10.10.15.
 */

/**
 *
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Point2D(x, y){
    this.x = x;
    this.y = y;
}

/**
 *
 * @param {Point2D} pointOfOriginInTarget
 * @return {Point2D}
 */
Point2D.prototype.project = function(pointOfOriginInTarget, scale){
    return new Point2D(
        this.x * scale + pointOfOriginInTarget.x,
        this.y * scale + pointOfOriginInTarget.y
    );
};

Point2D.prototype.toString = function(){
    return "("+this.x+", "+this.y+")";
};

Point2D.prototype.minMerge = function(otherPoint) {
    if (this.x > otherPoint.x) this.x = otherPoint.x;
    if (this.y > otherPoint.y) this.y = otherPoint.y;
    return this;
};

Point2D.prototype.maxMerge = function(otherPoint) {
    if (this.x < otherPoint.x) this.x = otherPoint.x;
    if (this.y < otherPoint.y) this.y = otherPoint.y;
    return this;
};

Point2D.prototype.toPrecision = function(precision){
    this.x = parseFloat(this.x.toPrecision(precision));
    this.y = parseFloat(this.y.toPrecision(precision));
};


/**
 *
 * @param {string} name
 * @param {object} gestalt
 * gestalt:
 * {
 *  N: <int>,
 *  SIGMA: <float>,
 *  seed: <int>
 * }
 *
 * @constructor
 */
function BrownianIsland(gestalt) {
    this.gestalt = gestalt;
    this.coastline = [];
    this.upperLeft = new Point2D(0,0);
    this.lowerRight = new Point2D(0,0);
    this.center = new Point2D(0,0);
}

BrownianIsland.prototype.__midpoint = function(x0, y0, x1, y1, SIGMA, N, gaussRandom) {
    var xMid, yMid, p;
    if (N === 0) {
        p = new Point2D(x1, y1);
        this.coastline.push(p);
        this.upperLeft.minMerge(p);
        this.lowerRight.maxMerge(p);
    } else {
        xMid = 0.5 * (x0 + x1) + gaussRandom.nextGaussianMeanDev(0, Math.sqrt(SIGMA));
        yMid = 0.5 * (y0 + y1) + gaussRandom.nextGaussianMeanDev(0, Math.sqrt(SIGMA));
        this.__midpoint(x0, y0, xMid, yMid, SIGMA / 2.7, N - 1, gaussRandom);   // 3 seems to be a good value
        this.__midpoint(xMid, yMid, x1, y1, SIGMA / 2.7, N - 1, gaussRandom);
    }
};

BrownianIsland.prototype.grow = function () {
    if (this.coastline.length == 0) {
        this.coastline = [];
        this.upperLeft = new Point2D(0, 0);
        this.lowerRight = new Point2D(0, 0);
        this.center = new Point2D(0, 0);

        this.__midpoint(
            this.center.x, this.center.y,
            this.center.x, this.center.y,
            this.gestalt.SIGMA / Math.sqrt(2),
            this.gestalt.N,
            new GaussRandom(this.gestalt.seed)
        );
        this.__center();
    }
    return this;
};

BrownianIsland.prototype.__center = function(){
    var shiftXBy = this.lowerRight.x - this.width()/2;
    var shiftYBy = this.lowerRight.y - this.height()/2;
    for (var i=0;i<this.coastline.length;i++){
        this.coastline[i].x -= shiftXBy;
        this.coastline[i].y -= shiftYBy;
        //this.coastline[i].toPrecision(8);
    }
    this.upperLeft.x -= shiftXBy;
    this.lowerRight.x -= shiftXBy;
    this.upperLeft.y -= shiftYBy;
    this.lowerRight.y -= shiftYBy;
};

BrownianIsland.prototype.width = function() {
    return this.lowerRight.x - this.upperLeft.x;
};

BrownianIsland.prototype.height = function() {
    return this.lowerRight.y - this.upperLeft.y;
};





