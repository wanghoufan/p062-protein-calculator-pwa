# 项目踩坑

- 用户要求保留 P062 项目原 `.git`，禁止删除或重新初始化；远端仓库是旧 P027 网页仓库改名，两段历史已整合推送，后续提交仍须保留既有历史。
- GitHub Pages 不提供 `.nojekyll` 等点文件（实测 404）。SW 预缓存必须剔除点文件；`cache.addAll` 是全有或全无，任何 404 都会让 SW install 失败，且注册处的空 `catch` 会静默吞错。诊断用 Chrome DevTools 协议看 `Cache.addAll() failed ...` 与 `workerVersionUpdated.status`。
- 预缓存 43 项约 6.75MB，慢速线路首次安装可能耗时数分钟（Note 11 5G 实测约 201 秒）。测试离线要等 `activated`；在 `installing` 阶段断网会让 install 失败并丢弃注册。
- Web 记录饮食页的目标选择弹层曾被遮挡，已在网页副本修复并于旧目录两台 Android 设备复验。
- Android 真机测试使用设备锁 `status → resolve → adb -s`，用户要求测试结束后 release；不得修改系统网络设置。手机浏览器自动化可走 `adb reverse` + Chrome DevTools 协议，适配 `input`/`change` 后需 `blur` 才提交数量。
