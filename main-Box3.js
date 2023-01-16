const { Box3Vector3, Box3Bounds3 } = require("./Box3");//Box3环境下不要这行代码

/**
 * 
 * @param {number[][][]} data 
 * @returns {string}
 */
function compression(data) {
    console.log('压缩开始');
    var result = '', worldShape = new Box3Vector3(data.length, data[0].length, data[0][0].length),
        arr = new Uint16Array(worldShape.x * worldShape.y * worldShape.z), arrLen = 0;
    //写入地图尺寸信息 3字符
    result = `${String.fromCharCode(worldShape.x)}${String.fromCharCode(worldShape.y)}${String.fromCharCode(worldShape.z)}`;
    //将三维数组转化为一维数组（降维）
    for (let i = 0; i < worldShape.x; i++) {
        for (let j = 0; j < worldShape.y; j++) {
            for (let k = 0; k < worldShape.z; k++) {
                arr[arrLen++] = data[i][j][k];
            }
        }
    }
    console.info('共 %d 个方块', arr.length);
    //压缩+编码
    var nowID = undefined, cnt = 0, charCode = 0, index = 0;
    for(let voxel of arr){
        index++;
        //压缩
        if(cnt < 256 && (nowID == undefined || nowID == voxel)) cnt++;
        else {
            //编码
            /*24位为一段
            POS 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N
               |             voxel             |      cnt      |
            voxel 方块id             0~65535    16位
            cnt   段长度             0~255      8位
            */
            //24 * 28 = 16 * 3 = 48
            let nowCharCode = (voxel << 16) | cnt;
            if(charCode > 0xffff){//超过16位或者到达末尾
                result += String.fromCharCode(charCode >> 16);
                charCode %= 0xffff;//舍去左边16位
                charCode <= 24;
                charCode |= nowCharCode;
            } else {
                charCode <<= 24;//左移24位
                charCode |= nowCharCode
            }
            //重置，开始下一段
            nowID = voxel;
            cnt = 1;
        }
        while(charCode > 0){
            if(charCode > 0xffff){
                result += String.fromCharCode(charCode >> 16);
                charCode %= 0xffff;//舍去左边16位
            } else {
                //无论如何，后面都只会剩下8位
                result += String.fromCharCode(charCode << 8);
                charCode >>= 8;
            }
        }
    }
    console.log('压缩完成');
    return result;
}
module.exports = compression;