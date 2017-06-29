let request = require('request');

exports.handler = (event, context, callback) => {
    let token = 'YOUR_TOKEN_HERE';
    let sexyPageId = getPageId(true);
    let normalPageId = getPageId(false);

    let promise = Promise.all([
        getRandomImage(token, normalPageId, 15, 450),
        getRandomImage(token, sexyPageId, 5, 500)
    ]);

    promise.then(result => {
        let response = {
            normal: result[0],
            sexy: result[1]
        }
        callback(null, {
                statusCode: 200,
                body: JSON.stringify(response),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
    });
}

function getPageId(isSexy) {
    var normal = [189695764410814, 429347487112306, 1269826469732326, 323925094473196];
    var sexy = [1786207988368795, 637445302949772, 1224869587565040, 169974406437267];

    if (isSexy) {
        return getRandomElement(sexy);
    } else {
        return getRandomElement(normal);
    }
}

function getRandomElement(array) {
    let randomIndex = Math.floor((Math.random() * array.length));
    return array[randomIndex];
}

function getRandomImage(token, pageId, limit, maxIndex) {
    var randomIndex = Math.floor((Math.random() * (maxIndex - limit)));

    return new Promise((resolve, reject) => {
        request({
            url: `https://graph.facebook.com/v2.9/${pageId}/photos/`,
            qs: {
                fields: "images",
                limit: limit,
                offset: randomIndex,
                access_token: token
            },
            method: "GET"
        }, (err, response, body) => {
            if (err) {
                reject(err);
                return;
            }

            var rs = JSON.parse(body);
            var imageUrls = rs.data.map(data => data.images[0].source);
            //var imageUrl = rs.data[0].images[0].source;
            resolve(imageUrls);
        });
    });
};
