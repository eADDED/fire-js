export default ({to, children, className}) => {
    let wasLoaded = false;
    function load(event, callback) {
        if (wasLoaded)
            return;
        const map_script = document.createElement("script");
        map_script.src = `/${window.__MAP_REL__}${to === "/" ? "/index" : to}.map.js`;//make preloaded js to execute
        document.head.appendChild(map_script);
        const onload = () => {
            window.__MAP__.chunks.forEach(chunk => {
                const preloadLink = document.createElement("link");
                preloadLink.href = `/${window.__LIB_REL__}/` + chunk;
                preloadLink.rel = "preload";
                preloadLink.as = "script";//this preloads script before hand
                document.head.appendChild(preloadLink);
            })
            if (callback)
                callback();
        };
        const onerror = () => {
            document.head.removeChild(map_script);
            const _404 = document.createElement("script");
            _404.src = `/${window.__MAP_REL__}/${window.__PAGES__._404}.map.js`;//make preloaded js to execute
            _404.onload = onload;
            document.head.appendChild(_404);
        };
        map_script.onload = onload;
        map_script.onerror = onerror;
        wasLoaded = true;
    }

    function apply(event) {
        if (event)
            event.preventDefault();
        if (!wasLoaded)
            load(undefined, apply);
        else {
            window.__MAP__.chunks.forEach(chunk => {
                const preloadedScript = document.createElement("script");
                preloadedScript.src = `/${window.__LIB_REL__}/` + chunk;//make preloaded js to execute
                document.head.appendChild(preloadedScript);
            });
            window.history.pushState('', '', to);
        }
    }

    return (
        <a href={to} className={className} onClick={apply} onMouseEnter={load}>
            {children}
        </a>
    )
}