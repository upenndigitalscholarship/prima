import srsly 
import shutil 
import time
import subprocess
import typer
from rich import print
from pathlib import Path 
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import utils
from lunr import lunr

typer_app = typer.Typer()
app = FastAPI()
app.mount("/assets", StaticFiles(directory="prima/assets"), name="assets")
templates = Jinja2Templates(directory="prima/templates")

def load_lessons():
    lessons = []
    for lesson in Path('prima/content/lessons/').iterdir():
        content, metadata = utils.read_md(str(lesson))
        lessons.append(dict(content=content, metadata=metadata, href=lesson.stem))
    return lessons
lessons = load_lessons()

pages = [page.stem for page in (Path.cwd() / 'prima'/ 'content' / 'pages').iterdir()]

@app.get("/")
def root(request:Request):
    content, metadata = utils.read_md('prima/content/pages/index.md')
    context = {"request": request, "content":content, "metadata":metadata, "lessons":lessons}
    return templates.TemplateResponse("index.html", context)


@app.get('/{lesson}.html')
def lesson(request:Request, lesson:str):
    if lesson in pages:
        content, metadata = utils.read_md(f'prima/content/pages/{lesson}.md')
        context = {"request": request, "content":content, "metadata":metadata, "lessons":lessons}
        return templates.TemplateResponse("index.html", context)
    else:    
        content, metadata = utils.read_md(f'prima/content/lessons/{lesson}.md')
        context = {"request": request, "content":content, "metadata":metadata, "lessons":lessons}
        return templates.TemplateResponse("lesson.html", context)


@typer_app.command()
def build():
    start_time = time.time()
    site_path = Path.cwd() / 'site'
    if not site_path.exists():
        site_path.mkdir(parents=True, exist_ok=True)
    
    # Search index 
    documents = utils.gather_documents(lessons)
    fields = list(documents[0].keys())
    idx = lunr(ref="filename", fields=fields, documents=documents)
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
        page = lesson(Request, lesson_["href"])
        (site_path / (lesson_["href"] +'.html')).write_bytes(page.body)

    

    print(f"[bold green] 🐢 Site built sucessfully in {time.time() - start_time} seconds[/bold green]")

@typer_app.command()
def serve():
    subprocess.run(["uvicorn", "prima.main:app", "--reload"])


@typer_app.command()
def deploy():
    print(f"[bold red]feature in progress[/bold red]")


if __name__ == "__main__":
    typer.run(build)