let GitHubApi = require('github'),
    axios = require('axios'),
    ff = require('./flatfile.js');

let github = new GitHubApi({
    debug: true,

    protocol: 'https',
    headers: {
        'user-agent': 'github-label-watcher'
    },
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
});


github.issues.getForRepo({
        owner: '<INSERRT REPO OWNER>',
        repo: '<INSERT REPO',
        state: 'open',
        labels: '<INSERT LABELs>'
    }
).then(function (res) {

    if (res.data < 1) return Promise.reject('No PR');

    let wantedData = {
        html_url: res.data[0].html_url,
        id: res.data[0].id,
        number: res.data[0].number,
        title: res.data[0].title,
        created_at: res.data[0].created_at,
        body: res.data[0].body
    };

    ff.get(wantedData.id).then(function (res) {
        if (!res) {

            let msg = {
                text: '<!everyone|everyone>',
                attachments: [
                    {
                        //'fallback': 'New master -> stable',
                        //'pretext': '',
                        'title': 'PR: ' + wantedData.number + ' - ' + wantedData.title,
                        'title_link': wantedData.html_url,
                        'text': wantedData.body,
                        'color': 'warning',
                        'mrkdwn_in': ['title', 'pretext']
                    }
                ]
            };

            let calls = [
                axios.post('<INSERT URL>', msg
                ),
                axios.post('<INSERT URL>', msg
                )];

            axios.all(calls).then(function (res) {
                ff.save(wantedData.id)
            })
        }
    }).catch(function (err) {
        console.log(err);
    })
}).catch(function (err) {
    if (!err === 'No PR') {
        console.log(err);
    }
});