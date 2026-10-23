# Production Reveal Field

本地入口：`http://127.0.0.1:3000/projects`。同一个目录组件也用于首页的 Projects 区域。首页个人 showreel 继续使用中性占位；About 和项目详情模板没有重新设计。`/interaction-lab` 继续保留，未加入主导航。

## 文件与调参

- `components/projects/project-thumbnail.tsx`：正式缩略图、图像层、延迟加载和播放视频、项目跳转。
- `components/projects/use-reveal-field.ts`：指针距离、局部显现、持续停留激活、轻微滚动位移、触屏视口激活和生命周期。
- `components/projects/reveal-field.css`：软遮罩、不等宽目录比例、编号/标题/箭头/索引线响应及静态降级。
- `components/projects/reveal-settings.ts`：集中参数。
- `data/projects.ts`：项目名称、双语文案、图片、hero 和预览视频路径。

| 参数 | 默认 | 作用 |
| --- | --- | --- |
| radiusRatio / minRadius / maxRadius | .30 / 72 / 210 | 初始显现半径比例和 px 限制 |
| softness | .66 | 边缘软硬，越大越柔和；建议 0–1 |
| distortionStrength | 1.8 | 清晰图层微位移上限 px；0 关闭 |
| restingSaturation | .48 | 静态饱和度，1 接近原图 |
| restingContrast / restingBrightness | .94 / .97 | 静态对比度与亮度 |
| transitionSpeed | 85 | 指针和状态响应时间 ms；越低越快 |
| hoverActivationDelay | 380 | 局部发现阶段的停留时间 ms |
| activationDuration | 650 | 显现范围扩展到完整图的时间 ms |
| videoTransitionSpeed | 360 | 视频就绪后的淡入时间 ms |
| scrollTravel | 7 | 次要滚动位移 px；0 关闭 |

先靠近图像，局部显现和细小信息响应立即开始；持续停留后，范围扩大、色彩恢复，再将封面过渡到可用的视频。键盘聚焦直接呈现清晰图像。原生链接和现有 View Transitions 保留，普通点击、快捷键点击及减弱动态设置均可正常导航。

## Project 01 的真实媒体

来源为用户指定的 `C:/A-future？/Portfolio/porjects/The perfect city/herovideo.mp4`，用于 The Perfect City 的项目 hero。原文件保持不变。源文件为 1920×1080、30 fps、约 9.64 秒的 HEVC 视频，包含音轨。

生成的网站资源位于 `public/media/projects/01-perfect-city/`：

- `hero.mp4`：1920×1080 H.264，移除音轨，约 6.22 MB，用于项目 hero。
- `preview.mp4`：960×540、24 fps H.264，移除音轨，约 1.36 MB，用于目录预览。
- `hero-poster.jpg`：从同段视频首帧提取，用作 hero 封面和目录静态图，约 162 KB。

其他项目的图片仍在 `public/media/projects/NN-slug/`。各项目 seed 的 `thumbnail.image` 指定目录图，`hero.image` 指定 hero poster，`hero.video` 指定 hero 视频，`previewVideo` 指定可选目录预览。无需修改组件。保留 `alt.en`、`alt.zh`；加入真实图后不要设置 `placeholder: true`。

替换 Project 01 时，将新的图/视频放入上述目录，并修改 `data/projects.ts` 中 `perfect-city` 的三个媒体字段。可沿用现有文件名；浏览器缓存未刷新时强制刷新。建议 H.264 MP4、`yuv420p`、faststart、无音轨；预览保持较小分辨率和体积，hero 与首页个人 showreel 分开配置。

## 性能取舍与降级

使用 DOM/CSS masking，无 WebGL 或新增运行依赖。保留两份同源图片层，浏览器复用同一图片请求；动态图层遮罩会增加绘制成本，因此控制位移和半径，不采用全屏 shader。默认图像仍可辨认且保留色彩。

指针事件写入 refs，按需 requestAnimationFrame 更新 CSS 变量；只有视频激活状态跨阈值时更新 React state。离开视口或标签页隐藏时取消动画并暂停预览，卸载时清理 observer、listener 和 frame。视频在实际激活后才挂载，`preload="none"`，muted、playsInline；加载或自动播放失败时保留封面。视频解码可持续，但遮罩稳定后停止 JS 帧循环。

触屏设备根据图像在中央视口的突出程度逐渐恢复原色并激活可用预览，点击一次直接进入项目。窄屏保持首个大图、随后两个小图的布局。减弱动态模式保留原色静态图，关闭指针帧循环和目录视频，正常链接保持可用。

本轮验证：生产构建和类型检查；9 项目、3 分类、01–09 与双语内容检查；所有既有路由、PDF 与 404 回归；浏览器真实预览播放、离开暂停、空闲循环停止、项目点击后的 hero 播放；窄屏与语言切换检查。未做 GPU/FPS 基准测试，也未更改系统级减弱动态或触屏设置。
