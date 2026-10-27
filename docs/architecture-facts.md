# 架构与构建事实

- P062 路径为本项目根目录；原有 `.git` 和初始化提交 `d9b5d7c` 已保留。Web 文件从原 027 项目中的 `protein-calculator-web` 复制，原目录尚保留；安卓工程未改动。
- 网页使用 Expo 57 + React Native Web，本地保存数据，`npm ci`、`npm run typecheck`、`npm run build`；静态产物在 `dist/`，GitHub Actions 配置位于 `.github/workflows/pages.yml`。
- 原公开仓库已按用户指令改名为 https://github.com/wanghoufan/p062-protein-calculator-pwa ，保持 Public；线上地址 https://wanghoufan.github.io/p062-protein-calculator-pwa/ 。
- 本地 `origin` 已指向改名仓库；远端 `origin/main` 目前为 `9d41499`。本地初始化提交 `d9b5d7c` 与远端历史无共同祖先，网页代码及本轮交接文件目前是本地未提交变更；尚未合并或推送。
- 2026-10-27：新目录依赖安装、类型检查和构建通过；本机网页点击鸡胸肉 50g 得到 10g，清空成功。新线上地址 HTTP 200，浏览器同一计算成功，演示数量已清空。
