
const isProduction = process.env.NODE_ENV === 'production'; // 生产
const isStage = process.env.NODE_ENV === 'stage'; // 灰度
const isTest = process.env.NODE_ENV === 'test'; // 测试

const config = {
  port: 3000
};

if (isProduction) {
  Object.assign(config, {

  });
} else if (isStage) {
  Object.assign(config, {

  });
} else if (isTest) {
  Object.assign(config, {

  });
}

module.exports = config;
