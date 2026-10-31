#!/usr/bin/env python3
"""Assemble the single-file MDR app: mdr/src/ -> mdr/index.html (+ sw.js).
Styles come from the Kāshi app (../src/core.css) plus mdr/src/app.css; cards from mdr/src/cards/*.txt."""
import glob,hashlib,json,os
R=os.path.dirname(os.path.abspath(__file__))
rd=lambda p:open(p,encoding='utf-8').read()
cards='\n'.join(rd(f).strip() for f in sorted(glob.glob(os.path.join(R,'src/cards/*.txt'))))
n=0
for i,l in enumerate(cards.split('\n')):
    if not l.strip() or l.startswith('#'):continue
    assert l.count('|')==2,f'bad card line {i+1}: {l[:60]}'
    n+=1
js='\n'.join(rd(f) for f in sorted(glob.glob(os.path.join(R,'src/js/*.js')))).replace('__CARDS__',json.dumps(cards,ensure_ascii=False))
css=rd(os.path.join(R,'../src/core.css'))+'\n'+rd(os.path.join(R,'src/app.css'))
html=rd(os.path.join(R,'src/shell.html')).replace('__CSS__',css).replace('__JS__',js)
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write(html)
ver=hashlib.sha1(html.encode('utf-8')).hexdigest()[:10]
open(os.path.join(R,'sw.js'),'w',encoding='utf-8').write(rd(os.path.join(R,'src/sw.js')).replace('__VER__',ver))
print('built',n,'cards,',len(html)//1024,'KB')
