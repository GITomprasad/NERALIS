import json
import sys

# Reconfigure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

nb_path = r"c:\Users\SUBHAM\Desktop\Codes\PROJECTS\NERALIS\backend\notebooks\train_landslide_model.ipynb"
with open(nb_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

for idx, cell in enumerate(nb['cells']):
    source = "".join(cell.get('source', []))
    outputs = cell.get('outputs', [])
    output_text = ""
    for out in outputs:
        if out.get('output_type') == 'stream':
            output_text += "".join(out.get('text', []))
        elif out.get('output_type') in ['execute_result', 'display_data']:
            data = out.get('data', {})
            if 'text/plain' in data:
                output_text += "".join(data['text/plain'])
                
    # Search for the presence of the confusion matrix numbers 50, 4, 3, 13
    if "true_negative" in output_text or ("50" in output_text and "13" in output_text and "4" in output_text and "3" in output_text):
        print(f"Match found in Cell {idx} outputs!")
        print("Outputs:")
        print(output_text)
