#!/usr/bin/env python3
"""Assemble the single-file app: src/ -> kashi/index.html"""
import json,os,shutil,hashlib
R=os.path.dirname(os.path.abspath(__file__))
rd=lambda p:open(os.path.join(R,p),encoding='utf-8').read()
js=[rd('src/core.js'),rd('src/speech.js'),rd('src/tutorvoice.js'),rd('src/azuretts.js')]
for code in sorted(os.listdir(os.path.join(R,'src/lang'))):
    d=f'src/lang/{code}'
    if not os.path.exists(os.path.join(R,d,'pack.js')):continue
    pd=os.path.join(R,d,'parts')
    if os.path.isdir(pd): # assemble vocab from per-level parts
        out=[]
        for lv in ['A1','A2','B1','B2','C1','Phrases']:
            fs=sorted(f for f in os.listdir(pd) if f.startswith(lv) and f.endswith('.txt'))
            if not fs:continue
            out.append('#'+lv)
            for f in fs:out.extend(l for l in open(os.path.join(pd,f),encoding='utf-8').read().split('\n') if l.strip())
        open(os.path.join(R,d,'vocab.txt'),'w',encoding='utf-8').write('\n'.join(out)+'\n')
    vocab=rd(f'{d}/vocab.txt')
    pk=rd(f'{d}/pack.js').replace('__VOCAB__',json.dumps(vocab,ensure_ascii=False))
    if '__MORPH__' in pk:pk=pk.replace('__MORPH__',rd(f'{d}/morph.js'))
    if '__TOPICS__' in pk:pk=pk.replace('__TOPICS__',rd(f'{d}/topics.js').strip() if os.path.exists(os.path.join(R,d,'topics.js')) else '[]')
    js.append(pk)
    if os.path.exists(os.path.join(R,d,'speech.js')):js.append(rd(f'{d}/speech.js'))
js.append('boot();')
html=rd('src/shell.html').replace('__CSS__',rd('src/core.css')).replace('__JS__','\n'.join(js))
os.makedirs(os.path.join(R,'kashi'),exist_ok=True)
open(os.path.join(R,'kashi/index.html'),'w',encoding='utf-8').write(html)
ver=hashlib.sha1(html.encode('utf-8')).hexdigest()[:10]
open(os.path.join(R,'kashi/sw.js'),'w',encoding='utf-8').write(rd('src/sw.js').replace('__VER__',ver))
out='/mnt/user-data/outputs/kashi.html'
if os.path.isdir(os.path.dirname(out)):shutil.copy(os.path.join(R,'kashi/index.html'),out)
print('built',len(html)//1024,'KB')
