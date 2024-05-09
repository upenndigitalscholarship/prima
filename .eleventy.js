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
                // Object — Grammar: - Foul - Fish - fish|carp
                for (let [key, value] of Object.entries(entry)) {
                    // Grammar, [ fish,foul, fish|carp ] 

                    if (!index[key]) {
                        index[key] = [];
                    }
                    index[key].push(...value);
                    
                }
            }
            
        }
        
        //  remove duplicates  
        for (let [key, value] of Object.entries(index)) {
            index[key] = [...new Set(value)].sort();
        }
        
        // iterate over index
        let cats = [];
        for (let [key, value] of Object.entries(index)) {
            // convert value to object
            
            let obj = {};
            for (v of value) {
                if (v.includes("|")) {
                    let [subkey, subvalue] = v.split("|");
                    if (obj[key]) {
                        obj[key][subkey] = obj[key][subkey] || [];
                        obj[key][subkey].push(subvalue);
                    } else {
                        obj[key] = { [subkey]: [subvalue] };
                    }
                } else {
                    obj[key] = obj[key] || {};
                    obj[key][v] = [];
                }
            }
            cats.push(obj)
        }
        console.log(cats);
        return cats
              
    });
    eleventyConfig.addFilter("markdownify", (markdownString) =>
        md.render(markdownString)
    );
    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    })
};
