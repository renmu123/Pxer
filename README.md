# fork 版本更新

停止向原作者服务器发送统计代码
禁止依赖原作者服务器的 vue
油猴脚本禁止远程加载
作品的解析从访问详情页修改为调用列表页，速度约加快 20 倍，减小对 pixiv 服务器的压力。
除 tag 过滤其余的过滤项以及设置项失效。

# Pxer

<p align="left">
	<img src="https://api.travis-ci.org/FoXZilla/Pxer.svg?branch=dev" />
	<img src="https://img.shields.io/badge/PV-10k/day-blue.svg" />
	<img src="https://img.shields.io/badge/JavaScript-Pure-green.svg" />
	<img src="https://img.shields.io/badge/InstallBy-Tampermonkey-green.svg" />
	<img src="https://img.shields.io/badge/jQuery-No-red.svg" />
	<img src="https://img.shields.io/github/license/pea3nut/Pxer" />
</p>

> [中文文档](/README.zh.md) | [English](/README.md)

A tool which for [pixiv.net](https://www.pixiv.net), which written by pure clint javascript and which PV attained 10k+.

Open source, free and easy to use even you are not a development. Please go [install page](http://pxer.pea3nut.org/install) for using.

<img src="/public/pxer-ui.gif?raw=true" />

## Development

1. Change your Chrome config for allow insecure in localhost
   Navigate to `chrome://flags/#allow-insecure-localhost` and set this to enabled
1. Go project directory and run `npm install` for install dependence
1. Run `npm run dev`
1. Add 'src/local.user.js' in TamperMonkey
1. Open some web page and you will see the run result

## License

[MIT](http://opensource.org/licenses/MIT)
