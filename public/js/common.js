var WebHelper = new function() {

    this.basepath = '';

    this.init = function init(basepath) {
        this.basepath = basepath;
    };

    /**
     *
     * @param {string} path
     * @returns {undefined}
     */
    this.getUrl = function getUrl(path) {
        if (path.charAt(0) === '/') {
            return this.basepath + path;
        } else {
            return document.URL + '/' + path;
        }
    };
};


