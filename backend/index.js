let request = require('request');

exports.handler = (event, context, callback) => {
    let score = event.queryStringParameters.score;

    if (score) {
        score = parseInt(score, 10);
    } else {
        callback(null, {
            statusCode: 400,
            body: {
                error: 'A score must be provided'
            },
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    let token = '619456688258561|2C1gUON8OWKpSpxmsWPZBRQZ_pc';
    let pageId = getPageIdBaseOnScore(score);

    getRandomSexyImage(token, pageId, 460) // Facebook error, can get more than 500 offset
    .then(result => {
            callback(null, {
                statusCode: 200,
                body: {
                    result: result
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            })
    });

}

function getPageIdBaseOnScore(score) {
    var normal = [189695764410814, 429347487112306, 1269826469732326, 323925094473196];
    var sexy = [1786207988368795, 637445302949772, 1224869587565040, 169974406437267];

    if (score % 5 === 0) {
        return getRandomElement(sexy);
    } else {
        return getRandomElement(normal);
    }
}

function getRandomElement(array) {
    let randomIndex = Math.floor((Math.random() * array.length));
    return array[randomIndex];
}

function getRandomSexyImage(token, pageId, maxIndex) {
    var randomIndex = Math.floor((Math.random() * maxIndex));

    return new Promise((resolve, reject) => {
        request({
            url: `https://graph.facebook.com/v2.9/${pageId}/photos/`,
            qs: {
                fields: "images",
                limit: 1,
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
            var imageUrl = rs.data[0].images[0].source;
            resolve(imageUrl);
        });
    });
};