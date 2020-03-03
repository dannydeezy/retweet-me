# Retweet Me !
Automatically retweet and like everything from an account you follow

## Usage
1. Create a [ Twitter developer account and create an App ](https://developer.twitter.com/)
2. Find a place to run this script (a lightweight VM would be great)
3. Clone the repo and install
```
git clone https://github.com/dannydeezy/retweet-me.git
cd retweet-me
npm i
```
4. From your App's Details page, locate your API keys and access tokens, and create file in your `retweet-me` directory called `credentials.js` that looks like this (fill in the correct values):
```
module.exports = {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
};
```
5. Run the app with the username you'd like to retweet, like this:
```
node app.js dannydiekroeger
```
6. Profit.