'use strict';

const TYPE = require('../type');

module.exports = [
    {
        type: TYPE.rewrite,
        origin: /.*/,
        target: req => `/shop/${req.url}`
    }
];
