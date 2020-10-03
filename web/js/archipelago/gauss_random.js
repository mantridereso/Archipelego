/**
 * Created by martin on 10.10.15.
 */
function GaussRandom(seed){
    this.mersenneTwister = new Random(Random.engines.mt19937().seed(seed));
    this._vc = 0;
    this._iterations = 0;
}

/**
 *
 * @return {number}
 */
GaussRandom.prototype.nextGaussian = function(){
    this._iterations++;
    if (this._iterations%2===0){
        return this._vc;
    }else {
        var u = 2 * this.mersenneTwister.realZeroToOneInclusive() - 1;
        var v = 2 * this.mersenneTwister.realZeroToOneInclusive() - 1;
        var r = u * u + v * v;
        /*if outside interval [0,1] start over*/
        if (r == 0 || r > 1) return this.nextGaussian();

        var c = Math.sqrt(-2 * Math.log(r) / r);
        this._vc = v*c;
        return u * c;
    }
    /* todo: optimize this algorithm by caching (v*c)
     * and returning next time gaussRandom() is called.
     * left out for simplicity */
};

/**
 *
 * @param mean
 * @param stdDev
 * @return {number}
 */
GaussRandom.prototype.nextGaussianMeanDev = function(mean, stdDev){
    return mean + (this.nextGaussian()*stdDev);
};