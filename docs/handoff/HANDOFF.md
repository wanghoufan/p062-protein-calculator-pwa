# HANDOFF｜P062 蛋白质计算器 PWA

## §0 常驻指针
- 架构及仓库：`docs/architecture-facts.md`；风险：`docs/risks.md`；踩坑：`agent.md`；旧工程测试：`/Volumes/项目归档/027-ing-蛋白质计算器/docs/qa/BUGS-PWA.md`。

## §1 当前进展
- 历史已整合推送；线上为 SW 修复版（代码提交 `de8af59`，文档提交 `7e4b17e`，两者产物相同），打开与计算正常。
- 2026-10-27 晚：定位线上 SW 因预缓存 `.nojekyll`（Pages 404）安装失败、离线不可用；已修复部署。复验通过：桌面 Chrome、Note 11T Pro+、Note 11 5G 均 SW activated、断网重开正常、鸡胸肉 50g = 10g、清空回 0。

## §2 下一步
- iPhone 验收（需用户真机）：Safari 打开 https://wanghoufan.github.io/p062-protein-calculator-pwa/ ，验证加载、计算（鸡胸肉 50g = 10g）、分享→添加到主屏幕、从主屏幕断网重开；结果回填 §3 与验收记录。
- 朋友网络/弱网抽测该线上地址；首次发布签收。

## §3 未完成
- iPhone 相关未验证；首次发布未签收；朋友网络/弱网未确认。

## §4 红线
- 保留项目原 `.git`，不得删除或重新 git init；不新建仓库、不推送到其他仓库名，不覆盖远端历史，不改安卓工程。
- 不跑全量回归；不擅自修改手机系统设置；用户要求暂不处理延迟保存小问题。

## §5 三日流水
- 2026-10-27：代码迁入 P062；公开仓库改名为 `p062-protein-calculator-pwa`；构建及线上基础计算通过；Note 11T Pro+ 网络故障复测不可现。
- 2026-10-27 晚：修复 SW 预缓存 `.nojekyll` 404（`de8af59`）并部署；桌面 Chrome、Note 11T Pro+、Note 11 5G 复验 SW/离线/计算通过。

## §6 接续提示词
先读 §0–§5 和各指针，保留原 `.git` 与远端历史，不跑全量回归。SW 离线修复已部署复验；待办是 iPhone 与朋友网络真机验证、首次发布签收。
