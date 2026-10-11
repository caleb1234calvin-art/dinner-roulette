import datetime, hashlib, json, pathlib, stat, sys, zipfile, zlib

base = pathlib.Path(__file__).resolve().parent
artifact = json.loads(pathlib.Path(sys.argv[1]).read_text())
archive = pathlib.Path(sys.argv[2])
assert artifact['workflow_run']['head_sha'] == 'f92870632b71def18d7642596dc9dd3357675f76'
assert artifact['workflow_run']['id'] == 38107379751
assert not artifact['expired']
digest = hashlib.file_digest(archive.open('rb'), 'sha256').hexdigest()
assert archive.stat().st_size == artifact['size_in_bytes']
assert artifact['digest'] == 'sha256:' + digest
target = base / 'extracted' / str(artifact['id'])
target.mkdir(parents=True, exist_ok=True)
members, seen = [], set()
with zipfile.ZipFile(archive) as z:
    for info in z.infolist():
        path = pathlib.PurePosixPath(info.filename)
        assert info.filename not in seen and not path.is_absolute()
        assert '..' not in path.parts and '\\' not in info.filename and ':' not in info.filename
        assert not stat.S_ISLNK(info.external_attr >> 16)
        seen.add(info.filename)
        dest = target / path
        assert dest.resolve().is_relative_to(target.resolve())
        if info.is_dir():
            dest.mkdir(parents=True, exist_ok=True)
            members.append({'path': info.filename, 'directory': True, 'size': 0})
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        h, size, crc = hashlib.sha256(), 0, 0
        with z.open(info) as inp, dest.open('wb') as out:
            for block in iter(lambda: inp.read(4 * 1024 * 1024), b''):
                h.update(block); size += len(block); crc = zlib.crc32(block, crc); out.write(block)
        assert size == info.file_size and crc == info.CRC
        members.append({'path': info.filename, 'size': size, 'compressedSize': info.compress_size,
                        'crc32': f'{crc:08x}', 'sha256': h.hexdigest()})
report = {'verdict': 'PASS', 'verifiedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'artifact': artifact, 'archive': str(archive), 'archiveBytes': archive.stat().st_size,
          'archiveSHA256': digest, 'safeUniquePaths': True, 'memberCount': len(members),
          'allMemberSizeCRCAndSHA256': 'PASS', 'extracted': str(target), 'members': members}
receipt = base / f"integrity-{artifact['id']}.json"
receipt.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({k:report[k] for k in ['verdict','archiveBytes','archiveSHA256','memberCount','extracted']}))
