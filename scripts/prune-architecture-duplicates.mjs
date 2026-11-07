import fs from 'node:fs';
import path from 'node:path';
export function pruneArchitectureDuplicates(output, root) {
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/architecture-image-performance.json'),'utf8'));
 const excluded=Object.keys(manifest).map(src=>src.replace(/\.[^.]+$/,'-web.webp'));
 const referenced=new Set(Object.values(manifest).flatMap(v=>[v.src,...v.variants.map(a=>a.src)]));
 for(const src of excluded)if(referenced.has(src))throw Error(`Cannot exclude referenced image: ${src}`);
 // Check the complete exported page/runtime payload before removing any file.
 function inspect(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);if(entry.isDirectory())inspect(file);
  else if(/\.(html|js|json|txt|css)$/.test(file)){const text=fs.readFileSync(file,'utf8');for(const src of excluded)if(text.includes(src))throw Error(`Excluded image referenced by ${file}: ${src}`);}
 }}inspect(output);
 for(const src of referenced)if(!fs.existsSync(path.join(output,src)))throw Error(`Missing architecture image: ${src}`);
 let count=0,bytes=0;
 for(const src of excluded){const file=path.join(output,src);if(fs.existsSync(file)){bytes+=fs.statSync(file).size;fs.unlinkSync(file);count++;}}
 console.log(`Architecture export: excluded ${count} unused duplicates (${bytes} bytes); ${referenced.size} image paths verified.`);
 return {count,bytes};
}
