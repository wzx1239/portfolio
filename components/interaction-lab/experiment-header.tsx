'use client';
import { useLanguage } from '@/components/layout/language-provider';
import { experiments, labCopy } from './data';

type Props = { index: number; intensity: number; onIntensity: (value: number) => void };
export function ExperimentHeader({ index, intensity, onIntensity }: Props) {
  const { t } = useLanguage();
  const experiment = experiments[index];
  return <header className="lab-experiment-header">
    <div className="lab-experiment-heading"><span className="lab-letter" aria-hidden="true">{experiment.letter}</span><div><h2 id={`${experiment.id}-heading`}>{t(experiment.title)}</h2><p>{t(experiment.description)}</p></div></div>
    <div className="lab-controls"><label htmlFor={`${experiment.id}-intensity`}>{t(labCopy.intensity)}<output>{intensity.toFixed(2)}×</output></label><input id={`${experiment.id}-intensity`} type="range" min="0" max="1.5" step="0.05" value={intensity} onChange={event => onIntensity(Number(event.target.value))} aria-label={`${experiment.letter} / ${t(labCopy.intensity)}`}/><button onClick={() => onIntensity(1)}>{t(labCopy.reset)}</button></div>
  </header>;
}
