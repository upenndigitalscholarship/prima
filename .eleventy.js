const { EleventyI18nPlugin } = require("@11ty/eleventy");
const yaml = require("js-yaml");
const { execSync } = require('child_process')
const md = require("markdown-it")({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

module.exports = function(eleventyConfig) {
    // Output directory: _site
  
    // Copy `assets/` to `_site/assets`
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        // any valid BCP 47-compatible language tag is supported
        defaultLanguage: "it", // Required, this site uses Italian
        errorMode: "never"
    });
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
    // eleventyConfig.addFilter("find", function find(collection = [], slug = "") {
    //     return collection.filter(post => post.lezioni === slug);
    //   });
    
    /* Markdown-It 'markdownify' filter
    source: https://github.com/11ty/eleventy/issues/236
    */
    eleventyConfig.addFilter("markdownify", (markdownString) =>
        md.renderInline(markdownString)
    );

    eleventyConfig.addFilter("distinct", function(collection, key) {
        
            let values = new Set();
            collection.filter(function(item) {
                let value = item.data[key];
                if (value) {
                    value.forEach(function(item) { 
                        if (!values.has(item)) {
                            values.add(item);
                            return true;
                        }
                    });
                    return false;
                };
            });
            console.log(key, [...values].sort());
            return [...values].sort();
        
        
    });
    eleventyConfig.addFilter("thumbnail", function(collection, key) {
        if (collection && key) {
          // find item with lesson equal to key
          let item = collection.find(item => item.data && item.data.lesson === key);
          return item && item.data && item.data.thumbnail;
        } 
      
        // handle the case when either `collection` or `key` is not defined
        return "";
      });
    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --source _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
        })
  };
