# Pxer

<p align="left">
	<img src="https://travis-ci.org/pea3nut/Pxer.svg?branch=master" />
	<img src="https://img.shields.io/badge/PV-10k/day-blue.svg" />
	<img src="https://img.shields.io/badge/JavaScript-Pure-green.svg" />
	<img src="https://img.shields.io/badge/InstallBy-Tampermonkey-green.svg" />
	<img src="https://img.shields.io/badge/jQuery-No-red.svg" />
	<img src="https://img.shields.io/github/license/pea3nut/Pxer" />
</p>

> [中文文档](/README.zh.md) | [English](/README.md)

纯客户端 JavaScript 编写的 [pixiv.net](https://www.pixiv.net) 爬虫工具，日均万级 PV！

开源免费，易于使用，非开发者也可简单安装使用。请前往[安装页面](http://pxer.pea3nut.org/install)进行安装使用！

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
