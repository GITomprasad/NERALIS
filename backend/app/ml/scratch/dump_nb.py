import json

nb_path = r"c:\Users\SUBHAM\Desktop\Codes\PROJECTS\NERALIS\backend\notebooks\train_landslide_model.ipynb"
with open(nb_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

output_path = r"c:\Users\SUBHAM\Desktop\Codes\PROJECTS\NERALIS\backend\app\ml/scratch/notebook_structure.txt"
with open(output_path, "w", encoding="utf-8") as out:
    out.write(f"Number of cells: {len(nb['cells'])}\n")
    for idx, cell in enumerate(nb['cells']):
        cell_type = cell['cell_type']
        source = "".join(cell['source'])
        out.write(f"\n--- Cell {idx} ({cell_type}) ---\n")
        out.write(source)
        out.write("\n")

print(f"Dumped structure to {output_path}")
