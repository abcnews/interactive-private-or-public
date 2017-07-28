module.exports = renderFunction => {
    let errorElement = null;

    return () => {
        try {
            renderFunction();

            if (errorElement) {
                errorElement.remove();
                errorElement = null;
            }
        } catch (e) {
            console.error(e);

            errorElement = document.createElement('div');
            errorElement.innerHTML = `
                <div style="position:fixed; top:5%; left:5%; border:1px solid black; background:white; box-shadow: 4px 4px 0px rgba(0,0,0,0.3);">
                    <div style="background:#103d87; color:white; padding: 8px; border-bottom: 1px solid #061e44; font-family: Arial, sans-serif; text-align:center; border-top: 1px solid #265aaf; border-left: 1px solid #265aaf; border-right: 1px solid #061e44">
                        ERROR
                    </div>
                    <div style="padding: 0 10px; border-top: 1px solid black; background: #111; color: white;">
                        <pre style="padding: 15px 10px; margin: 0;">${e.stack}</pre>
                    </div>
                </div>
                <div style="position:fixed; top:20%; left:40%; border:1px solid black; background:white; box-shadow: 4px 4px 0px rgba(0,0,0,0.3)">
                    <div style="background:#103d87; color:white; padding: 8px; border-bottom: 1px solid #061e44; font-family: Arial, sans-serif; text-align:center; border-top: 1px solid #265aaf; border-left: 1px solid #265aaf; border-right: 1px solid #061e44">
                        ERROR
                    </div>
                    <div style="padding-top: 20px; border-top: 1px solid black">
                        <img src="${require('./error.gif')}" />
                    </div>
                </div>`;
            document.documentElement.appendChild(errorElement);
        }
    };
};
