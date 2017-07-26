/**
 * Created by TaoHuang on 2017/2/22.
 */

'use strict';

const helpers = global.yoho.helpers;
const TYPE = require('../type');

module.exports = [
    {
        type: TYPE.redirect,
        origin: /\/about\?shopId=([\d]+)/,
        target: (req, match, id) => {
            return helpers.urlFormat(`/shop${id}-about`, null, req.subdomains[0]);
        }
    },
    {
        type: TYPE.rewrite,
        origin: /\/shop([\d]+)-about/,
        target: (req, match, id) => {
            req.query.domain = req.subdomains[0];
            req.query.shopId = id;
            return '/product/index/about';
        }
    }
];
