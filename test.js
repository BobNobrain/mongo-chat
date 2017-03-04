let express = require('express');

let app = express();

let makeEndpoint = (app, name, callback, context) => {
    name = name // TODO: check which of these can be placed in url
        .replace(/\//g, '\\/')
        .replace(/\./g, '\\.')
        .replace(/\?/g, '\\?')
        .replace(/\$/g, '\\$')
        .replace(/\^/g, '\\^')
        .replace(/\*/g, '\\*');
    let urlRegex = new RegExp(`^${name}(/.*)?$`);

    if (context !== void 0)
        callback = callback.bind(context);

    app.get(urlRegex, (req, res) => {
        let args = req.path.split('/');
        if (args.length > 0) args.shift();
        let params = {
            args,
            method: req.method
        };
        res.json(callback(params));
    });
};

let endpoint = '/msg';
let myCallback = ({args, method}) => {
    return {
        req: `${method} /${args.join('/')}`,
        args
    };
};
makeEndpoint(app, endpoint, myCallback);

// make a teapot
app.get('/teapot', (req, res) => {
    res.status(418).send();
});

app.listen(8081, () => console.log('Test express launched'));
