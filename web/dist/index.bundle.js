!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){(function(e){function n(e,t){for(var n=0,r=e.length-1;r>=0;r--){var o=e[r];"."===o?e.splice(r,1):".."===o?(e.splice(r,1),n++):n&&(e.splice(r,1),n--)}if(t)for(;n--;n)e.unshift("..");return e}function r(e,t){if(e.filter)return e.filter(t);for(var n=[],r=0;r<e.length;r++)t(e[r],r,e)&&n.push(e[r]);return n}t.resolve=function(){for(var t="",o=!1,i=arguments.length-1;i>=-1&&!o;i--){var c=i>=0?arguments[i]:e.cwd();if("string"!=typeof c)throw new TypeError("Arguments to path.resolve must be strings");c&&(t=c+"/"+t,o="/"===c.charAt(0))}return(o?"/":"")+(t=n(r(t.split("/"),(function(e){return!!e})),!o).join("/"))||"."},t.normalize=function(e){var i=t.isAbsolute(e),c="/"===o(e,-1);return(e=n(r(e.split("/"),(function(e){return!!e})),!i).join("/"))||i||(e="."),e&&c&&(e+="/"),(i?"/":"")+e},t.isAbsolute=function(e){return"/"===e.charAt(0)},t.join=function(){var e=Array.prototype.slice.call(arguments,0);return t.normalize(r(e,(function(e,t){if("string"!=typeof e)throw new TypeError("Arguments to path.join must be strings");return e})).join("/"))},t.relative=function(e,n){function r(e){for(var t=0;t<e.length&&""===e[t];t++);for(var n=e.length-1;n>=0&&""===e[n];n--);return t>n?[]:e.slice(t,n-t+1)}e=t.resolve(e).substr(1),n=t.resolve(n).substr(1);for(var o=r(e.split("/")),i=r(n.split("/")),c=Math.min(o.length,i.length),s=c,u=0;u<c;u++)if(o[u]!==i[u]){s=u;break}var a=[];for(u=s;u<o.length;u++)a.push("..");return(a=a.concat(i.slice(s))).join("/")},t.sep="/",t.delimiter=":",t.dirname=function(e){if("string"!=typeof e&&(e+=""),0===e.length)return".";for(var t=e.charCodeAt(0),n=47===t,r=-1,o=!0,i=e.length-1;i>=1;--i)if(47===(t=e.charCodeAt(i))){if(!o){r=i;break}}else o=!1;return-1===r?n?"/":".":n&&1===r?"/":e.slice(0,r)},t.basename=function(e,t){var n=function(e){"string"!=typeof e&&(e+="");var t,n=0,r=-1,o=!0;for(t=e.length-1;t>=0;--t)if(47===e.charCodeAt(t)){if(!o){n=t+1;break}}else-1===r&&(o=!1,r=t+1);return-1===r?"":e.slice(n,r)}(e);return t&&n.substr(-1*t.length)===t&&(n=n.substr(0,n.length-t.length)),n},t.extname=function(e){"string"!=typeof e&&(e+="");for(var t=-1,n=0,r=-1,o=!0,i=0,c=e.length-1;c>=0;--c){var s=e.charCodeAt(c);if(47!==s)-1===r&&(o=!1,r=c+1),46===s?-1===t?t=c:1!==i&&(i=1):-1!==t&&(i=-1);else if(!o){n=c+1;break}}return-1===t||-1===r||0===i||1===i&&t===r-1&&t===n+1?"":e.slice(t,r)};var o="b"==="ab".substr(-1)?function(e,t,n){return e.substr(t,n)}:function(e,t,n){return t<0&&(t=e.length+t),e.substr(t,n)}}).call(this,n(1))},function(e,t){var n,r,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function c(){throw new Error("clearTimeout has not been defined")}function s(e){if(n===setTimeout)return setTimeout(e,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(e){n=i}try{r="function"==typeof clearTimeout?clearTimeout:c}catch(e){r=c}}();var u,a=[],l=!1,f=-1;function d(){l&&u&&(l=!1,u.length?a=u.concat(a):f=-1,a.length&&h())}function h(){if(!l){var e=s(d);l=!0;for(var t=a.length;t;){for(u=a,a=[];++f<t;)u&&u[f].run();f=-1,t=a.length}u=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===c||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function _(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];a.push(new p(e,t)),1!==a.length||l||s(h)},p.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=_,o.addListener=_,o.once=_,o.off=_,o.removeListener=_,o.removeAllListeners=_,o.emit=_,o.prependListener=_,o.prependOnceListener=_,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,t,n){"use strict";function r(e){const t=document.createElement("script");return t.src=`/${window.__MAP_REL__}${"/"===e?"/index":e}.map.js`,t}n.r(t);var o=({children:e})=>React.createElement(ReactHelmet.Helmet,null,e),i=n(0),c=class extends React.Component{constructor(){super(),this.state={app:window.__FIREJS_APP__.default,pre_chunks:window.__SSR__?window.__MAP__.chunks:[],chunks:window.__SSR__?window.__MAP__.chunks:[]},window.wrapper_context=this,window.updateWrapperState=this.setState}loadPage(){this.setState({app:window.__FIREJS_APP__})}render(){return React.createElement("div",null,React.createElement(o,null,this.state.pre_chunks.map(e=>{const t=Object(i.join)(`/${window.__LIB_REL__}/${e}`);switch(console.log("pre_chunks",t,e.substring(e.lastIndexOf("."))),e.substring(e.lastIndexOf("."))){case".js":return React.createElement("link",{rel:"preload",as:"script",href:t,crossOrigin:"anonymous"});case".css":return React.createElement("link",{rel:"preload",as:"style",href:t,crossOrigin:"anonymous"})}})),React.createElement(this.state.app,{content:window.__MAP__.content}),this.state.chunks.map((e,t)=>{const n=Object(i.join)(`/${window.__LIB_REL__}/${e}`);switch(e.substring(e.lastIndexOf("."))){case".js":return n.startsWith("m")&&this.loadPage,React.createElement("script",{src:n,crossOrigin:"anonymous"});case".css":return React.createElement("link",{rel:"stylesheet",href:n,crossOrigin:"anonymous"});default:return React.createElement("link",{href:n})}}))}};window.onpopstate=function(){!function(e,t){const n=r(e);n.onload=function(){window.wrapper_context.setState({pre_chunks:window.__MAP__.chunks}),t()},n.onerror=function(){document.head.removeChild(n);const e=r(window.__PAGES__._404);e.onload=n.onload,document.head.appendChild(e)},document.head.appendChild(n)}(location.pathname,()=>{!function(e){const t=r(e);t.onload=function(){window.wrapper_context.setState({chunks:window.__MAP__.chunks})},t.onerror=e=>{document.head.removeChild(t);const n=r(window.__PAGES__._404);n.onload=map_script.onload,document.head.appendChild(n)},document.head.appendChild(t)}(location.pathname)})},ReactDOM.hydrate(React.createElement(c,{content:window.__MAP__.content}),document.getElementById("root"))}]);