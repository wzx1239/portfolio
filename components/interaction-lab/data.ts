import { projects } from '@/data/projects';
import { l } from '@/lib/types';

export const labProjects = [
  { number: '01', title: projects[0].title, subtitle: l('Interactive architecture · Unreal Engine', '交互建筑 · 虚幻引擎'), href: '/projects/perfect-city', image: '/media/interaction-lab/01-placeholder.svg' },
  { number: '02', title: projects[1].title, subtitle: l('Virtual reality', '虚拟现实'), href: '/projects/vr', image: '/media/interaction-lab/02-placeholder.svg' },
  { number: '03', title: l('Featherland', 'Featherland'), subtitle: l('2.5D Metroidvania', '2.5D 银河恶魔城'), href: '/projects/featherland', image: '/media/interaction-lab/03-placeholder.svg' },
];
export type LabProject = typeof labProjects[number];

export const labCopy = {
  title: l('Interaction Lab', '交互实验室'),
  intro: l('Three ways to browse. The same three projects.', '三种浏览方式，同一组三个项目。'),
  description: l('Move through the space around the images, move across their surface, then try scrolling. Compare the feeling before choosing a direction.', '先移动到图像附近，再划过图像表面，最后试着滚动。通过实际操作，比较三种交互的手感。'),
  draft: l('Development reference · A / B / C', '开发参考 · A / B / C'),
  back: l('Portfolio', '返回作品集'),
  intensity: l('Intensity', '强度'),
  reset: l('Reset', '重置'),
  pointer: l('Move near the images. Their response changes with distance.', '靠近图像移动鼠标，感受随距离变化的响应。'),
  reveal: l('Move across the surface. Look at the soft edge and the detail it reveals.', '划过图像表面，观察柔软边界与局部显现的细节。'),
  spatial: l('Scroll through this section. Move quickly, then stop and let it settle.', '滚动穿过这一区域，试着快速滚动，再停下观察回弹。'),
  same: l('Same projects / same images / same information', '相同项目 / 相同图像 / 相同信息'),
  open: l('Open project', '打开项目'),
  testImage: l('Neutral interaction test image', '中性交互测试图'),
  touch: l('On touch screens, pointer effects simplify. Vertical scrolling and single-tap links remain available.', '触屏上会简化指针效果，保留正常纵向滚动与单次点击打开项目。'),
  reduced: l('Reduced motion is active. All three studies are shown in their static state.', '已启用减弱动态效果，三个实验均以静态状态呈现。'),
  end: l('Development reference / Reveal Field selected', '开发参考 / 已选定显现域'),
};

export const experiments = [
  { id: 'magnetic', letter: 'A', title: l('Magnetic field', '磁力场'), description: labCopy.pointer },
  { id: 'reveal', letter: 'B', title: l('Reveal field', '显现域'), description: labCopy.reveal },
  { id: 'spatial', letter: 'C', title: l('Spatial scroll', '空间滚动'), description: labCopy.spatial },
] as const;
