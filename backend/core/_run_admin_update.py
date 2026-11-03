import pathlib

admin = pathlib.Path('D:/TINY TURNNER/backend/core/admin.py')
addition = pathlib.Path('D:/TINY TURNNER/backend/core/_admin_addition.txt').read_text(encoding='utf-8')
src = admin.read_text(encoding='utf-8')
admin.write_text(src + '\n' + addition, encoding='utf-8')
print('admin.py updated; lines:', len(admin.read_text(encoding='utf-8').splitlines()))