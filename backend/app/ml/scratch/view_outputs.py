import sys
import json

# Reconfigure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

nb_path = r"c:\Users\SUBHAM\Desktop\Codes\PROJECTS\NERALIS\backend\notebooks\train_landslide_model.ipynb"
with open(nb_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

target_cells = []
for arg in sys.argv[1:]:
    if "-" in arg:
        start, end = map(int, arg.split("-"))
        target_cells.extend(range(start, end + 1))
    else:
        target_cells.append(int(arg))

for idx in target_cells:
    cell = nb['cells'][idx]
    print(f"\n==================== CELL {idx} OUTPUTS ====================")
    source = "".join(cell.get('source', []))
    print("CODE:")
    print(source)
    print("\nOUTPUTS:")
    outputs = cell.get('outputs', [])
    for out in outputs:
        if out.get('output_type') == 'stream':
            print("".join(out.get('text', [])))
        elif out.get('output_type') in ['execute_result', 'display_data']:
            data = out.get('data', {})
            if 'text/plain' in data:
                print("".join(data['text/plain']))
    print("==========================================================")
