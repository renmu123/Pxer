﻿class PxerPrinter {
  constructor(config, taskOption) {
    this.taskOption = taskOption;

    /**
     * 计算得到的下载地址
     * @type {string[]}
     * */
    this.address = [];
    /**计算得到的任务信息*/
    this.taskInfo = "";
    /**剥离的动图参数*/
    this.ugoiraFrames = {};

    /**配置信息*/
    this.config = PxerPrinter.defaultConfig();
    config && this.setConfig(config);
  }

  /**
   * 设置配置信息
   * @param {string|Object} key - 要设置的key或是一个将被遍历合并的对象
   * @param {string} [value] - 要设置的value
   * */
  setConfig(key, value) {
    if (arguments.length === 1 && typeof key === "object") {
      let obj = key;
      for (let objKey in obj) {
        if (objKey in this.config) this.config[objKey] = obj[objKey];
        else console.warn(`PxerPrinter.setConfig: skip key "${objKey}"`);
      }
    } else {
      if (!(key in this.config))
        throw new Error(`PxerPrinter.setConfig: ${key} is not in config`);
      this.config[key] = value;
    }
    return this;
  }
}

/**
 * 根据作品列表将下载地址填充到PxerPrinter#address
 * @param {PxerWorks[]} worksList
 * @return {void}
 * */
PxerPrinter.prototype["fillAddress"] = function (worksList) {
  for (let works of worksList) {
    let configKey = PxerPrinter.getWorksKey(works);
    if (configKey === "ugoira_zip" && this.config["ugoira_frames"] === "yes") {
      this.ugoiraFrames[works.id] = works.frames;
    }
    if (!(configKey in this.config))
      throw new Error(`PxerPrinter.fillAddress: ${configKey} in not in config`);
    if (this.config[configKey] === "no") continue;
    this.address.push(
      ...PxerPrinter.countAddress(
        works,
        this.taskOption,
        this.config[configKey]
      )
    );
  }
};

/**
 * 根据作品将可读的下载信息填充到PxerPrinter#taskInfo
 * @param {PxerWorks[]} worksList
 * @return {void}
 * */
PxerPrinter.prototype["fillTaskInfo"] = function (worksList) {
  var [manga, ugoira, illust, multiple, single, worksNum, address] = new Array(
    20
  ).fill(0);
  for (let works of worksList) {
    let configKey = PxerPrinter.getWorksKey(works);
    if (this.config[configKey] === "no") continue;

    worksNum++;

    switch (works.type) {
      case "manga":
        manga++;
        break;
      case "ugoira":
        ugoira++;
        break;
      case "illust":
        illust++;
        break;
      default:
        console.error(works);
        throw new Error(`PxerPrinter.fillTaskInfo: works.type illegal`);
        break;
    }

    if (works.isMultiple) {
      multiple++;
      address += works.multiple;
    } else {
      address++;
      single++;
    }
  }

  this.taskInfo = eval(pxer.t("phrase.taskInfo"));
};
/**
 * 将结果输出
 * 确保下载地址和任务信息已被填充
 * */
PxerPrinter.prototype["print"] = function () {
  /**判断输出动图参数*/
  if (
    this.config["ugoira_frames"] === "yes" &&
    Object.keys(this.ugoiraFrames).length !== 0
  ) {
    let win = window.open(document.URL, "_blank");
    if (!win) {
      alert(pxer.t("phrase.blockOpen"));
      return;
    }

    var scriptname = "";
    switch (navigator.platform) {
      case "Win32":
        scriptname = "bat批处理";
        break;
      default:
        scriptname = "bash";
        break;
    }
    let str = [
      "<p>/** 这个页面是自动生成的使用FFmpeg自行合成动图的" +
        scriptname +
        '脚本，详细使用教程见<a href="http://pxer.pea3nut.org/md/ugoira_concat" target="_blank" >http://pxer.pea3nut.org/md/ugoira_concat</a> */</p>',
      '<textarea style="height:100%; width:100%" readonly>',
      ...this.generateUgoiraScript(this.ugoiraFrames),
      "</textarea>",
    ];
    win.document.write(str.join("\n"));
  }

  {
    /**输出下载地址*/
    let win = window.open(document.URL, "_blank");
    if (!win) {
      alert(pxer.t("phrase.blockOpen"));
      return;
    }

    let str = [
      `<p>${pxer.t("phrase.pointPage")}</p>`,
      `<p>${this.taskInfo}</p>`,
      '<textarea style="height:100%; width:100%" readonly>',
      this.address.join("\n"),
      "</textarea>",
    ];
    win.document.write(str.join("\n"));
  }
};

