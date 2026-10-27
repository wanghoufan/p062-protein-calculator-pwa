# 蛋白质计算器｜网页版

独立于安卓工程的静态网页，复用安卓版本的界面、食物数据和计算逻辑。无账号和后端，输入内容保存在当前浏览器的本地存储。清除浏览器网站数据、换设备或浏览器存储被系统清理可能造成数据丢失；没有云端同步。

## 本地构建

需要 Node.js 24 和 npm：

```sh
npm ci
npm run typecheck
npm run build
python3 -m http.server 8765 --directory dist
```

在桌面浏览器打开 `http://127.0.0.1:8765/`。先确认端口未被其他服务占用；任务结束后停止临时服务。`dist/` 是完整的静态发布目录，资源使用相对路径，支持 GitHub Pages 项目子目录。不要直接用 `file://` 打开，浏览器存储和离线缓存需要 HTTP(S)。

首次联网打开并缓存完成后，可在该浏览器离线重开；更新应用也需要联网。浏览器可能清除缓存或本地数据，不能将离线缓存当作备份。iPhone 用户可在 Safari 的分享菜单选择“添加到主屏幕”，但 iPhone 实机兼容性仍需验证。

## 发布

`.github/workflows/pages.yml` 已准备 GitHub Actions 构建及 Pages 发布，需在仓库 Pages 设置中选择 GitHub Actions。该流程会公开静态网页，推送和首次发布需要单独授权与签收；在获得授权之前不要运行或启用生产发布。现有安卓仓库与应用不受该网页工程的构建过程影响。

安卓原项目：[蛋白质计算器](https://github.com/wanghoufan/p027-protein-calculator)。内容为营养估算，具体以实际食品包装为准。
