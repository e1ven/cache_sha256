// Caches small objects (js,css,etc) across domains, so you don't need to re-download it over and over and over, but also don't need to rely on a central server for your code.


// To use, include the JS, ideally as a DataURI.
// The reason you should load it via a DataURI is so that it ONLY works in browsers that support DataURIs. ;)
// It's a better test than trying to load an image, etc.

// Then, for each element you want to have cached, add an attribute cache_sha256 = 'HASH_OF_THAT_FILE.'
// So, for instance, <img src="http://robohash.org/shacache_example.png" cache_sha256='8bb68bac366a6207712b9feafae67a68d333c1f2b2a3f42e6229a2866b83b6a3'>

// You can/should probably programatically generate these via Python/Rails/whatever, but for testing they are easy enough to generate as a one-off
// curl --silent "http://robohash.org/shacache_example.png" | shasum -a256




// Uses window.name as a cross domain JSON store - Feel free to add your own window.name elements in a separate key.



// CryptoJS, used to generate the SHA256 hash very quickly. From http://code.google.com/p/crypto-js/ (BSD)

var CryptoJS=CryptoJS||function(h,s){var f={},t=f.lib={},g=function(){},j=t.Base={extend:function(a){g.prototype=this;var c=new g;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=t.WordArray=j.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||u).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=j.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new q.init(c,a)}}),v=f.enc={},u=v.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new q.init(d,c/2)}},k=v.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new q.init(d,c)}},l=v.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
x=t.BufferedBlockAlgorithm=j.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=l.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var m=0;m<a;m+=e)this._doProcessBlock(d,m);m=d.splice(0,a);c.sigBytes-=b}return new q.init(m,b)},clone:function(){var a=j.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});t.Hasher=x.extend({cfg:j.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){x.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new w.HMAC.init(a,
d)).finalize(c)}}});var w=f.algo={};return f}(Math);
(function(h){for(var s=CryptoJS,f=s.lib,t=f.WordArray,g=f.Hasher,f=s.algo,j=[],q=[],v=function(a){return 4294967296*(a-(a|0))|0},u=2,k=0;64>k;){var l;a:{l=u;for(var x=h.sqrt(l),w=2;w<=x;w++)if(!(l%w)){l=!1;break a}l=!0}l&&(8>k&&(j[k]=v(h.pow(u,0.5))),q[k]=v(h.pow(u,1/3)),k++);u++}var a=[],f=f.SHA256=g.extend({_doReset:function(){this._hash=new t.init(j.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],m=b[2],h=b[3],p=b[4],j=b[5],k=b[6],l=b[7],n=0;64>n;n++){if(16>n)a[n]=
c[d+n]|0;else{var r=a[n-15],g=a[n-2];a[n]=((r<<25|r>>>7)^(r<<14|r>>>18)^r>>>3)+a[n-7]+((g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10)+a[n-16]}r=l+((p<<26|p>>>6)^(p<<21|p>>>11)^(p<<7|p>>>25))+(p&j^~p&k)+q[n]+a[n];g=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&m^f&m);l=k;k=j;j=p;p=h+r|0;h=m;m=f;f=e;e=r+g|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+m|0;b[3]=b[3]+h|0;b[4]=b[4]+p|0;b[5]=b[5]+j|0;b[6]=b[6]+k|0;b[7]=b[7]+l|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=g.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=g._createHelper(f);s.HmacSHA256=g._createHmacHelper(f)})(Math);
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(){if("function"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<
24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();




/*
 * DOMParser HTML extension
 * 2012-02-02
 *
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
    "use strict";
    var DOMParser_proto = DOMParser.prototype
      , real_parseFromString = DOMParser_proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}

    DOMParser_proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.implementation.createHTMLDocument("")
              , doc_elt = doc.documentElement
              , first_elt;

            doc_elt.innerHTML = markup;
            first_elt = doc_elt.firstElementChild;

            if (doc_elt.childElementCount === 1
                && first_elt.localName.toLowerCase() === "html") {
                doc.replaceChild(first_elt, doc_elt);
            }

            return doc;
        } else {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(DOMParser));

function isEmpty(value){
  return (value === undefined || value == null || value.length === 0);
}

function cache_sha256_load(){
    // First, let's take care of restoring any cache that is saved.
    // We want to check to see if we already have one - If so, restore it.
    cache_sha256_OK=0;
    try
    {
        // Does it parse as JSON?
        if (! isEmpty(JSON.parse(window.name)) )
        {
            cache_sha256_wdata = JSON.parse(window.name);
            // Check to see if anything is stored in the value we're using.
            // By doing this, other JS libs can also store values here, without interfering
            
            if (isEmpty(cache_sha256_wdata['cache_sha256']))
            {
                cache_sha256_wdata['cache_sha256'] = new Object(); 
            }
            window.cache_sha256_data = cache_sha256_wdata['cache_sha256'];
            cache_sha256_OK = 1;
        }
    }
    catch(err)
    {
        cache_sha256_OK = 0;
    }
    if ( cache_sha256_OK == 0)
    {  
        // For some reason, we couldn't restore
        cache_sha256_wdata = new Object();
        cache_sha256_wdata['cache_sha256'] = new Object();
        window.cache_sha256_data = cache_sha256_wdata['cache_sha256'];
        cache_sha256_save(window.cache_sha256_data);
    }
}


// Now that we have the cache loaded, here's a function to act on every element that will use the cache.
function cache_sha256_elemActor(elem)
{
    if ( elem.alreadyset == "True" )
    {
        // Nothing to do here.
        return
    }
    var url = elem.src;
    cache_sha256_load();
    cache_sha256_hash = elem.getAttribute('cache_sha256');


    // Do we have a hash stored
    if (window.cache_sha256_data[cache_sha256_hash])
    {
        alert("Potentially already stored...");
        // is it a valid hash?
        var b64 = window.cache_sha256_data[cache_sha256_hash];
        orig  = CryptoJS.enc.Base64.parse(b64);
        alert(result);
        var hash =  CryptoJS.SHA256(result);
        alert("restored hash " + hash);
        if (hash == cache_sha256_hash)
        {
            b64 = CryptoJS.enc.Base64.stringify(words);
            var data_url = "data:image/png;base64," + b64;
            elem.src = data_url;
            alert("Using cached version!");
            elem.alreadyset = "True"; 
        }
    }
    if ( elem.alreadyset != "True" )
    {
        // Pull in our object over a XMLHttpRequest
        var request             = new XMLHttpRequest();
        request.open ("GET", url, true);
        request.overrideMimeType('text\/plain; charset=x-user-defined');
        request.send (null);
        var data_url = "";
        request.onload = function(e)
        {
            if (this.status === 200) 
            {

                var result ="";
                for (var i=0; i<=request.responseText.length-1; i++)
                    result += String.fromCharCode(request.responseText.charCodeAt(i) & 0xff);
                var hash =  CryptoJS.SHA256(result);
                alert(result);
                alert("orig hash" + hash);
                words  = CryptoJS.enc.Latin1.parse(result);
                b64 = CryptoJS.enc.Base64.stringify(words);
                data_url = "data:image/png;base64," + b64;
                window.cache_sha256_data[hash] = b64;
                cache_sha256_save(window.cache_sha256_data);
                elem.src = data_url;
                elem.alreadyset = "True";
            }
        };
    }
}


// Then comes the trickiest part, detecting who wants to use the cache.
// This is surprisingly complexl, since they might be added at any time.
// The best way I've found is to use the method described at http://davidwalsh.name/detect-node-insertion to re-create DOM Events API.


// Create a listener, to act on each event that we generate.
var cache_sha256_insertListener = function(event){
    if (event.animationName == "cache_sha256_nodeInserted")
    {
        cache_sha256_elemActor(event.target);
    }
}

// Add this listener for all browsers
document.addEventListener("animationstart", cache_sha256_insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", cache_sha256_insertListener, false); // IE
document.addEventListener("webkitAnimationStart", cache_sha256_insertListener, false); // Chrome + Safari

//Now, insert the CSS to give these nodes the 'animation' when you see one.
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "\
                @keyframes cache_sha256_nodeInserted {\
                    from {clip: rect(1px, auto, auto, auto);}\
                    to {clip: rect(0px, auto, auto, auto);}\
                }\
                @-moz-keyframes cache_sha256_nodeInserted {\
                    from {clip: rect(1px, auto, auto, auto);}\
                    to {clip: rect(0px, auto, auto, auto);}\
                }\
                @-webkit-keyframes cache_sha256_nodeInserted {\
                    from {clip: rect(1px, auto, auto, auto);}\
                    to {clip: rect(0px, auto, auto, auto);}\
                }\
                @-ms-keyframes cache_sha256_nodeInserted {\
                    from {clip: rect(1px, auto, auto, auto);}\
                    to {clip: rect(0px, auto, auto, auto);}\
                }\
                @-o-keyframes cache_sha256_nodeInserted {\
                    from {clip: rect(1px, auto, auto, auto);}\
                    to {clip: rect(0px, auto, auto, auto);}\
                }\
                img{ \
                    animation-duration: 0.001s; \
                    -o-animation-duration: 0.001s; \
                    -ms-animation-duration: 0.001s; \
                    -moz-animation-duration: 0.001s; \
                    -webkit-animation-duration: 0.001s; \
                    animation-name: cache_sha256_nodeInserted; \
                    -o-animation-name: cache_sha256_nodeInserted; \
                    -ms-animation-name: cache_sha256_nodeInserted;  \
                    -moz-animation-name: cache_sha256_nodeInserted;  \
                    -webkit-animation-name: cache_sha256_nodeInserted; \
                }";
document.head.appendChild(css);


// Now comes the REALLY fun part.
// You can't swap out a src element without it loading it first.
// If you swap imageA to imageB via JS, you'll end up loading -both-

// So we're going to cheat, and only insert the images via JS.
// This way, the page won't pre-load them.

// But, I can hear you saying, what will happen if they don't have JS enabled?
// That's the beauty of this hack - We're going to load them out of a <noscript> tag.

// If you have JS on, this tag is skipped over in the parsing entirely.
// So it never even makes the HTTP requests.

// But if JS is disabled, it will just load them normally.
// Bwahaha.

var cache_sha256_allElements = document.getElementsByTagName('*');
for (var cache_sha256_loop = 0; cache_sha256_loop < cache_sha256_allElements.length; cache_sha256_loop++)
{
    cache_sha256_elem = cache_sha256_allElements[cache_sha256_loop]
    if (cache_sha256_elem.tagName.toUpperCase() == "NOSCRIPT")
    {
        // We check for the class so that your other, legitimate noscript tags, if any, aren't effected by our trickery.
        if (cache_sha256_elem.className == 'cache_sha256')
        {
            // If we manipulate this obj inside the document.* heirarchy, Chrome will load it.
            // So instead, we need to create a new HTML parser, and manipulate it there.

            cache_sha256_elemHTML = cache_sha256_elem.textContent||cache_sha256_elem.innerHTML;
            cache_sha256_parser = new DOMParser();
            cache_sha256_NewDOM = cache_sha256_parser.parseFromString(cache_sha256_elemHTML, "text/html");

            // Our new HTML parser will give us a proper DOM structure, with HTML, BODY, etc.
            // We want to pull our original element.
            cache_sha256_DomElem = cache_sha256_NewDOM.getElementsByTagName('BODY')[0].firstChild;

            // Manipulate the element as necessary, then put it in to replace the NOSCRIPT tag
            cache_sha256_elemActor(cache_sha256_DomElem);
            cache_sha256_elem.parentNode.appendChild(cache_sha256_DomElem);
            document.body.removeChild(cache_sha256_elem);
        }
    }
}


function cache_sha256_save(cache_sha256_data)
{
    cache_sha256_wdata = new Object();
    // Store the data back to the window.name property
    cache_sha256_wdata['cache_sha256'] = cache_sha256_data;
    window.name = JSON.stringify(cache_sha256_wdata);
    console.log("Saving...");
}

