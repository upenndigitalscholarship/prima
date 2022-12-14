# prima
PRIMA (Pedagogical Repository for Italian Media Activities)

# Installation 
1. If you don't have Python 3.10+ installed, you'll need to do that first: 
    - Mac `brew install python@3.10`
    - [Windows](https://www.digitalocean.com/community/tutorials/install-python-windows-10)
    - [Linux](https://computingforgeeks.com/how-to-install-python-on-ubuntu-linux-system/) 
2. Create a Python 3.10 virtual environment. You may need to install `python3.10-venv`, Anaconda, virtualenv or the enviornment manager of your choice.
    - for example `python3.10 -m venv venv`
1. Download the project files: `git clone https://github.com/upenndigitalscholarship/prima.git`
2. Install poetry: `curl -sSL https://install.python-poetry.org | python3.10 -`
3. `poetry install`
4. you should now have a `prima` command

# Usage 
- To build the site: `prima build`
- Development server: `prima serve`

# Goals
-  Netlify CMS as independent app outside the Netlify platform
-  Git LFS, but store objects in DO Space
-  incremental build. Just re-render posts versus full build. Need condition based on location of changes
-  What is "most minimal" deployment? A single serverless function to handle SSL pointing to objects in S3 (otherwise, argument about running server and maintenance is less strong)

# TODO
- add netlify CMS, follow https://github.com/HCDigitalScholarship/anthro281


## Assets
This project has many existing assets, particularly video files, in Box.
These files can stay there and be fetched  with a direct download URI. 

```python 
download_url = client.file(file_id).get_download_url()
```
https://www.isc.upenn.edu/security/data-box-amazon#Confidential-University-Data
Current box storage limit is **TBD**
Dependent on University affiliation, deleted with email (bad for term-faculty, adjuncts, students that move) 


### DO Spaces
- $5 per month, 250GiB

### git lfs
- System for handling large media, adds a text pointer to a repo pointing to a large file
- Git’s system of tracking diffs doesn’t work with these files, so it saves full copies of every version in your Git repository.
- A paid service from MSFT (1G free)
- GitLab can redirect large files to S3. 

policy:
- push assets to GitHub as in the past
- large image files can be stored in IIIF
- video should be in a streaming service such as Vimeo
- large audio can go in S3 (how to handle cms, manual entry of uris?)


## Deployment
Many workflows currently trigger GitHub Actions and Pages deployment on every commit.
While the build doesn't take long, Pages can take a few minutes to transfer assets and deploy them.
What if this project runs builds locally and deploys to DO with Fabric (like MappingEE).
This removes the dependency on Microsoft cloud services as anything more than a code repository.
Netlify CMS may compicate this. 

- Netlify (service dependent, teaching platform-specific products)
    + quick domain and certs, CDN, CMS, forms, CLI, atomic deploys, global CDN/deploys
    - AWS, dependent on external infrastructure, costs can change
- Digital Ocean (service independent, teaching core tech)
    + local, simple, OS control and maintenance, single region, simple, fixed costs 
    - need to update os, certs, maintain at least one droplet for static sites

## Serverless static
- It is possible to create an A record pointing to an S3 bucket.
- but problem with SSL certs
https://www.serverlessops.io/blog/static-websites-on-aws-s3-with-serverless-framework

## Analytics 
all projects should have Google Analytics ids
project partners should have access to GA dashboard
we should periodically review what data has relevance for grants, departments and other stakeholders


## Inspiration 
https://forensic-architecture.org/
https://course.spacy.io/en/
https://calmcode.io/
https://yougotthis.io/
https://geekle.us/geeklibrary
https://www.codecademy.com/catalog
