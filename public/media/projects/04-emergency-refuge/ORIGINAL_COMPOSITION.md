# 04 original composition / 2026-10-20

This route supersedes the previous editorial crop layout. Source: reference/architecture/04_Emergency_Refuge.pdf, pages 2–8 in original order. The cover Hero and Project Overview retain their existing treatment.

- Drawing-only page layers: original/page-2.webp through original/page-8.webp. Original source-page aspect ratio, framing and diagram positions retained.
- data/refuge-original.json: 617 positioned HTML text runs with EN / 中文. Extractable English strings, source coordinates and affine orientation are checked against the source extraction.
- Readable embedded raster paragraphs and energy labels are transcribed without adding new narrative. Fine filmstrip subtitles, tiny chart/map labels, image-baked display lettering and the final render's embedded game annotation remain original pixels where reliable removal/transcription would damage or guess source content.
- Original spellings and values such as asolution, Facilitices, Enrgy and 12a.m. are retained in English. No unrequested correction to the PDF.
- The previous 04 crop assets remain available but are no longer used by its detail narrative. 05 and 06 are unchanged.
- Extraction scripts: work/refuge-native-source.py, work/build-refuge-native.py; translation dictionary: work/refuge-translations.txt.

Validation: 7 original-order compositions; no horizontal document overflow at desktop or mobile; mobile per-composition zoom allows horizontal inspection; 05 retains its prior layout/theme. Content check and TypeScript passed. Isolated production build passed.
