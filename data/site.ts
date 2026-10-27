import { l, type MediaAsset } from '@/lib/types';

export const site = {
  name: 'Wang Zixiao',
  displayName: l('Wang Zixiao', '王紫霄'),
  birthDate: '2002.04.16',
  email: 'zixiao.wang0416@outlook.com',
  phone: '+86 150-3378-9009',
  phoneHref: '+8615033789009',
  showreel: { image: '/media/home/showreel-placeholder.svg', video: undefined as string | undefined, variant: 0, placeholder: true, alt: l('Showreel placeholder', '作品混剪占位') } satisfies MediaAsset,
  portrait: { image: '/media/about/portrait.jpg', variant: 10, alt: l('Portrait of Wang Zixiao', '王紫霄的个人照片') } satisfies MediaAsset,
  resume: '/resume/ZixiaoWangResume.pdf',
  languages: [l('English — IELTS 7.0, working proficiency', '英语 — 雅思 7.0，可作为工作语言')],
  education: [
    { level: l('01 Undergraduate', '01 本科'), schools: [
      { name: l("Xi'an Jiaotong-Liverpool University", '西交利物浦大学'), dates: '2020–2022' },
      { name: l('University of Liverpool', '利物浦大学'), dates: '2022–2024' },
    ], major: l('Architecture', '建筑') },
    { level: l('02 Postgraduate', '02 研究生'), schools: [
      { name: l('University College London', '伦敦大学学院'), dates: '2025.09–2026.09' },
    ], school: l('The Bartlett School of Architecture', '巴特莱特建筑学院'), major: l('Cinematic and Videogame Architecture', '电影和电子游戏建筑') },
  ],
  toolGroups: [
    { label: l('Game / 3D / Tech', '游戏 / 3D / 技术'), items: ['Unreal Engine', 'Rhino', 'Blender'] },
    { label: l('AI / Product / Collaboration', 'AI / 产品 / 协作'), items: ['Codex', 'Claude Code', 'Figma', 'GitHub'] },
    { label: l('Visual / 2D', '视觉 / 2D'), items: ['Adobe Creative Cloud'] },
  ],
};

export const copy = {
  about: l('About', '关于'), projects: l('Projects', '项目'), home: l('Home', '首页'),
  skip: l('Skip to content', '跳转至内容'), skipReel: l('View portfolio', '查看作品集'),
  reel: l('Showreel', '作品混剪'), reelType: l('Showreel / TBD', '作品混剪 / TBD'),
  showreelTitle: l('Showreel', '作品混剪'), showreelPending: l('TBD', 'TBD'), mediaPending: l('Media / TBD', '媒体 / TBD'),
  reelNote: l('Showreel', '作品混剪'), reelSub: l('TBD', 'TBD'),
  reelEnd: l('Continue', '继续'), pause: l('Pause motion', '暂停动态'), play: l('Play motion', '播放动态'),
  previewEyebrow: l('01 / About', '01 / 关于'), draft: l('TBD', 'TBD'),
  meet: l('View profile', '查看个人信息'), selected: l('Project index', '项目索引'),
  directoryNote: l('Project index', '项目索引'), directoryDescription: l('01–09', '01–09'),
  view: l('View project', '查看项目'), placeholder: l('Media / TBD', '媒体 / TBD'),
  footerLine: l('Contact', '联系'), contact: l('Contact', '联系'), contactPending: l('Contact', '联系'),
  profile: l('Personal information', '个人信息'), profileTag: l('About', '关于'),
  name: l('Name', '姓名'), birthDate: l('Date of birth', '出生日期'), languages: l('Languages', '语言'),
  skills: l('Skills', '技能'), major: l('Major', '专业'),
  education: l('Education', '教育背景'),
  resume: l('Download Resume PDF', '下载简历 PDF'), resumeNote: l('Resume / TBD', '简历 / TBD'),
  originalPdf: l('Download original PDF', '下载原版 PDF'),
  resumeDetail: l('Download the full version for work and project experience.', '工作经历和项目经历可下载完整版。'),
  portrait: l('TBD', 'TBD'), email: l('Email', '邮箱'), phone: l('Phone', '电话'), pending: l('TBD', 'TBD'),
  overview: l('Project overview', '项目概述'), projectNote: l('Content / TBD', '内容 / TBD'),
  back: l('All projects', '全部项目'), next: l('Next project', '下一个项目'), deepDive: l('Deep Dive', '深入探索'),
  technical: l('Documentation / TBD', '技术文档 / TBD'),
  notFound: l('Page not found', '页面不存在'), returnHome: l('Return home', '返回首页'),
  unavailable: l('The page could not be loaded.', '页面暂时无法加载。'), retry: l('Try again', '重试'),
  loading: l('Loading', '加载中'),
};
