//自己写的，在非Box3环境下使用
//根据官方文档编写
class Box3Vector3 {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class Box3Bounds3 {
    /**
     * 
     * @param {Box3Vector3} lo 
     * @param {Box3Vector3} hi 
     */
    constructor(lo, hi) {
        this.lo = lo;
        this.hi = hi;
    }
}
module.exports = {
    Box3Vector3: Box3Vector3,
    Box3Bounds3: Box3Bounds3
};