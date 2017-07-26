'use strict';

const _ = require('lodash');
const TYPE = require('../type');

module.exports = [
    // 老版newURL
    {
        type: TYPE.redirect,
        origin: '/new?gender=1,3&order=s_t_desc&msort=1,3,4,6,7,8,308,360',
        target: helpers.urlFormat('/boys-new/', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/new?gender=2,3&order=s_t_desc&msort=1,3,4,6,7,8,308,360',
        target: helpers.urlFormat('/girls-new/', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/new?order=s_t_desc&msort=365',
        target: helpers.urlFormat('/kids-new/', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/new?order=s_t_desc&msort=10',
        target: helpers.urlFormat('/lifestyle-new/', null, 'list')
    },

    // 男生销售类目一级菜单
    {
        type: TYPE.redirect,
        origin: '/?gender=1,3&msort=1,3',
        target: helpers.urlFormat('/?category_id=5,8&gender=1,3', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?gender=1,3&msort=6',
        target: helpers.urlFormat('/?category_id=11&gender=1,3', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?gender=1,3&msort=7',
        target: helpers.urlFormat('/?category_id=14&gender=1,3', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?gender=1,3&msort=8',
        target: helpers.urlFormat('/?category_id=17&gender=1,3', null, 'list')
    },

    // 女生销售类目一级菜单
    {
        type: TYPE.redirect,
        origin: '/?gender=2,3&msort=1,3',
        target: helpers.urlFormat('/?category_id=18,31,25&gender=2,3', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?gender=2,3&msort=6',
        target: helpers.urlFormat('/?category_id=52&gender=2,3', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?gender=2,3&msort=7',
        target: helpers.urlFormat('/?category_id=59&gender=2,3', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?gender=2,3&msort=8,10,241',
        target: helpers.urlFormat('/?category_id=76&gender=2,3', null, 'list')
    },

    // 潮童销售类目一级菜单
    {
        type: TYPE.redirect,
        origin: '/?gender=1,2,3&misort=382,368,372,448,392,388,384,414,429,390,425,464&msort=365',
        target: helpers.urlFormat('/?category_id=13,16,15&gender=1,2,3', null, 'list')
    },

    // 创意生活销售类目一级菜单
    {
        type: TYPE.redirect,
        origin: '/?msort=10&misort=103',
        target: helpers.urlFormat('/?category_id=21', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?msort=10&misort=266',
        target: helpers.urlFormat('/?category_id=20', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?msort=10&misort=101,280',
        target: helpers.urlFormat('/?category_id=251', null, 'list')
    },
    {
        type: TYPE.redirect,
        origin: '/?misort=259&msort=10',
        target: helpers.urlFormat('/?category_id=23', null, 'list')
    },

    // 筛选参数排序匹配
    {
        type: TYPE.redirect,
        origin: req => {
            if (_.isEmpty(req.query)) {
                return false;
            }

            let sorts = mapSort(req.query);
            let queryKeys = _.keys(req.query);
            let index = 0;
            let matched = _.map(sorts, (val, key) => {
                return key === queryKeys[index++];
            });

            if (_.every(matched, match => match)) {
                return false;
            }

            return true;
        },
        target: req => helpers.urlFormat(req.path, mapSort(req.query), 'list')
    },
    {
        type: TYPE.rewrite,
        origin: req => {
            return !req.path || req.path === '/';
        },
        target: '/product/list/index'
    },
    {
        type: TYPE.rewrite,
        origin: /\/(.*)-new/,
        target: (req, match, channel) => {
            return `/product/list/${channel}-new`;
        }
    },
    {
        type: TYPE.rewrite,
        origin: req => req.path === '/new',
        target: '/product/list/new'
    }
];