/**
 * 根据作品类型，生成配置信息的key
 * @param {PxerWorks} works
 * @return {string}
 * @see PxerPrinter.defaultConfig
 * */
PxerPrinter.getWorksKey = function (works) {
  var configKey = null;
  if (works.type === "ugoira") {
    configKey = "ugoira_zip";
  } else {
    configKey = works.type + (works.isMultiple ? "_multiple" : "_single");
  }

  return configKey;
};

/**
 * 根据动图参数，生成ffmpeg脚本
 * @param 动图参数
 * @return {String[]} 生成的脚本行
 * @see PxerPrinter.prototype['print']
 */
PxerPrinter.prototype["generateUgoiraScript"] = function (frames) {
  var lines = [];
  var resstring;
  var ffmpeg;
  var isWindows =
    ["Win32", "Win64", "Windows", "WinCE"].indexOf(navigator.platform) !== -1;
  switch (this.config.ugoira_zip) {
    case "max":
      resstring = "1920x1080";
      break;
    case "600p":
      resstring = "600x338";
      break;
  }
  var slashstr = "";
  if (isWindows) {
    slashstr = "^";
    ffmpeg = "ffmpeg";
    lines.push("@echo off");
    lines.push("set /p ext=请输入输出文件扩展名(mp4/gif/...):");
  } else {
    slashstr = "\\";
    ffmpeg = "$ffmpeg";
    lines.push("#!/bin/bash");
    lines.push("");
    lines.push(
      '{ hash ffmpeg 2>/dev/null && ffmpeg=ffmpeg;} || { [ -x ./ffmpeg ] && ffmpeg=./ffmpeg;} || { echo >&2 "Failed to locate ffmpeg executable. Aborting."; exit 1;}'
    );
    lines.push("read -p '请输入输出文件扩展名(mp4/gif/...):' ext");
  }
  for (let key in frames) {
    var foldername = key + "_ugoira" + resstring;
    var confpath = foldername + "/config.txt";
    var height = frames[key].height;
    var width = frames[key].width;
    if (this.config.ugoira_zip === "600p") {
      var scale = Math.max(height, width) / 600;
      height = parseInt(height / scale);
      width = parseInt(width / scale);
    }
    lines.push(
      isWindows
        ? "del " + foldername + "\\config.txt >nul 2>nul"
        : "rm " + foldername + "/config.txt &> /dev/null"
    );
    for (let frame of frames[key].framedef) {
      lines.push(
        "echo file " +
          slashstr +
          "'" +
          frame["file"] +
          slashstr +
          "' >> " +
          confpath
      );
      lines.push("echo duration " + frame["delay"] / 1000 + " >> " + confpath);
    }
    lines.push(
      "echo file " +
        slashstr +
        "'" +
        frames[key].framedef[frames[key].framedef.length - 1]["file"] +
        slashstr +
        "' >> " +
        confpath
    );
    lines.push(isWindows ? "if %ext%==gif (" : 'if [ $ext == "gif"]; then');
    lines.push(
      ffmpeg +
        " -f concat -i " +
        confpath +
        " -vf palettegen " +
        foldername +
        "/palette.png"
    );
    lines.push(
      ffmpeg +
        " -f concat -i " +
        confpath +
        " -i " +
        foldername +
        "/palette.png -lavfi paletteuse -framerate 30 -vsync -1 -s " +
        width +
        "x" +
        height +
        " " +
        foldername +
        "/remux." +
        (isWindows ? "%ext%" : "$ext")
    );
    lines.push(isWindows ? ") else (" : "else");
    lines.push(
      ffmpeg +
        " -f concat -i " +
        confpath +
        " -framerate 30 -vsync -1 -s " +
        width +
        "x" +
        height +
        " " +
        foldername +
        "/remux." +
        (isWindows ? "%ext%" : "$ext")
    );
    lines.push(isWindows ? ")" : "fi");
  }
  if (isWindows) {
    lines.push("echo 完成 & pause");
  } else {
    lines.push('read  -n 1 -p "完成，按任意键退出" m && echo');
  }
  return lines;
};

