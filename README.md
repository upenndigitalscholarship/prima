# prima
PRIMA (Pedagogical Repository for Italian Media Activities)

# Goals
-  PageFind, worth adding Rust? compare to Lunr.js
-  Box SDK, store assets, hooks for updates/new assets?
-  Netlify CMS as independent app outside the Netlify platform
-  incremental build. Just re-render posts versus full build. Need condition based on location of changes

# TODO
- add netlify CMS, follow https://github.com/HCDigitalScholarship/anthro281
- need to push/fetch content to Box or other object storage


## PageFind
- Install Rust`curl https://sh.rustup.rs -sSf | sh`
- `sudo apt install cargo`
- `cargo install pagefind`
- `pagefind --source "site"`
### also works in npx, might be better given CMS is Gatsby

## Assets
This project has many existing assets, particularly video files, in Box.
These files can stay there and be fetched  with a direct download URI. 

```python 
download_url = client.file(file_id).get_download_url()
```
https://www.isc.upenn.edu/security/data-box-amazon#Confidential-University-Data
Current box storage limit is **TBD**
Dependent on University affiliation, deleted with email (bad for term-faculty, adjuncts, students that move) 

DO Spaces
- $5 per month, 250GiB

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
