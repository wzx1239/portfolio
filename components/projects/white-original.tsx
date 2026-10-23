'use client';
import { OriginalCompositions } from './refuge-original';
import garbage from '@/data/garbage-original.json';
import workspace from '@/data/workspace-original.json';
import './white-original.css';

export function WhiteOriginal({number}:{number:string}) {
  return <OriginalCompositions pages={number==='05'?garbage:workspace} />;
}
