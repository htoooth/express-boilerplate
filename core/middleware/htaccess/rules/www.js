'use strict';

// const _ = require('lodash');

const TYPE = require('../type');

module.exports = [
    {
        type: TYPE.redirect,
        origin: /\/product\/sale\/\?channel=(.*)/,
        target: (req, match, channel) => {
            return helpers.urlFormat(`/product/${channel}-sale/`);
        }
    },
    {
        type: TYPE.redirect,
        origin: '/product/sale/?msort=10',
        target: helpers.urlFormat('/product/lifestyle-sale/')
    },

    // 商品详情页老链接，形试一
    {
        type: TYPE.redirect,
        origin: /^\/product\/pro_([\d]+)_([\d]+)\/(.*).html(.*)/,
        target: (req, match, p1, p2, p3, p4) => helpers.urlFormat(`/p${p1}.html${p4}`, null, 'item')
    },

    // 商品详情页老链接，形式二
    {
        type: TYPE.redirect,
        origin: /^\/product\/pro_([\d]+)(.*)/,
        target: (req, match, p1) => helpers.urlFormat(`/p${p1}.html`, null, 'item')
    },

    // 商品详情页新链接
    {
        type: TYPE.redirect,
        origin: /^\/p([\d]+)(.*)/,
        target: req => helpers.urlFormat(req.url, null, 'item')
    },

    // 品牌一览
    {
        type: TYPE.redirect,
        origin: /\/brands\?.*channel=(boys|girls|kids|lifestyle)/,
        target: (req) => {
            return helpers.urlFormat(
                `/${req.query.channel}-brands/`,
                null,
                'www'
            );
        }
    },

    // 品牌一览专题
    {
        type: TYPE.redirect,
        origin: (req) => req.path === '/brands/plusstar',
        target: (req) => {
            return helpers.urlFormat(
                `/${req.query.channel}-brands/plusstar/id${req.query.id || 0}-p${req.query.page || 1}/`,
                null,
                'www'
            );
        }
    },

    // 推荐词列表页
    {
        type: TYPE.rewrite,
        origin: /^\/so\/(.*)\.html(.*)/,
        target: (req, match, p1) => `/product/search/keyword/${p1}`
    },

    // 推荐词id列表页
    {
        type: TYPE.rewrite,
        origin: /^\/chanpin\/(.*)\.html(.*)/,
        target: (req, match, p1) => `/product/search/chanpin/${p1}`
    },

    // erp2good
    {
        type: TYPE.rewrite,
        origin: (req) => {
            return req.path === '/erp2goods';
        },
        target: '/common/erp2goods'
    },
    {
        type: TYPE.redirect,
        origin: '/index.html',
        target: helpers.urlFormat('/')
    }

];
