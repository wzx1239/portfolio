import { l, type Category, type MediaAsset, type Project } from '@/lib/types';
import { architectureProjects } from '@/data/architecture';
import { normalizeProjectMetadata, projectMetadata, type OverviewInformation } from '@/data/project-metadata';

export const categories: { id: Category; name: ReturnType<typeof l>; directoryName: ReturnType<typeof l>; note: ReturnType<typeof l>; range: string }[] = [
  { id: 'game', name: l('Game', '游戏'), directoryName: l('Video Game', '游戏'), note: l('Projects', '项目'), range: '01—03' },
  { id: 'architecture', name: l('Architecture', '建筑'), directoryName: l('Architecture', '建筑'), note: l('Projects', '项目'), range: '04—06' },
  { id: 'video', name: l('Video', '影像'), directoryName: l('Film', '影像'), note: l('Projects', '项目'), range: '07—09' },
];

type ProjectSeed = Pick<Project, 'slug' | 'title' | 'category' | 'subtitle' | 'summary' | 'tags'> & OverviewInformation & {
  software?: string[];
  originalPdf?: Project['originalPdf'];
  metadata?: Project['metadata'];
  thumbnail?: MediaAsset;
  hero?: MediaAsset;
  previewVideo?: string;
  sections?: Project['sections'];
  deepDives?: Project['deepDives'];
  architecture?: Project['architecture'];
};

