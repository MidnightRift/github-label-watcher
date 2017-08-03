let flatfile = {},
    fse = require('fs-extra');

flatfile.get = function (key) {
    return fse.readJson('flat.json').then(function (data) {
        return (key in data)
    })
};
flatfile.save = function (key) {
    return fse.readJson('flat.json').then(function (data) {
        if (!(key in data)) {
            data[key] = Date.now();
            let count = Object.keys(data).length;
            if (count > 50) {
                let oldest = null;
                for (let k in data) {
                    if (oldest === null) oldest = k; continue;
                    if (data[k] < data[oldest] ) oldest = k;
                }
                delete data[oldest];
            }
            return fse.writeJson('flat.json', data);
        }
    })
};

module.exports = flatfile;