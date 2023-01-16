const fs = require("fs"), { Box3Vector3, Box3Bounds3 } = require("./Box3"), compression = require("./main-Box3"), config = require("./config");
var worldVoxels = null, inputBuf = Buffer.alloc(20971520), worldShape = new Box3Vector3();
console.log('尝试打开文件……');
fs.open('input.txt', 'r', ((err, fd) => {
    if (err) {
        console.error('文件打开失败', err);
        return err;
    }
    console.log('文件打开成功');
    console.log('尝试读取文件……');
    fs.read(fd, inputBuf, 0, inputBuf.length, 0, ((err, bytesRead, buffer) => {
        if (err) {
            console.error('读取文件时错误', err);
            return err;
        }
        console.log('文件读取成功');
        console.info('文件大小', bytesRead, '字节');
        var str = buffer.toString('utf-8');
        worldVoxels = JSON.parse(str.slice(0, bytesRead));
        worldShape.set(worldVoxels.length, worldVoxels[0].length, worldVoxels[0][0].length);
        console.log('数据解析成功');
        console.info('地图大小', worldShape.x, worldShape.y, worldShape.z);
        console.log('尝试关闭文件……');
        fs.close(fd, ((err) => {
            if (err) {
                console.error(err);
                return err;
            }
            console.log('关闭文件成功');
            var result = compression(worldVoxels);
            console.log('尝试创建文件……');
            fs.open('output.txt', 'wx', ((err) => {
                if (config.checkForDuplicateFiles && err) {
                    console.warn('output.txt 文件已存在，请删除后重试');
                    return err;
                }
                console.log('文件创建成功');
                console.log('尝试写入文件……');
                fs.writeFile('output.txt', result, ((err) => {
                    if (err) {
                        console.error(err);
                        return err;
                    }
                    console.log('文件写入成功');
                }));
            }));
        }));
    }));
}));