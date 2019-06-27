'use strict';
const path = require('path');
const Controller = require('egg').Controller;
const fs = require('fs'); 
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async test() {
    const { ctx } = this;
    await this.ctx.render('test/test.tpl');
    // ctx.body = 'hi, egg456';

  }

  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    // 生成文件名
    const filename = Date.now() + '' + Number.parseInt(Math.random() * 10000) + path.extname(stream.filename);

    console.log(filename);

    console.log("" + stream);
    
    
    // 写入路径
    const target = path.join(this.config.baseDir, 'app/public/upload/', filename);
    const writeStream = fs.createWriteStream(target);

    // console.log(writeStream);

    
    try {
      // 写入文件
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
    ctx.body = stream.fields;


  }


}

module.exports = HomeController;
