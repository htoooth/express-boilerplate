'use strict';

const helpers = global.yoho.helpers;
const TYPE = require('../type');

module.exports = [
    {
        type: TYPE.redirect,
        origin: /.*/,
        target: req => helpers.urlFormat(req.url, null, 'www')
    }
];
