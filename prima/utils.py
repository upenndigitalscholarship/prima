import re
import csv
import markdown
from pathlib import Path

def read_md(path:str):
    md = markdown.Markdown(extensions = ['meta'])
    md.convert(Path(path).read_text())
    metadata = md.Meta
    content = ""
    for line in md.lines:
        content += markdown.markdown(line) + '<br>'

    return content, metadata


def slugify(s:str):
  s = s.lower().strip()
  s = re.sub(r'[^\w\s-]', '', s)
  s = re.sub(r'[\s_-]+', '-', s)
  s = re.sub(r'^-+|-+$', '', s)
  return s


def read_db_csv():
    """A utility function to read the original materials database sheet and generate md records for each item"""
    with open('prima/content/materials_database.csv') as f:
        content = Path('prima/content')
        data = csv.DictReader(f)
        for row in data:
            entry = "---\n"
            entry += f"level: {row['Level']}\n"
            entry += f"week: {row['week ']}\n"
            entry += f"clip: {row['Clip']}\n"
            entry += f"grammar-content: {row['Grammar/Content']}\n"
            entry += f"prerequisites: {row['Pre-requisistes']}\n"
            entry += "---\n"
            entry += f"# {row['Clip']}"
            filename = slugify(row['Clip']) +'.md'
            (content / 'lessons' / filename).write_text(entry)