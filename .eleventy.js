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
    
  };
