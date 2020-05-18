import {loadPage, preloadPage} from "../web/LinkApi"

export default ({to, children, className}) => {
    let wasLoaded = false;

    function preLoad(event, callback) {
        if (wasLoaded)
            return;
        preloadPage(to, callback || function () {
            wasLoaded = true;
        });
    }

    function apply(event) {
        if (!wasLoaded)//there is no muse enter in mobile devices
            preLoad(undefined, () => {
                loadPage(to);
            });
        else
            loadPage(to);
        try {
            event.preventDefault();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <a href={to} className={className} onClick={apply.bind(this)} onMouseEnter={preLoad.bind(this)}>
            {children}
        </a>
    )
}