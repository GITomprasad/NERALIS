import sys

with open(r"c:\Users\SUBHAM\Desktop\Codes\PROJECTS\NERALIS\backend\app\ml\scratch\notebook_structure.txt", "r", encoding="utf-8") as f:
    content = f.read()

query = sys.argv[1] if len(sys.argv) > 1 else "severity"
case_sensitive = False

cells = content.split("--- Cell ")
print(f"Searching for '{query}' (case-sensitive: {case_sensitive})...")

matches = []
for cell in cells:
    if not cell.strip():
        continue
    header, *body = cell.split("\n", 1)
    body_text = body[0] if body else ""
    if case_sensitive:
        matched = query in body_text
    else:
        matched = query.lower() in body_text.lower()
    
    if matched:
        cell_id = header.split(" ")[0]
        matches.append((cell_id, header))

print(f"Found {len(matches)} matching cells:")
for cid, hdr in matches:
    print(f"Cell {cid} - {hdr}")