// Optional fields on each record override the V1 defaults assembled below.
const seeds: ProjectSeed[] = [
  { slug: 'perfect-city', title: l('The Perfect City', '完美之城'), category: 'game' as const,
    subtitle: l('Interactive architecture · Unreal Engine', '交互建筑 · 虚幻引擎'),
    summary: l('The Perfect City is a third-person narrative adventure set millions of years ahead in Diaspar, Earth’s last city, where a central system controls everything. Players use Trace to expose surveillance and erased histories. Inspired by the science fiction novel The City and the Stars, the project explores technology, curiosity, privacy and freedom.', '《完美之城》是一款第三人称叙事冒险游戏，故事发生在数百万年后的迪阿斯巴——地球最后的城市，一切都由中央系统掌控。玩家使用 Trace 揭露监控与被抹去的历史。项目受科幻小说《城市与群星》启发，探讨科技、好奇心、隐私与自由。'),
    software: ['Unreal Engine', 'Blender', 'Rhino', 'Adobe Substance 3D Designer', 'Adobe Premiere Pro'], tags: [],
    discipline: l('Third-person Narrative Adventure Game', '第三人称叙事冒险游戏'),
    role: l('Game Designer · Programmer', '策划 · 程序员'),
    team: l('3-person Project', '3人项目'), time: l('2026.03–2026.09', '2026.03–2026.09'),
    thumbnail: { image: '/media/projects/01-perfect-city/hero-poster.jpg', alt: l('The Perfect City — environment from the project hero footage', '完美之城——项目 hero 影像中的环境'), variant: 1 },
    hero: { image: '/media/projects/01-perfect-city/hero-poster.jpg', video: '/media/projects/01-perfect-city/hero.mp4', alt: l('The Perfect City — project hero footage', '完美之城——项目 hero 影像'), variant: 1 },
    previewVideo: '/media/projects/01-perfect-city/preview.mp4',
    sections: [
      { id: 'experience', kind: 'media', title: l('Artefact', 'Artefact'), youtube: 'VUbjO20mz9M', media: { image: '/media/projects/01-perfect-city/artefact-poster.jpg', alt: l('The Perfect City — Artefact', '完美之城——Artefact'), variant: 1 } },
      { id: 'core-mechanic-trace', kind: 'media', title: l('CORE MECHANIC — TRACE', '核心机制——TRACE'), steps: [
        { id: 'trace-reveal', number: '01', selector: l('REVEAL', '揭示'), thumbnail: '/media/projects/01-perfect-city/trace-reveal-thumb.jpg', branch: l('TRACE → PERCEIVE', 'TRACE → 感知'), title: l('REVEAL — PERCEIVE HIDDEN INFORMATION', '揭示——感知隐藏信息'), body: l("Pressing R sends a scan wave out from the player. As it passes through the environment, traces erased by the System are revealed: hidden objects gradually appear, footprints left by previous residents light up, and concealed surveillance devices become visible. Acquired through the story, Trace becomes the player’s primary way of exploring Diaspar.", "按下 R，角色周围会扩散出一圈扫描波，系统抹去的痕迹在波纹经过时显现出来：隐藏的物件逐渐浮现，前人留下的足迹被点亮，监控装置也无处藏身。这项能力随剧情获得，是玩家在 Diaspar 中探索的主要方式。"), video: '/media/projects/01-perfect-city/trace-reveal.mp4', width: 1728, height: 1080, implementation: [
          { heading: l('VISUAL & DETECTION SYNC', '视觉与检测同步'), body: l('A single timeline drives both the scanner’s scale and its material opacity. The visible wave and the detection range are always the same shape, so what players see is exactly what gets scanned.', '扫描器的缩放和材质透明度由同一条时间轴驱动。可见的扫描波与实际检测范围始终一致，玩家看到的范围就是被扫描的范围。') },
          { heading: l('DECOUPLED RESPONSES', '响应解耦'), body: l('The scanner only detects and sends a message through a shared interface; each object decides how it reacts. New scannable objects can be added without touching the scanner.', '扫描器只负责检测，并通过统一的接口发送消息，每个物件自行决定如何响应。新增可扫描物件时，无需修改扫描器。') },
          { heading: l('SEPARATED PUZZLE STATE', '谜题状态分离'), body: l('During a scan, the scanner only records which puzzle nodes it touched, then reports once to the Puzzle Manager. Puzzle logic stays in one place and the scanner remains reusable.', '扫描过程中，扫描器只记录触碰到了哪些谜题节点，结束后统一上报给谜题管理器。谜题逻辑集中在一处，扫描器也因此可以复用。') },
          { heading: l('CLEAN LIFECYCLE', '完整的生命周期'), body: l('Each scan is a temporary actor. When the timeline finishes, it disables collision before destroying itself, so no leftover volume can trigger further events.', '每次扫描都是一个临时 Actor。时间轴播放结束后，它先关闭碰撞再销毁自身，避免残留的碰撞体继续触发事件。') },
        ] },
        { id: 'trace-manipulate', number: '02', selector: l('MANIPULATE', '操控'), thumbnail: '/media/projects/01-perfect-city/trace-manipulate-thumb.jpg', branch: l('TRACE → AFFECT', 'TRACE → 作用'), title: l('MANIPULATE — AFFECT THE ENVIRONMENT', '操控——改变环境'), body: l("When Trace reaches a button, it plays an audio cue and moves its linked platforms, opening new routes through the environment. Players need to consider the order and number of scans: some platforms reach their destination in a single move, while others require multiple scans to advance step by step.", "Trace 扫到按钮后，按钮会发出提示音，与它关联的平台随即移动，为玩家开出新的路线。玩家需要思考按钮的顺序和次数。有些平台一次到位，有些需要多次扫描，一步步移动到终点。"), video: '/media/projects/01-perfect-city/trace-manipulate.mp4', width: 1728, height: 1080, implementation: [
          { heading: l('CONFIGURABLE LINKS', '可配置的关联'), body: l('Each button holds a list of target platforms and notifies each one when scanned. Links are set per instance in the level editor, so new puzzles need no new logic.', '每个按钮持有一组目标平台，被扫描时依次通知它们移动。按钮与平台的对应关系在关卡编辑器中直接设置，搭建新谜题时无需修改任何逻辑。') },
          { heading: l('DATA-DRIVEN PATHS', '通过数据预设路径'), body: l('Platforms either move once by a fixed offset or step through an array of offsets, advancing one step per scan and stopping at the end. One blueprint covers different puzzle rhythms through parameters alone.', '平台支持两种模式：单次位移，或按偏移数组逐步移动，每次扫描前进一步，到达数组末尾后自动停止。同一个蓝图通过参数即可组合出不同的谜题节奏。') },
          { heading: l('CONSTANT SPEED', '恒定速度'), body: l('Movement interpolates between start and target on a timeline, with play rate calculated from distance and speed. Platforms move at a consistent pace regardless of distance.', '移动由时间轴在起点与终点之间插值完成，播放速率根据移动距离和设定速度实时计算。无论距离长短，平台都以一致的速度移动，体感稳定可预期。') },
          { heading: l('SAFE STATE', '状态保护'), body: l('A moving platform ignores new commands, one-shot platforms remember they have moved, and the step index only advances on arrival. Resetting simply reverses the same timeline.', '平台在移动中会拒绝新的指令，单次平台记录是否已移动，步数只在移动完成后才递增。复位时直接倒放同一条时间轴，不需要额外编写返回逻辑。') },
        ] },
        { id: 'trace-echo', number: '03', selector: l('ECHO', 'Echo'), thumbnail: '/media/projects/01-perfect-city/trace-echo-thumb.jpg', branch: l('TRACE → PERCEIVE / EXPAND', 'TRACE → 感知 / 扩展'), title: l('ECHO — EXPAND PERCEPTION', 'Echo——扩展感知'), body: l("Echo works like echolocation. In rooms without light, the R key switches from scanning to sound, and the view shifts to outlines only. Players can press the key or simply speak or clap into their microphone; every sound becomes a spreading ring that briefly outlines the space. Radios in the room also pulse on their own rhythm, and some can be switched off up close.", "Echo 的工作方式类似回声定位。进入没有光的房间后，原本用于扫描的 R 键会转为发声，画面切换为只显示轮廓的视角。玩家既可以按键发声，也可以对着麦克风真实地说话或拍手，每一次声响都会化作一圈扩散的声波，短暂勾勒出周围的空间。房间里的收音机也会有节奏地发出声波，部分可以靠近后关闭。"), video: '/media/projects/01-perfect-city/trace-echo.mp4', width: 1728, height: 1080, implementation: [
          { heading: l("CONTEXT-AWARE INPUT", "由空间决定的输入"), body: l("Trace and Echo share the same input, so the player does not need to learn a new control. Entering a dark room switches the character to Echo mode and replaces the camera’s post-process with an outline-only view; leaving restores Trace and the normal view.", "Trace 和 Echo 共用同一个按键，玩家无需学习新操作。进入黑暗房间时，房间将角色切换为 Echo 模式，并替换相机的后期处理，使画面只显示轮廓；离开时恢复 Trace 与正常画面。") },
          { heading: l("VOICE AS INPUT", "真实声音作为输入"), body: l("An Audio Capture component monitors the microphone. When the audio envelope crosses a threshold, a sound wave spawns at the player’s position. A short cooldown prevents continuous sound from generating excessive waves.", "角色通过音频捕获组件监听麦克风。当音量包络超过阈值时，在玩家位置生成一道声波；每次触发后设置短暂冷却，避免持续声音生成过多声波。") },
          { heading: l("SHARED SOUND WAVE", "统一的声波"), body: l("Key presses, the player’s voice, and environmental radios all spawn the same sound wave Actor with different colour and range parameters. Each wave creates its own material instance, allowing multiple waves to overlap without interfering with one another.", "按键、玩家真实声音和环境中的收音机都生成同一个声波 Actor，仅在生成时传入不同的颜色和范围参数。每道声波在构造时创建独立的材质实例，因此多道声波可以同时存在而互不干扰。") },
        ] },
      ] },
      { id: 'narrative-systems', kind: 'media', title: l('NARRATIVE SYSTEMS', '叙事系统'), steps: [
        { id: 'narrative-dialogue', number: '01', selector: l('DIALOGUE', '对话'), thumbnail: '/media/projects/01-perfect-city/npc-thumb.jpg', title: l('DIALOGUE — UNCOVER THE WORLD', '对话——了解世界'), body: l('Players interact with both the System and NPCs to uncover the world, progress the narrative and obtain key information.', '玩家通过与 System 和 NPC 对话了解世界观、推进叙事，并获得探索所需的关键信息。'), video: '/media/projects/01-perfect-city/npc.mp4', width: 1728, height: 1080 },
        { id: 'narrative-inventory', number: '02', selector: l('INVENTORY', '背包'), thumbnail: '/media/projects/01-perfect-city/inventory-thumb.jpg', title: l('INVENTORY — COLLECT THE STORY', '背包——收集故事'), body: l('Players collect and inspect objects throughout Diaspar. These items provide additional narrative context and reveal details that are not communicated through dialogue alone.', '玩家可以在 Diaspar 中拾取并检视物品。这些物品补充额外的叙事信息，让玩家发现对话之外的故事细节。'), video: '/media/projects/01-perfect-city/inventory.mp4', width: 1728, height: 1080 },
      ] },
      { id: 'technical', kind: 'technical', eyebrow: l('03 / Implementation', '03 / 技术实现'), title: l('Implementation', '技术实现'), body: l('TBD', 'TBD') },
      { id: 'selected-work', kind: 'media', title: l('Full Walkthrough', '完整过程'), youtube: '3dZkd4wj6pA', media: { image: '/media/projects/01-perfect-city/walkthrough-poster.jpg', alt: l('The Perfect City — full walkthrough', '完美之城——完整过程'), variant: 1 } },
    ] },
  { slug: 'vr', title: l('Align', 'Align'), category: 'game' as const,
    subtitle: l('Virtual reality · Details to come', '虚拟现实 · 内容待补充'), summary: l('TBD', 'TBD'), tags: [],
    discipline: l('VR Game', 'VR 游戏'), role: l('Game Designer · Programmer', '策划 · 程序员'),
    team: l('6-person Project', '6人项目'), time: l('2026.02–2026.03', '2026.02–2026.03'),
    thumbnail: { image: '/media/projects/02-vr/hero-poster.jpg', alt: l('Align — frame from the supplied hero', 'Align——提供的 Hero 视频画面'), variant: 2 },
    hero: { image: '/media/projects/02-vr/hero-poster.jpg', video: '/media/projects/02-vr/hero.mp4', alt: l('Align — hero video', 'Align——Hero 视频'), variant: 2 },
    previewVideo: '/media/projects/02-vr/preview.mp4',
    sections: [{ id: 'selected-work', kind: 'media', title: l('Full walkthrough', '完整过程'), youtube: 'N-fd3z5WQHk', media: { image: '/media/projects/02-vr/walkthrough-poster.jpg', alt: l('Align — full walkthrough', 'Align——完整过程'), variant: 2 } }],
  },
  { slug: 'featherland', title: l('Featherland', 'Featherland'), category: 'game' as const,
    subtitle: l('2.5D Metroidvania', '2.5D 银河恶魔城'), summary: l('2.5D Metroidvania.', '2.5D 银河恶魔城。'), tags: [],
    discipline: l('2.5D Metroidvania Game', '2.5D 类银河恶魔城游戏'), role: l('Programmer', '程序员'),
    team: l('5-person Project', '5人项目'), time: l('2025.12–2026.01', '2025.12–2026.01'),
    thumbnail: { image: '/media/projects/03-featherland/hero-poster.jpg', alt: l('Featherland — frame from the supplied hero', 'Featherland——提供的 Hero 视频画面'), variant: 3 },
    hero: { image: '/media/projects/03-featherland/hero-poster.jpg', video: '/media/projects/03-featherland/hero.mp4', alt: l('Featherland — hero video', 'Featherland——Hero 视频'), variant: 3 },
    previewVideo: '/media/projects/03-featherland/preview.mp4',
    sections: [{ id: 'selected-work', kind: 'media', title: l('Full walkthrough', '完整过程'), youtube: '0zdtmL9Ovvc', media: { image: '/media/projects/03-featherland/walkthrough-poster.jpg', alt: l('Featherland — full walkthrough', 'Featherland——完整过程'), variant: 3 } }],
  },
  { slug: 'emergency-refuge', category: 'architecture' as const, tags: [], ...architectureProjects['emergency-refuge'] },
  { slug: 'architecture-05', category: 'architecture' as const, tags: [], ...architectureProjects['architecture-05'] },
  { slug: 'architecture-06', category: 'architecture' as const, tags: [], ...architectureProjects['architecture-06'] },
  { slug: 'video-07', title: l('Video Project', '影像项目'), category: 'video' as const, subtitle: l('Moving image · To be selected', '动态影像 · 待选项目'), summary: l('TBD', 'TBD'), tags: [],
    software: ['Photoshop', 'Blender', 'Premiere Pro', 'After Effects'],
    thumbnail: { image: '/media/projects/07-video-07/hero-poster.jpg', alt: l('Film 07 — frame from the supplied hero', 'Film 07——提供的 Hero 视频画面'), variant: 7 },
    hero: { image: '/media/projects/07-video-07/hero-poster-v2.jpg', video: '/media/projects/07-video-07/hero-v2.mp4', alt: l('Film 07 — hero video', 'Film 07——Hero 视频'), variant: 7 },
    previewVideo: '/media/projects/07-video-07/preview-v2.mp4',
    sections: [{ id: 'selected-work', kind: 'media', title: l('Full film', '完整影片'), media: { image: '/media/projects/07-video-07/film-poster.jpg', video: '/media/projects/07-video-07/film07.mp4', controls: true, alt: l('Film 07 — full film', 'Film 07——完整影片'), variant: 7 } }],
  },
  { slug: 'video-08', title: l('Ironic Shaxi', 'Ironic Shaxi'), category: 'video' as const, subtitle: l('Moving image · To be selected', '动态影像 · 待选项目'), summary: l('TBD', 'TBD'), tags: [],
    metadata: projectMetadata({role:l('Team Leader','组长'),team:l('4-person Project','4人项目'),time:l('2023.07–2023.08','2023.07–2023.08')}),
    thumbnail: { image: '/media/projects/08-video-08/thumbnail.jpg', alt: l('Film 08 — supplied cover', 'Film 08——提供的封面'), variant: 8 },
    hero: { image: '/media/projects/08-video-08/hero-poster-v2.jpg', video: '/media/projects/08-video-08/hero-v2.mp4', alt: l('Film 08 — hero video', 'Film 08——Hero 视频'), variant: 8 },
    previewVideo: '/media/projects/08-video-08/preview-v2.mp4',
    sections: [{ id: 'selected-work', kind: 'media', title: l('Full film', '完整影片'), youtube: 'ku3XhjsHEHE', media: { image: '/media/projects/08-video-08/film-poster.jpg', alt: l('Film 08 — full film', 'Film 08——完整影片'), variant: 8 } }],
  },
  { slug: 'video-09', title: l('A Renting Story', 'A Renting Story'), category: 'video' as const, subtitle: l('Moving image · To be selected', '动态影像 · 待选项目'), summary: l('TBD', 'TBD'), tags: [],
    thumbnail: { image: '/media/projects/09-video-09/thumbnail.jpg', alt: l('Film 09 — supplied cover', 'Film 09——提供的封面'), variant: 9 },
    hero: { image: '/media/projects/09-video-09/hero-poster-v2.jpg', video: '/media/projects/09-video-09/hero-v2.mp4', alt: l('Film 09 — hero video', 'Film 09——Hero 视频'), variant: 9 },
    previewVideo: '/media/projects/09-video-09/preview-v2.mp4',
    sections: [{ id: 'selected-work', kind: 'media', title: l('Full film', '完整影片'), youtube: 'NTZ97Ch854g', media: { image: '/media/projects/09-video-09/film-poster.jpg', alt: l('Film 09 — full film', 'Film 09——完整影片'), variant: 9 } }],
  },
];

