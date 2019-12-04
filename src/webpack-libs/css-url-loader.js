const utils = require('loader-utils');

function loader(source) {
    const options = utils.getOptions(this);

    source = source.replace(/\.\.\/fonts/g, '/assets/fonts');
    source = source.replace(/\.\.\/images/g, '/assets/images');
    source = source.replace(/\.\.\/svg/g, '/assets/svg');

    return source;
}

module.exports = loader;