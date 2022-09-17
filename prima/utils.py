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