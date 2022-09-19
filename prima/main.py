import srsly 
import time
import subprocess
import typer
from rich import print
from pathlib import Path 
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from .utils import read_md

typer_app = typer.Typer()
app = FastAPI()
app.mount("/assets", StaticFiles(directory="prima/assets"), name="assets")
templates = Jinja2Templates(directory="prima/templates")

def load_lessons():
    lessons = []
    for lesson in Path('prima/content/lessons/').iterdir():
        content, metadata = read_md(str(lesson))
        lessons.append(dict(content=content, metadata=metadata, href=lesson.stem))
    return lessons
lessons = load_lessons()

@app.get("/")
def root(request:Request):
    content, metadata = read_md('prima/content/pages/index.md')
    context = {"request": request, "content":content, "metadata":metadata, "lessons":lessons}
    return templates.TemplateResponse("index.html", context)

@app.get('/{lesson}')
def lesson(request:Request, lesson:str):
    content, metadata = read_md(f'prima/content/lessons/{lesson}.md')
    context = {"request": request, "content":content, "metadata":metadata}
    return templates.TemplateResponse("lesson.html", context)

@typer_app.command()
def build():
    start_time = time.time()
    site_path = Path.cwd() / 'site'
    if not site_path.exists():
        site_path.mkdir(parents=True, exist_ok=True)

    page = root(Request)
    (site_path / 'index.html').write_bytes(page.body)
    subprocess.run(["pagefind"])
    print(f"[bold green] 🐢 Site built sucessfully in {time.time() - start_time} seconds[/bold green]")

@typer_app.command()
def serve():
    subprocess.run(["uvicorn", "prima.main:app", "--reload"])


@typer_app.command()
def deploy():
    print(f"[bold red]feature in progress[/bold red]")
