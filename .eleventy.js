const { EleventyI18nPlugin } = require("@11ty/eleventy");
const { execSync } = require('child_process')
const md = require("markdown-it")({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "it", // Required, this site uses Italian
        errorMode: "never"
    });

    eleventyConfig.addFilter("thumbnail", function (collection, key) {
        if (collection && key) {
            // find item with lesson equal to key
            let item = collection.find(item => item.data && item.data.lesson === key);
            return item && item.data && item.data.thumbnail;
        }

        // handle the case when either `collection` or `key` is not defined
        return "";
    });
    
    eleventyConfig.addFilter("makeIndex", function (collection) {
        let index = {};
        for (item of collection) {
            if (!item.data.index) {
                continue;
            }
            for (entry of item.data.index) {
                for (let [key, value] of Object.entries(entry)) {
                    // if not index[key] then create an array
                    if (!index[key]) {
                        index[key] = [];
                    }
                    // if there is a hyphen in the value then split it
                    if (value[0].includes(" - ")) {
                        let split = value[0].split("-");
                        for (let i = 0; i < split.length; i++) {
                            index[key].push(split[i]);
                        }
                    } else {
                        index[key].push(value[0]);
                    }
                }
            }
            
        }
        // for each key turn the array into a set, sort alphabetically and remove duplicates
        for (let [key, value] of Object.entries(index)) {
            index[key] = [...new Set(value)].sort();
        }
        return index;
    });
    eleventyConfig.addFilter("markdownify", (markdownString) =>
        md.render(markdownString)
    );
    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    })
};
