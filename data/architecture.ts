import { l, type ArchitectureSection, type ArchitectureVisual, type Project } from '@/lib/types';
import a04 from '../public/media/projects/04-emergency-refuge/extraction.json' with { type: 'json' };
import a05 from '../public/media/projects/05-architecture-05/extraction.json' with { type: 'json' };
import a06 from '../public/media/projects/06-architecture-06/extraction.json' with { type: 'json' };

const manifests = { '04': a04, '05': a05, '06': a06 };
type Number = keyof typeof manifests;
const originalPdfs = {
  '04': { src:'/media/projects/04-emergency-refuge/original.pdf', filename:'Emergency Refuge.pdf' },
  '05': { src:'/media/projects/05-architecture-05/original.pdf', filename:'New “Garbage” City.pdf' },
  '06': { src:'/media/projects/06-architecture-06/original.pdf', filename:'The Ideal Workspace.pdf' },
};
function visual(n: Number, name: string, en: string, zh: string): ArchitectureVisual {
  const asset = manifests[n].find(a => a.name === name)!;
  return { src: asset.src, width: asset.width, height: asset.height, caption: l(en, zh) };
}

type ArchitectureRecord = Pick<Project, 'title'|'subtitle'|'summary'|'metadata'|'hero'|'thumbnail'|'software'|'originalPdf'|'architecture'|'sections'>;
function record(n: Number, title: ReturnType<typeof l>, subtitle: ReturnType<typeof l>, summary: ReturnType<typeof l>, metadata: Project['metadata'], sections: ArchitectureSection[], software: string[] = []): ArchitectureRecord {
  const hero = visual(n,'hero',`${title.en} — original cover image`,`${title.zh}——原始封面主图`);
  return { title, subtitle, summary, metadata, software, originalPdf:originalPdfs[n], sections: [], architecture: { sections, original:true }, hero: { image: hero.src, alt:hero.caption, variant: +n }, thumbnail: { image:hero.src, alt:hero.caption, variant:+n } };
}
export const architectureProjects: Record<string, ArchitectureRecord> = {
  'emergency-refuge': record('04',l('Emergency Refuge','应急庇护所'),l('Architectural and urban parametric modularization against hypothetical extreme context','面向假想极端环境的建筑与城市参数化模块化'),
    l('Inspired by the “Younger Dryas Impact Hypothesis”, this project combines Grasshopper parametric design techniques with plant system biomimicry to create a sustainable, highly continuous, and adaptable emergency shelter system in extreme cold environments, addressing the challenges of resource depletion and extreme climate in the future.\n\nIntended to utilize Grasshopper and procedural generation from game design to rethink new methods of organizing and utilizing architecture and urban systems.', '项目受“新仙女木撞击假说”启发，将 Grasshopper 参数化设计技术与植物系统仿生相结合，构建可持续、高度连续且可适应的极寒应急庇护系统，回应未来资源枯竭与极端气候的挑战。\n\n项目尝试利用 Grasshopper 与游戏设计中的程序化生成，重新思考建筑及城市系统的组织与利用方式。'),[
      {label:l('Date','时间'),value:l('August–November, 2024','2024 年 8–11 月')},
      {label:l('Context','环境'),value:l('Future extreme cold environments','未来极寒环境')},
      {label:l('Project type','项目类型'),value:l('Academic work · Individual work','学术项目 · 个人作品')},
      {label:l('Instructor','导师'),value:l('Yihan Shi','Yihan Shi')},
    ],[],['Grasshopper']),
  'architecture-05': record('05',l('New "Garbage" City','新“垃圾”城市'),l('Urban and architectural renovation','城市与建筑更新'),
    l('The Zabbaleen people, who rely on waste recycling for their livelihood, have an impressively efficient recycling system, but their living conditions require urgent improvement. This project focuses on a quarter of the village as a prototype, approaching the issue from both community system planning and individual building design. By organically integrating with the site, it proposes a new community model that balances both the work of recycling waste and the residents’ living needs.\n\nIntended to explore the relationship and collaboration between architecture and urban planning, while prioritizing a human-centered, localized design approach based on the specific context. It seeks to address social issues through architectural and planning languages.', '以垃圾回收为生的扎巴林人拥有高效的回收系统，但生活条件亟待改善。项目以村庄的四分之一区域为原型，从社区系统规划与单体建筑设计两个尺度切入，结合场地提出兼顾垃圾回收工作与居民生活需求的社区模式。\n\n项目探索建筑与城市规划的关系及协作，基于具体情境，优先采用以人为本的在地设计方法，尝试通过建筑与规划语言回应社会问题。'),[
      {label:l('Date','时间'),value:l('February–June, 2024','2024 年 2–6 月')},
      {label:l('Location','地点'),value:l('Mokattam village, Egypt','埃及穆卡塔姆村')},
      {label:l('Project type','项目类型'),value:l('Academic work · Two-person team','学术项目 · 两人团队')},
      {label:l('Role','角色'),value:l('Team leader','团队负责人')},
      {label:l('Contribution','个人贡献'),value:l('Concept 60% · Research 50% · Design 50% · Graphical representation 60%','概念 60% · 研究 50% · 设计 50% · 图形表达 60%')},
      {label:l('Instructor','导师'),value:l('Lifeng Lin','Lifeng Lin')},
    ],[]),
  'architecture-06': record('06',l('The Ideal Workspace','理想工作空间'),l('Studios for artists and small businesses','为艺术家与小型企业提供的工作室'),
    l('This project repurposes an abandoned building on the site, focusing on functional requirements and privacy divisions to create an artist office building that balances personal needs with public engagement. The design utilizes materials that respond to the site and natural environment, achieving a balance between energy efficiency and comfort. It is more than just a workspace—this building fosters collaboration, sparks creativity, and offers an immersive atmospheric experience for its users.\n\nIntended to harmonize function, form, material, and atmosphere, to create an architectural expression that resonates with both the environment and its users.', '项目改造场地上的废弃建筑，从功能需求与私密性分区出发，打造兼顾个人需求与公共参与的艺术家办公建筑。设计采用回应场地与自然环境的材料，平衡能源效率与舒适性，同时促进协作、激发创造力，并为使用者提供具有沉浸氛围的空间体验。\n\n项目旨在协调功能、形式、材料与氛围，形成与环境及使用者相呼应的建筑表达。'),[
      {label:l('Date','时间'),value:l('September–December, 2023','2023 年 9–12 月')},
      {label:l('Location','地点'),value:l('Liverpool, United Kingdom','英国利物浦')},
      {label:l('Project type','项目类型'),value:l('Academic work · Individual work','学术项目 · 个人作品')},
      {label:l('Instructor','导师'),value:l('Torsten Schmiedeknecht','Torsten Schmiedeknecht')},
    ],[]),
};
