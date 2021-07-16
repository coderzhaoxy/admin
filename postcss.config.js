/*
 * @Author: your name
 * @Date: 2021-07-12 08:57:28
 * @LastEditTime: 2021-07-13 16:16:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \shoppra\postcss.config.js
 */
module.exports = {
  plugins: {
      "postcss-px-to-viewport": {
        viewportWidth: 1920,
        viewHeight:1080,
        unitPrecision: 5,
        viewportUnit: 'vw',
        minPixelValue: 1,
        mediaQuery: false,
        // selectorBlackList: ['ignore'],
        // exclude:[/Home/]
      }
    }
}
