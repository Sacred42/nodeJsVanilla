const getBody = (req) => {
    return new Promise((resolve, reject) => {
        let data;
        req.on('data', function (chunk) {
            data = chunk.toString();
        })

        req.on('end', function () {
            resolve(data);
        })

        req.on('error', function (error) {
            reject(error);
        })
    })
}

module.exports = getBody;