/**返回默认的配置对象*/
PxerPrinter.defaultConfig = function () {
  return {
    manga_single: "max", //[max|600p|no]
    manga_multiple: "max", //[max|1200p|cover_600p|no]
    illust_single: "max", //[max|600p|no]
    illust_multiple: "max", //[max|1200p|cover_600p|no]
    ugoira_zip: "no", //[max|600p|no]
    ugoira_frames: "no", //[yes|no]
  };
};
/**作品页跳过过滤 */
PxerPrinter.printAllConfig = function () {
  return {
    manga_single: "max", //[max|600p|no]
    manga_multiple: "max", //[max|1200p|cover_600p|no]
    illust_single: "max", //[max|600p|no]
    illust_multiple: "max", //[max|1200p|cover_600p|no]
    ugoira_zip: "max", //[max|600p|no]
    ugoira_frames: "yes", //[yes|no]
  };
};

/**
 * 拼装动图原始地址
 * @param {PxerUgoiraWorks} works - 作品
 * @param {string} [type] - 拼装类型 [max|600p]
 * @return {Array}
 * */
PxerPrinter.getUgoira = function (works, taskOption, type = "max") {
  const tpl = {
    max: "https://#domain#/img-zip-ugoira/img/#date#/#id#_ugoira1920x1080.zip",
    "600p": "https://#domain#/img-zip-ugoira/img/#date#/#id#_ugoira600x600.zip",
  };

  var address = tpl[type];
  if (!address) throw new Error(`PxerPrint.getUgoira: unknown type "${type}"`);

  for (let key in works) {
    address = address.replace(`#${key}#`, works[key]);
  }

  return [address];
};
/**
 * 拼装多副原始地址
 * @param {PxerMultipleWorks} works - 作品
 * @param {string} [type] - 拼装类型 [max|1200p|cover_600p]
 * @return {Array}
 * */
PxerPrinter.getMultiple = function (works, taskOption, type = "max") {
  const tpl = {
    max: "https://#domain#/img-original/img/#date#/#id#_p#index#.#fileFormat#",
    "1200p":
      "https://#domain#/c/1200x1200/img-master/img/#date#/#id#_p#index#_master1200.jpg",
    cover_600p:
      "https://#domain#/c/600x600/img-master/img/#date#/#id#_p0_master1200.jpg",
  };

  if (taskOption.isQuick) {
    let address = tpl[type];
    if (!address)
      throw new Error(`PxerPrint.getMultiple: unknown type "${type}"`);

    // 由于不知道是jpg还是png，所以要渲染两次
    works["fileFormat"] = "jpg";
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    //渲染多张
    var addressList1 = [];
    for (let i = 0; i < works.multiple; i++) {
      addressList1.push(address.replace("#index#", i));
    }

    address = tpl[type];
    works["fileFormat"] = "png";
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    //渲染多张
    var addressList2 = [];
    for (let i = 0; i < works.multiple; i++) {
      addressList2.push(address.replace("#index#", i));
    }

    console.log([...addressList1, ...addressList2]);
    return [...addressList1, ...addressList2];
  } else {
    let address = tpl[type];
    if (!address)
      throw new Error(`PxerPrint.getMultiple: unknown type "${type}"`);

    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }

    //渲染多张
    var addressList = [];
    for (let i = 0; i < works.multiple; i++) {
      addressList.push(address.replace("#index#", i));
    }

    return addressList;
  }
};
/**
 * 拼装单副原始地址
 * @param {PxerWorks} works - 作品
 * @param {string=max} [type] - 拼装类型 [max|600p]
 * @return {Array}
 * */
PxerPrinter.getWorks = function (works, taskOption, type = "max") {
  const tpl = {
    max: "https://#domain#/img-original/img/#date#/#id#_p0.#fileFormat#",
    "600p":
      "https://#domain#/c/600x600/img-master/img/#date#/#id#_p0_master1200.jpg",
  };
  if (taskOption.isQuick) {
    const addressList = [];
    var addressTemplate = tpl[type];
    if (!addressTemplate)
      throw new Error(`PxerPrint.getWorks: unknown type "${type}"`);

    works["fileFormat"] = "jpg";
    let address = addressTemplate;
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    addressList.push(address);

    works["fileFormat"] = "png";
    address = addressTemplate;
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    addressList.push(address);

    return addressList;
  } else {
    let address = tpl[type];
    if (!address) throw new Error(`PxerPrint.getWorks: unknown type "${type}"`);

    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }

    return [address];
  }
};
/**
 * 智能拼装原始地址，对上述的简单封装
 * @param {PxerWorks} [works]
 * @param {...arguments} [argn]
 * @return {Array}
 * */
PxerPrinter.countAddress = function (works, taskOption, argn) {
  switch (true) {
    case works.type === "ugoira":
      return PxerPrinter.getUgoira(...arguments);
    case works.isMultiple:
      return PxerPrinter.getMultiple(...arguments);
    default:
      return PxerPrinter.getWorks(...arguments);
  }
};
