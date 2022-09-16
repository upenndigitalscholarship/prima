import srsly 
import subprocess
import typer
from rich import print
import markdown
from pathlib import Path 
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

typer_app = typer.Typer()
app = FastAPI()
app.mount("/assets", StaticFiles(directory="prima/assets"), name="assets")
templates = Jinja2Templates(directory="prima/templates")

@app.get("/")
def root(request:Request):
    content = markdown.markdown(Path('prima/content/index.md').read_text())
    context = {"request": request, "content":content}
    return templates.TemplateResponse("index.html", context)
    
@typer_app.command()
def build():
    site_path = Path.cwd() / 'site'
    if not site_path.exists():
        site_path.mkdir(parents=True, exist_ok=True)

    page = root(Request)
    (site_path / 'index.html').write_bytes(page.body)
    print("[bold green]Site built sucessfully[/bold green]")

@typer_app.command()
def serve():
    subprocess.run(["uvicorn", "prima.main:app"])

