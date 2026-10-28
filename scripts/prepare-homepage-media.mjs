import fs from 'node:fs';
import path from 'node:path';
import { registerHooks } from 'node:module';
import sharp from 'sharp';
registerHooks({ resolve(s,c,next) { return s.startsWith('@/') ? next(new URL('../'+s.slice(2)+'.ts',import.meta.url).href,c) : next(s,c); } });
const { projects } = await import('../data/projects.ts');
const titles = JSON.parse(fs.readFileSync('app/ticket-prototype/title-artworks.json','utf8'));
const directory = 'public/media/homepage-previews';
fs.mkdirSync(directory,{recursive:true});
const webTitles = {}, previews = {};
for (const project of projects) {
  const n=project.number, art=titles[n];
  const titlePath=`/media/homepage-previews/${n}-title.webp`;
  const titleInfo=await sharp('public'+art.src).resize({width:960,height:960,fit:'inside',withoutEnlargement:true}).webp({quality:95,alphaQuality:100,effort:6,smartSubsample:true}).toFile('public'+titlePath);
  webTitles[n]={src:titlePath,width:titleInfo.width,height:titleInfo.height};
  const ticketImage=`/media/homepage-previews/${n}-preview.webp`;
  await sharp('public'+project.hero.image).resize({width:960,withoutEnlargement:true}).webp({quality:88,effort:6}).toFile('public'+ticketImage);
  let stampImage=ticketImage;
  if(project.thumbnail.image!==project.hero.image) {
    stampImage=`/media/homepage-previews/${n}-stamp.webp`;
    await sharp('public'+project.thumbnail.image).resize({width:480,withoutEnlargement:true}).webp({quality:88,effort:6}).toFile('public'+stampImage);
  }
  previews[n]={ticketImage,stampImage};
}
await sharp('public/media/about/portrait.jpg').resize({width:384,withoutEnlargement:true}).webp({quality:90,effort:6}).toFile(directory+'/portrait.webp');
fs.writeFileSync('app/ticket-prototype/title-artworks-web.json',JSON.stringify(webTitles,null,2)+'\n');
fs.writeFileSync('data/homepage-previews.json',JSON.stringify(previews,null,2)+'\n');
console.log('Prepared 9 high-quality web title images, shared preview images and a small portrait. Originals preserved.');
