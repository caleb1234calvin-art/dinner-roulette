from pathlib import Path
import datetime
import hashlib
import json
import zipfile

root = Path('/workspace/scratch/45a2c39f129e')
out = root / 'deliverables/Pick-For-Us-Astra-Validation-Receipts.zip'
if out.exists():
    raise SystemExit('Preserve an existing archive; choose an explicit new revision.')
paths = set(root.glob('*.log'))
paths.update(root.glob('Candidate*.json'))
paths.update((root / 'browser-diagnosis').glob('*.log'))
paths.update((root / 'browser-diagnosis').glob('candidate1-build-proof.zip'))
paths.update(p for p in (root / 'runtime-independent-review').rglob('*') if p.is_file())
paths.update((root / 'release-prep').glob('*Inventory.json'))
paths.update((root / 'deliverables').glob('*Manifest.json'))
paths.update((root / 'deliverables').glob('*.sha256'))
paths.update((root / 'deliverables').glob('*Android*-lint.zip'))
paths.update((root / 'release-prep').glob('*Identity*.json'))
paths.update((root / 'release-prep').glob('*Hosted*.json'))
entries = []
for p in sorted(paths):
    if p.is_symlink():
        raise SystemExit(f'Unexpected symlink: {p}')
    data = p.read_bytes()
    entries.append({'path': str(p.relative_to(root)), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
def file_digest(path):
    h = hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda: source.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()

external_archives = [{'path': str(p.relative_to(root)), 'bytes': p.stat().st_size, 'sha256': file_digest(p)}
                     for p in sorted((root / 'deliverables').glob('*.zip')) if p != out]
manifest = {'created_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'scope': 'All run-local validation logs, independent runtime review, failed-attempt receipts, release inventories and final identity receipts. Large original browser/Android and raw research ZIPs are separate deliverables, not duplicated here.',
            'external_archives': external_archives,
            'files': entries}
with zipfile.ZipFile(out, 'x', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for e in entries:
        data = (root / e['path']).read_bytes()
        assert hashlib.sha256(data).hexdigest() == e['sha256']
        z.writestr(e['path'], data)
    z.writestr('VALIDATION-MANIFEST.json', json.dumps(manifest, indent=2) + '\n')
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    for e in entries:
        assert hashlib.sha256(z.read(e['path'])).hexdigest() == e['sha256']
        assert hashlib.sha256((root / e['path']).read_bytes()).hexdigest() == e['sha256']
receipt = {'path': str(out), 'sha256': hashlib.sha256(out.read_bytes()).hexdigest(),
           'bytes': out.stat().st_size, 'source_files': len(entries), 'zip_members': len(entries) + 1,
           'validation': 'CRC and every source/archive SHA256 PASS'}
(root / 'release-prep/Validation-Archive-Receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt))
