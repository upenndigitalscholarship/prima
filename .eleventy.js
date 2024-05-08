const { EleventyI18nPlugin } = require("@11ty/eleventy");
const { execSync } = require('child_process')
const md = require("markdown-it")({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });
const translations = require("./_data/translations.json");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "it", // Required, this site uses Italian
        errorMode: "never"
    });
    eleventyConfig.addFilter("translate", function (word) {
        return translations[word] || word;
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
                    // if value is an array then add each element to the index
                    if (Array.isArray(value)) {
                        index[key].push(...value);
                    } else {
                        index[key].push(value);
                    }
                }
            }
            
        }
        // for each key turn the array into a set, sort alphabetically and remove duplicates
        for (let [key, value] of Object.entries(index)) {
            
            // value is an array of strings, some havea pipe, those should be split
            // for each array in value 
            for (let i = 0; i < value.length; i++) {
                // if the value contains a pipe then split on |, add a key for the first value 
                // and add the value to the key
                if (typeof value[i] === 'string' && value[i].includes("|")) {
                    let [first, second] = value[i].split("|");
                    console.log(first, second)
                    // create a new object with key of first 
                    let sub = {};
                    sub[first] = second;
                    // add to the index
                    index[key].push(sub);
                    // remove the old value
                    value.splice(i, 1);


                }
            }

            index[key] = [...new Set(value)].sort();
            // if the value contains a pipe then split on |, add a key for the first value 
            
            

        }
        
        console.log(index);
        return index;
    });
    eleventyConfig.addFilter("markdownify", (markdownString) =>
        md.render(markdownString)
    );
    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    })
};
