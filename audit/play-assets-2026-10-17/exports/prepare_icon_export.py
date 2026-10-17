from pathlib import Path
from PIL import Image, ImageCms
from io import BytesIO
import hashlib, struct, zlib, json, subprocess
root=Path('android-brand-identity-candidate'); src=root/'public/pwa-icon-512.png'; master=root/'public/brand/pick-for-us-icon-master.jpg'
data=src.read_bytes(); md=master.read_bytes(); sha=lambda b:hashlib.sha256(b).hexdigest()
assert sha(data)=='4d71389437dc6339ed31ae413e189f5d8a6abe966296333f58c9f1facd202be9'
assert sha(md)=='12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5'
icc=Image.open(master).info['icc_profile']; desc=ImageCms.getProfileDescription(ImageCms.ImageCmsProfile(BytesIO(icc))).strip(); assert desc=='sRGB'
def chunks_of(data):
 p=8; chunks=[]
 assert data[:8]==b'\x89PNG\r\n\x1a\n'
 while p<len(data):
  n=struct.unpack('>I',data[p:p+4])[0]; raw=data[p:p+n+12]; typ=raw[4:8]; payload=raw[8:-4]
  assert zlib.crc32(typ+payload)&0xffffffff==struct.unpack('>I',raw[-4:])[0]
  chunks.append((typ,raw)); p+=n+12
 assert p==len(data)
 return chunks
chunks=chunks_of(data); assert not any(t in [b'iCCP',b'sRGB'] for t,r in chunks)
payload=b'sRGB\x00\x00'+zlib.compress(icc); chunk=struct.pack('>I',len(payload))+b'iCCP'+payload+struct.pack('>I',zlib.crc32(b'iCCP'+payload)&0xffffffff)
out=data[:8]+chunks[0][1]+chunk+b''.join(r for t,r in chunks[1:]); outchunks=chunks_of(out)
assert [(t,r) for t,r in outchunks if t!=b'iCCP']==chunks
pth=Path('play-store-assets-2026-10-17/exports/pick-for-us-play-icon-512-srgb.png'); pth.write_bytes(out)
a=Image.open(src).convert('RGBA'); b=Image.open(pth)
assert b.mode=='RGBA' and b.size==(512,512) and b.tobytes()==a.tobytes()
assert b.info['icc_profile']==icc and b.getchannel('A').getextrema()==(255,255)
assert len(out)<=1024*1024 and src.read_bytes()==data and master.read_bytes()==md
receipt={'source_head':subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True).strip(),'source_icon_sha256':sha(data),'master_sha256':sha(md),'output_sha256':sha(out),'output_bytes':len(out),'dimensions':[512,512],'mode':'RGBA','bits_per_channel':8,'icc_description':desc,'icc_bytes':len(icc),'icc_sha256':sha(icc),'pixel_equality':True,'all_chunk_crcs_valid':True,'original_chunks_preserved':True,'original_files_unchanged':True,'publication_status':'HOLD: final selection and contextual attribution review; no upload authorized','method':'Insert exact master sRGB ICC in new PNG iCCP chunk, retain all original chunks verbatim; no pixel changes','preliminary_attempt':'Stopped before output write on invalid raw-byte sRGB assertion; corrected to parsed ICC description.'}
Path('play-store-assets-2026-10-17/exports/ICON-EXPORT-RECEIPT.json').write_text(json.dumps(receipt,indent=2)+'\n'); print(json.dumps(receipt,indent=2))
