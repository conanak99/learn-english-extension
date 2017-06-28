var handler = require('./index.js').handler;

handler({
    queryStringParameters: {
        score: 5
    }
}, null, (err, res) => {
    console.log(JSON.stringify(res, null, 2));
});