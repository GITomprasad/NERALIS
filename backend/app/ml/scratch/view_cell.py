import sys

# Reconfigure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

with open(r"c:\Users\SUBHAM\Desktop\Codes\PROJECTS\NERALIS\backend\app\ml\scratch\notebook_structure.txt", "r", encoding="utf-8") as f:
    content = f.read()

cells = content.split("--- Cell ")

target_cells = []
for arg in sys.argv[1:]:
    if "-" in arg:
        start, end = map(int, arg.split("-"))
        target_cells.extend(range(start, end + 1))
    else:
        target_cells.append(int(arg))

for idx in target_cells:
    for cell in cells:
        if cell.startswith(f"{idx} "):
            print(f"\n==================== CELL {idx} ====================")
            print(cell)
            print("====================================================")
