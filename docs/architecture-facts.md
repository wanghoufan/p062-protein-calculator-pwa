# 架构与构建事实

- P062 路径为本项目根目录；原有 `.git` 和初始化提交 `d9b5d7c` 已保留。Web 文件从原 027 项目中的 `protein-calculator-web` 复制，原目录尚保留；安卓工程未改动。
- 网页使用 Expo 57 + React Native Web，本地保存数据，`npm ci`、`npm run typecheck`、`npm run build`；静态产物在 `dist/`，GitHub Actions 配置位于 `.github/workflows/pages.yml`。
- 原公开仓库已按用户指令改名为 https://github.com/wanghoufan/p062-protein-calculator-pwa ，保持 Public；线上地址 https://wanghoufan.github.io/p062-protein-calculator-pwa/ 。
- Git：本地初始化历史与远端网页历史已整合（`9d41499` 是 `fe82c73` 的祖先），`main` 与 `origin/main` 一致，GitHub Actions 最近一次部署对应 `fe82c73`。
- `scripts/prepare-web.cjs` 生成 `manifest.webmanifest`、`service-worker.js` 和 `.nojekyll`，并把 `index.html` 改为 `zh-CN`、注入 SW 注册。GitHub Pages 不提供点文件（`.nojekyll` 实测 404），SW 预缓存清单必须剔除点文件，否则 `cache.addAll` 失败、离线能力整体失效；2026-10-27 线上实测踩中，已由 `de8af59` 修复并部署复验。
- 2026-10-27：新目录依赖安装、类型检查和构建通过；本机网页点击鸡胸肉 50g 得到 10g，清空成功。新线上地址 HTTP 200，浏览器同一计算成功，演示数量已清空。
- 2026-10-27 晚：Note 11T Pro+ 的线上“网络故障”不可复现，默认浏览器与 Chrome 均能加载并计算。修复 SW 预缓存后复验：桌面 Chrome（全新上下文）SW `activated` + `controller`、断网重开正常；Note 11T Pro+ 与 Note 11 5G 均 SW `activated`、断网重开正常、鸡胸肉 50g = 10g、清空回 0。Note 11 5G 首次 SW 安装约 201 秒（43 项预缓存约 6.75MB）。
- 手机调试可用 `adb reverse tcp:<端口> tcp:<端口>` + Chrome DevTools 协议（Chrome/Chromium 的抽象 socket 均为 `localabstract:chrome_devtools_remote`）验证 SW、`controller` 与断网行为；`localhost` 属于安全上下文，可注册 SW。