export const assetFolder = (number: string, slug: string) => `/media/projects/${number}-${slug}`;
const artwork = (number: string, slug: string, variant: number): MediaAsset => ({
  image: `${assetFolder(number, slug)}/thumbnail-placeholder.svg`,
  alt: l(`Neutral media placeholder for project ${number}; final work to come`, `项目 ${number} 的中性媒体占位，最终作品待补充`),
  variant, placeholder: true,
});

// Edit individual records here; page components do not need to change.
export const projects: Project[] = seeds.map((seed, i) => {
  const number = String(i + 1).padStart(2, '0');
  const media = artwork(number, seed.slug, i + 1);
  return {
    id: `project-${number}`, number, ...seed,
    metadata: seed.metadata ? normalizeProjectMetadata(seed.metadata,seed.discipline??categories.find(c=>c.id===seed.category)!.name) : projectMetadata({
      discipline: seed.discipline ?? categories.find(c => c.id === seed.category)!.name,
      role: seed.role, team: seed.team, time: seed.time,
    }),
    thumbnail: seed.thumbnail ?? media,
    hero: seed.hero ?? { ...media, image: `${assetFolder(number, seed.slug)}/hero-placeholder.svg` },
    // previewVideo: `${assetFolder(number, seed.slug)}/preview.mp4`,
    sections: seed.sections ?? [
      { id: 'selected-work', kind: 'media', eyebrow: l('01 / Selected work', '01 / 作品展示'), title: l('Selected work', '作品展示'), body: l('TBD', 'TBD'), media: { ...media, image: `${assetFolder(number, seed.slug)}/detail-placeholder.svg` } },
      ...(i === 0 ? [{ id: 'experience', kind: 'split' as const, eyebrow: l('02 / Experience', '02 / 体验'), title: l('Experience', '体验'), body: l('TBD', 'TBD'), media },
        { id: 'technical', kind: 'technical' as const, eyebrow: l('03 / Implementation', '03 / 技术实现'), title: l('Implementation', '技术实现'), body: l('TBD', 'TBD') }] : []),
    ],
    deepDives: seed.deepDives ?? [],
    nextProject: seeds[(i + 1) % seeds.length].slug,
  };
});

export const getProject = (slug: string) => projects.find(p => p.slug === slug);
