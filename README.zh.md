# 说明

此项目 fork 自[Pxer](https://github.com/FoXZilla/Pxer)，我对代码做了额外更新。

# 版本更新

停止向原作者服务器发送统计代码
禁止依赖原作者服务器的 vue
油猴脚本禁止远程加载
新增快速模式作品的解析从访问详情页修改为调用列表页，速度约加快 20 倍，减小对 pixiv 服务器的压力。

# Pxer

<p align="left">
	<img src="https://travis-ci.org/pea3nut/Pxer.svg?branch=master" />
	<img src="https://img.shields.io/badge/PV-10k/day-blue.svg" />
	<img src="https://img.shields.io/badge/JavaScript-Pure-green.svg" />
	<img src="https://img.shields.io/badge/InstallBy-Tampermonkey-green.svg" />
	<img src="https://img.shields.io/badge/jQuery-No-red.svg" />
	<img src="https://img.shields.io/github/license/pea3nut/Pxer" />
</p>

<img src="/public/pxer-ui.gif?raw=true" />

## 开发

1. 修改你的 Chrome 运行本地混流
   打开 `chrome://flags/#allow-insecure-localhost` 并设置为 enabled
   1 命令行进入项目目录，运行 `npm install` 安装依赖
1. 运行 `npm run dev`
1. 在 TamperMonkey 中添加 `src/local.user.js`
1. 打开某些页面（如 Pixiv）你将会看到本地的 Pxer 的运行结果

## 开源许可证

[MIT](http://opensource.org/licenses/MIT)
