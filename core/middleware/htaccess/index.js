/**
 * 后端:改写和跳转:中间件。
 *
 * 说明：
 * 该中间件使用：使用文件夹下 rule 的所有的文件，以文件名的形式，载入该模块
 * 文件的名字建议以网站子域名的形式存在，如：guang, item
 * 每个文件夹是一个模块。
 *
 * 模块的导出形式：见 guang 模块的使用。
 * Created by TaoHuang on 2017/2/21.
 */

'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const helpers = global.yoho.helpers;
const logger = global.yoho.logger;

const TYPE = require('./type');
const DIR = './rules/';
const curDir = path.resolve(__dirname, DIR);
const files = fs.readdirSync(curDir);

let domainRules = {};

// 启动时就载入模块
files.forEach((file) => {
    let info = fs.statSync(path.resolve(curDir, file));

    if (info.isFile()) {
        let module = path.basename(file, '.js');
        let loadPath = DIR + module;

        try {
            domainRules[module] = require(loadPath);
        } catch (e) {
            logger.error('load rules wrong', e);
        }
    }
});

// 选择模块
const loadRule = (domain) => {
    return domainRules[domain] || domainRules.default;
};

// 已处理完
class Done {
    constructor(val) {
        this.__val = val;
    }

    map(fn) {
        return new Done(fn(this.__val));
    }

    val() {
        return this.__val;
    }

    static of(val) {
        return new Done(val);
    }
}

const stepX = (fn) => {
    return (maybe) => {
        if (maybe instanceof Done) {
            return maybe;
        }
        return fn(maybe);
    };
};

// 判断是否需要处理
const isNeedHandle = (req, rule) => {
    return (_.isRegExp(rule.origin) && rule.origin.test(req.url)) ||
        (_.isFunction(rule.origin) && rule.origin(req) ||
        (_.isString(rule.origin) && _.isEqual(req.url, rule.origin)));
};

// 正则
const step1 = (req, rule, url) => {
    if (_.isRegExp(rule.origin)) {
        if (_.isFunction(rule.target)) {
            return Done.of(url.replace(rule.origin, _.partial(rule.target, req)));
        } else if (_.isString(rule.target)) {
            return Done.of(url.replace(rule.origin, rule.target));
        }
    }

    return url;
};

// 函数
const step2 = (req, rule, url) => {
    if (_.isFunction(rule.origin)) {
        if (_.isFunction(rule.target)) {
            return Done.of(rule.target(req));
        } else if (_.isString(rule.target)) {
            return Done.of(rule.target);
        }
    }

    return url;
};

// 字符
const step3 = (req, rule, url) => {
    if (_.isString(rule.origin)) {
        if (_.isFunction(rule.target)) {
            return Done.of(rule.target(req));
        } else if (_.isString(rule.target)) {
            return Done.of(rule.target);
        }
    }

    return url;
};

const getResultStatus = (req, rule, newUrl) => {
    if (newUrl instanceof Done) {
        if (newUrl.val() === req.url) {
            return {
                needNext: true,
                needRedirect: false,
                process: false
            };
        } else if (rule.type === TYPE.redirect) {
            return {
                needNext: false,
                needRedirect: true,
                process: true,
                url: newUrl.val()
            };
        } else if (rule.type === TYPE.rewrite) {
            return {
                needNext: true,
                needRedirect: false,
                process: true,
                url: newUrl.val()
            };
        }
    }

    return {
        needNext: true,
        needRedirect: false,
        process: false
    };
};

const isJsonp = (req) => {
    return _.includes(req.url, 'callback');
};

/**
 * 1. origin 可接受是 正则 , 函数, 纯字符串
 * 2. target 可接受是 匹配字符串 , 函数, 纯字符串
 * 3. 301: 跳转
 *    rewrite: 改写 url
 * @returns {Function}
 */
module.exports = () => {
    return (req, res, next) => {
        if (req.subdomains.length > 1 && req.subdomains[1] === 'www') {
            return res.redirect(301, helpers.urlFormat(req.path, req.query || '', req.subdomains[0]));
        }

        req.isMobile = /(nokia|iphone|android|ipad|motorola|^mot\-|softbank|foma|docomo|kddi|up\.browser|up\.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220)/i.test(req.get('user-agent')); // eslint-disable-line

        if (req.xhr || isJsonp(req)) {
            return next();
        }

        let rules = loadRule(req.subdomains[0]);
        let useRule = _.find(rules, rule => isNeedHandle(req, rule));

        if (!useRule) {
            return next();
        }

        let step1x = stepX(_.partial(step1, req, useRule, _));
        let step2x = stepX(_.partial(step2, req, useRule, _));
        let step3x = stepX(_.partial(step3, req, useRule, _));
        let processAfter = _.partial(getResultStatus, req, useRule, _);
        let processing = _.flow(step1x, step2x, step3x);

        let process = _.flow(processing, processAfter);
        let result = process(req.url);

        if (result.process) {
            if (result.needRedirect) {
                return res.redirect(301, result.url);
            }

            if (result.needNext) {
                req.url = result.url;
                return next();
            }
        }

        return next();
    };
};
