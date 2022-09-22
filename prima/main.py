import srsly 
import shutil 
import arel 
import time
import subprocess
import typer
from rich import print
from pathlib import Path 
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from lunr import lunr
import markdown

typer_app = typer.Typer()
app = FastAPI()
app.mount("/assets", StaticFiles(directory="prima/assets"), name="assets")
templates = Jinja2Templates(directory="prima/templates")

# Update browser on change https://gist.github.com/vrslev/6d0602bfa939a01844f645c608afb85a
hot_reload = arel.HotReload(paths=[arel.Path("prima")])
app.add_websocket_route("/hot-reload", route=hot_reload, name="hot-reload")
app.add_event_handler("startup", hot_reload.startup)
app.add_event_handler("shutdown", hot_reload.shutdown)
templates.env.globals["DEBUG"] = True
templates.env.globals["hot_reload"] = hot_reload

def read_md(path:str):
    md = markdown.Markdown(extensions = ['meta'])
    md.convert(Path(path).read_text())
    metadata = md.Meta
    content = ""
    for line in md.lines:
        content += markdown.markdown(line) + '<br>'

    return content, metadata

def load_lessons():
    lessons = []
    for lesson in Path('prima/content/lessons/').iterdir():
        content, metadata = read_md(str(lesson))
        lessons.append(dict(content=content, metadata=metadata, slug=lesson.stem))
    return lessons
lessons = load_lessons()


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

def gather_documents(lessons:list[dict]) -> list[dict]:
    documents = []
    for lesson in lessons:
        doc = {}
        doc['content'] = lesson['content']
        for key, value in lesson['metadata'].items():
            lesson['metadata'][key] = value[0]
        doc = doc | lesson['metadata']
        documents.append(doc)
    return documents

pages = [page.stem for page in (Path.cwd() / 'prima'/ 'content' / 'pages').iterdir()]

@app.get("/")
def root(request:Request):
    content, metadata = read_md('prima/content/pages/index.md')
    context = {"request": request, "content":content, "metadata":metadata, "lessons":lessons}
    return templates.TemplateResponse("index.html", context)


@app.get('/{lesson}.html')
def lesson(request:Request, lesson:str):
    if lesson in pages:
        content, metadata = read_md(f'prima/content/pages/{lesson}.md')
        context = {"request": request, "content":content, "metadata":metadata, "lessons":lessons}
        return templates.TemplateResponse("index.html", context)
    else:    
        content, metadata = read_md(f'prima/content/lessons/{lesson}.md')
        context = {"request": request, "content":content, "metadata":metadata, "lessons":lessons}
        return templates.TemplateResponse("lesson.html", context)


@typer_app.command()
def build():
    start_time = time.time()
    templates.env.globals["DEBUG"] = False
    site_path = Path.cwd() / 'site'
    if not site_path.exists():
        site_path.mkdir(parents=True, exist_ok=True)
    
    # Search index 
    documents = gather_documents(lessons)
    fields = list(documents[0].keys())
    idx = lunr(ref="slug", fields=fields, documents=documents)
    serialized_idx = idx.serialize()
    index_path = Path.cwd() / 'prima'/ 'assets' / 'lunr' 
    if not index_path.exists():
        index_path.mkdir(parents=True, exist_ok=True)
    srsly.write_json(index_path / 'search.json', serialized_idx)
    
    # move all assets 
    site_static = (site_path / 'assets')
    if not site_static.exists():
        site_static.mkdir(parents=True, exist_ok=True)
    shutil.copytree(str((Path.cwd() / 'prima'/ 'assets')), str(site_static), dirs_exist_ok=True) 
    
    #Admin page
    admin_path = (site_path / 'admin')
    if not admin_path.exists():
        admin_path.mkdir(parents=True, exist_ok=True)
    shutil.copytree(str((Path.cwd() / 'prima'/ 'admin')), str(admin_path), dirs_exist_ok=True) 
    
    #Pages
    for page in pages:
        if page == 'index':
            html = root(Request)
            (site_path / 'index.html').write_bytes(html.body)
        else:
            html = lesson(Request, page)
            (site_path / (page +'.html')).write_bytes(html.body)

    #Lesson pages
    for lesson_ in lessons:
        page = lesson(Request, lesson_["slug"])
        (site_path / (lesson_["slug"] +'.html')).write_bytes(page.body)

    

    print(f"[bold green] 🐢 Site built sucessfully in {time.time() - start_time} seconds[/bold green]")

@typer_app.command()
def serve():
    subprocess.run(["uvicorn", "prima.main:app", "--reload"])


@typer_app.command()
def deploy():
    print(f"[bold red]feature in progress[/bold red]")


if __name__ == "__main__":
    typer.run(build)