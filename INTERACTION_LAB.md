# Interaction Lab

本地入口：http://127.0.0.1:3000/interaction-lab。实验页未加入正式导航，尚未应用到首页、About、Projects Directory 或项目页。

## 操作

- A：在三张图周围移动鼠标，比较距离引起的吸引、倾斜及文字和线条响应；移出区域观察回弹。
- B：划过图像表面，观察局部清晰层、柔软边界和移动时的拖尾。键盘聚焦链接会显示完整清晰图。
- C：正常纵向滚动，快滚后停下。外框与文字恢复对齐，图像内部的裁切保留不同深度。
- 顶部 A/B/C 可直接跳转。每区 Intensity 范围为 0–1.5，默认 1；0 提供静态对照，Reset 恢复 1。

三组均复用同一组中性 SVG、三个项目、信息量、字体、网格和配色。项目链接正常打开已有项目页。

## 技术与文件

三个实验均为 React + DOM/CSS，使用原生 requestAnimationFrame 弹簧计算。仅复用现有 Framer Motion 的 useReducedMotion；没有新增依赖，也没有 WebGL。

| 实验 | 主文件 | 实现 |
| --- | --- | --- |
| A | components/interaction-lab/magnetic-gallery.tsx | 距离衰减场、位移、透视倾斜、媒体视差、编号/标题/线条反馈 |
| B | components/interaction-lab/reveal-gallery.tsx | 低对比模糊底图 + 原图层；三个软椭圆渐变组合成不规则边界，速度影响拖尾和细微位移 |
| C | components/interaction-lab/spatial-gallery.tsx | 被动 scroll 输入、速度弹簧、不同深度位移/倾斜/拉伸、进度裁切；CSS sticky 提供体验空间 |

入口为 app/interaction-lab/page.tsx，编排为 components/interaction-lab/interaction-lab.tsx，样式为 app/interaction-lab/lab.css。data.ts 与 project-unit.tsx 管理共同内容；use-lab-frame.ts 管理弹簧与生命周期。占位图位于 public/media/interaction-lab/。

## 调参

集中修改 components/interaction-lab/settings.ts。先用页面强度滑杆比较，再改默认参数。

| 实验 | 参数及默认值 | 影响 |
| --- | --- | --- |
| A | radius 520；travel 32；tilt 5.5；imageParallax 7 | 作用距离、最大位移 px、倾斜 deg、图像内部视差 px |
| B | radiusRatio .30；minRadius 75；maxRadius 165 | 显现半径相对图宽比例及范围 px |
| B | fluidity .34；displacement 3 | 边缘拖尾强度、清晰图层最大位移 px |
| B | restingBlur 3；restingContrast .48 | 默认模糊 px 与对比度；增加模糊/降低对比可加强显现反差 |
| C | travel 44；tilt 3；skew 2.2；stretch .065 | 深度位移 px、透视 deg、倾斜 deg、速度引起的拉伸 |
| C | crop 20；velocityScale 1700 | 内部裁切 px；velocityScale 越低，滚动响应越强 |
| 全部 | stiffness / damping | 刚度越高响应越快；阻尼越高回弹越克制。A 260/25，B 360/30，C 230/24 |

## 性能与整合

A 预计最轻，也最容易接入正式 Projects Directory：主要更新三个单元的 transform，位置独立，通常无需改滚动结构。C 同样以 transform 为主，但需结合正式目录的滚动区间和 sticky 布局。B 的重复媒体层、滤镜和动态遮罩可能产生较多绘制成本，需要在真实大图和目标设备上测量；目前没有做 GPU/FPS 基准测试。

指针事件只更新 refs，逐帧写 CSS 变量，无逐指针 React state 更新。弹簧稳定后停止帧循环；区域远离视口、页面隐藏及卸载时停止并清理 observer、listener 和 animation frame。窗口 scroll listener 为 passive，没有 wheel 拦截、scroll snap 或手动横向滚动。

触屏保留原图和单击链接，简化 A/B 指针效果；窄屏 C 改为普通纵向布局。prefers-reduced-motion 使用静态清晰图并关闭动画循环。布局已检查 1440、390、320px；本轮没有修改系统级 reduced-motion 设置。

## 验证

隔离生产构建命令：PowerShell 中设置 `$env:PORTFOLIO_BUILD_DIR='.next-lab-check'`，运行 `npm run build`，完成后移除该环境变量。避免覆盖正在运行的开发服务器的 .next。临时构建目录可在关闭测试服务器后清理。

本轮已完成生产构建、TypeScript、既有内容检查，以及首页、About、项目目录、9 个项目页、简历 PDF 和 404 的 HTTP 回归。浏览器检查包括 A 距离响应、B 指针遮罩及键盘清晰图、C 裁切与停止后基线对齐、强度归零/重置、中英文、手机宽度，以及回到首页后的原导航和滚动样式恢复。原有 90 个文件通过 SHA256 对照保持不变。

如开发服务器关闭，在此目录运行 `npm run dev`，再打开上述本地入口。
