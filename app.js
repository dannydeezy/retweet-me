const Twitter = require('twitter');
const config = require('./credentials.js');
const client = new Twitter(config);
const fs = require('fs');

const INTERVAL = 20000;
const USER_TO_RETWEET = process.argv[2];

function retweet(ids) {
    for (const id of ids) {
        const params = { id };
        client.post(`statuses/retweet/${id}`, params, (err, data, response) => {
            if (err) {
                console.dir(err);
                return;
            }
            console.dir(`Retweeted ${id}`);
        });
        client.post(`favorites/create`, params, (err, data, response) => {
            if (err) {
                console.dir(err);
                return;
            }
            console.dir(`Liked ${id}`);
        });
    }
    fs.writeFileSync('./lastTweet', ids[ids.length - 1]);
}

function fetchAndUpdate() {
    const params = {
        screen_name: USER_TO_RETWEET,
        count: 30,
    };
    if (fs.existsSync('./lastTweet')) {
        params.since_id = fs.readFileSync('./lastTweet').toString();
    }
    client.get('statuses/user_timeline', params, (err, data, response) => {
        if (err) {
            console.dir(err);
            return;
        }
        if (data.length === 0) {
            console.log('No new tweets found');
            return;
        }
        const ids = data.map(d => d.id_str);
        ids.sort();
        retweet(ids);
    });
}

setInterval(fetchAndUpdate, INTERVAL);