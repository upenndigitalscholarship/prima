const { EleventyI18nPlugin } = require("@11ty/eleventy");
const yaml = require("js-yaml");

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
    
    eleventyConfig.addFilter("distinct", function(collection, key) {
        let values = new Set();
        collection.filter(function(item) {
            let value = item.data[key];
            value.forEach(function(item) { 
                if (!values.has(item)) {
                    values.add(item);
                    return true;
                }
            });
            return false;
        });
        
        return [...values].sort();
        
    });
  };
