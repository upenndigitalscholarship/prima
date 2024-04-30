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
    eleventyConfig.addFilter("markdownify", (markdownString) =>
        md.render(markdownString)
    );
    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    })
};
