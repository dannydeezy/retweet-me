const Twitter = require('twitter');
const config = require('./credentials.js');
const client = new Twitter(config);
const fs = require('fs');

const INTERVAL = 20000;
const USER_TO_RETWEET = process.argv[2];
const reply_with_shutup = process.argv.length > 3
const lastTweetFile = `./lastTweet-${USER_TO_RETWEET}`

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
    fs.writeFileSync(lastTweetFile, ids[ids.length - 1]);
}

function replyTo(ids) {
    for (const id of ids) {
        const status = `@${USER_TO_RETWEET} shut up`
        const params = { in_reply_to_status_id: id, status };
        client.post(`statuses/update`, params, (err, data, response) => {
            if (err) {
                console.dir(err);
                return;
            }
            console.dir(`Replied shut up to ${id}`);
        });
    }
    fs.writeFileSync(lastTweetFile, ids[ids.length - 1]);
}

function fetchAndUpdate() {
    const params = {
        screen_name: USER_TO_RETWEET,
        count: 30,
    };
    if (fs.existsSync(lastTweetFile)) {
        params.since_id = fs.readFileSync(lastTweetFile).toString();
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
        
        if (reply_with_shutup) {
            replyTo(ids);
        } else {
            retweet(ids);
        }
    });
}

setInterval(fetchAndUpdate, INTERVAL);