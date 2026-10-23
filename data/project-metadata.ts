import { l, type Localized, type MetadataField } from '@/lib/types';

export const overviewLabels = {
  discipline: l('Discipline', '领域'),
  role: l('Role', '职责'),
  teamTime: l('Team / Time', '团队 / 时间'),
};
export type OverviewInformation = Partial<Record<'discipline'|'role'|'team'|'time'|'teamTime', Localized>>;
const aliases:Record<string,keyof OverviewInformation>={discipline:'discipline',field:'discipline',role:'role',team:'team',time:'time',date:'time','team / time':'teamTime'};
const supplied=(value?:Localized)=>Boolean(value && [value.en,value.zh].every(text=>text.trim() && !/^(?:TBD|待补充|待定)$/i.test(text.trim())));

/** All Overview fields are optional; software belongs exclusively to the marquee. */
export function normalizeProjectMetadata(fields:MetadataField[], defaultDiscipline?:Localized):MetadataField[] {
  const info:OverviewInformation={};
  for(const field of fields){
    const key=aliases[field.label.en.trim().toLowerCase()];
    if(key && supplied(field.value))info[key]=field.value;
  }
  return projectMetadata({...info,discipline:info.discipline??defaultDiscipline});
}
export function projectMetadata(info:OverviewInformation):MetadataField[] {
  const parts=[info.team,info.time].filter((value):value is Localized=>supplied(value));
  const teamTime=supplied(info.teamTime)?info.teamTime:parts.length?l(parts.map(v=>v.en).join(' · '),parts.map(v=>v.zh).join(' · ')):undefined;
  return (Object.keys(overviewLabels) as (keyof typeof overviewLabels)[]).flatMap(key=>{
    const value=key==='teamTime'?teamTime:info[key];
    return supplied(value)?[{label:overviewLabels[key],value:value!}]:[];
  });
}
