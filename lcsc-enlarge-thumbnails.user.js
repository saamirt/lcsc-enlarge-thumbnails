// ==UserScript==
// @name         LCSC High Res Images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enlarge LCSC thumbnails
// @author       Aamir Tahir
// @match        https://www.lcsc.com/products/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(() => {
    'use strict';
    const clg = console.log;
    const waitForElement = (selector, callback) => {
        let timeout;
        let interval = setInterval(()=>{
            if ($(selector).length){
                clearInterval(interval);
                clearTimeout(timeout);
                callback(selector);
            }
        }, 200);

        //timeout interval if not found
        timeout = setTimeout(() => {
            clg(`Timing out search for selector "${selector}"`);
            clearInterval(interval);
        }, 5000);
    }

    // From https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
    /**
     * Returns a hash code for a string.
     * (Compatible to Java's String.hashCode())
     *
     * The hash code for a string object is computed as
     *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
     * using number arithmetic, where s[i] is the i th character
     * of the given string, n is the length of the string,
     * and ^ indicates exponentiation.
     * (The hash value of the empty string is zero.)
     *
     * @param {string} s a string
     * @return {number} a hash code value for the given string.
     */
    function hashCode(s) {
      var h = 0, l = s.length, i = 0;
      if ( l > 0 )
        while (i < l)
          h = (h << 5) - h + s.charCodeAt(i++) | 0;
      return h;
    };

    function SetImagesToHighRes(parent){
        const SEEN_CLASS = "tm-high-res-seen";
        $(parent).find(`.product-img > .v-image > .v-image__image`).each((i,j) => {
            const url = $(j).css('background-image');
            if (url === "none" || !url) return;
            const seen_class = `${SEEN_CLASS}_${hashCode(url.trim())}`;
            if ($(j).hasClass(seen_class)) return;
            $(j).addClass(seen_class);
            const new_url = url.replace("96x96", "900x900");
            $(j).css('background-image', new_url);
        })
    }

    function main () {
        clg("Script starting...");
        waitForElement(`.product-table`, (s) => {
            clg("Found starting element!");
            setInterval(() => {SetImagesToHighRes(s)}, 3000);
        });
    }

    main();
    
})();
