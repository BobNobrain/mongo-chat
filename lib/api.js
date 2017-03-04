const e = require('http-errors');

const getArgs = (url, name) => {
    let args = url.substring(name.length, url.length).split('/');
    if (args.length > 0) args.shift();
    return args;
};

const processError = (err, next) => {
    if (err instanceof e.HttpError)
        next(err);
    else
        next(e(makeApi.config.errors.exception.code, makeApi.config.errors.exception.message))
};

const makeCRUD = (app, obj, name) => {

    let escapedName = name // TODO: check which of these can be placed in url
        .replace(/\//g, '\\/')
        .replace(/\./g, '\\.')
        .replace(/\?/g, '\\?')
        .replace(/\$/g, '\\$')
        .replace(/\^/g, '\\^')
        .replace(/\*/g, '\\*');
    let urlRegex = new RegExp(`^${escapedName}(/.*)?$`);

    console.log(name);
    console.log(urlRegex);

    if (typeof obj.create === 'function')
    {
        console.log(`I created a neat app.post("${name}")`);
        app.post(name, (req, res, next) => {
            console.log(name + ' called');
            try
            {
                let result = obj.create(req.body);
                res.json(result);
            }
            catch (e) { processError(e, next); }
        });
    }

    if (typeof obj.read === 'function')
    {
        app.get(urlRegex, (req, res, next) => {
            let args = getArgs(req.path, name);
            try
            {
                let result = obj.read(...args);
                res.json(result);
            }
            catch (e) { processError(e, next); }
        });
    }

    if (typeof obj.update === 'function')
    {
        app.post(urlRegex, (req, res, next) => {
            let args = getArgs(req.path, name);
            try
            {
                let result = obj.update(args, req.body);
                res.json(result);
            }
            catch (e) { processError(e, next); }
        });
    }

    if (typeof obj.delete === 'function')
    {
        app.delete(urlRegex, (req, res, next) => {
            let args = getArgs(req.path, name);
            try
            {
                let result = obj.delete(args, req.body);
                res.json(result);
            }
            catch (e) { processError(e, next); }
        });
    }

    app.all(urlRegex, (req, res, next) => {
        next(new e(makeApi.config.errors.noMethod.code, makeApi.config.errors.noMethod.message));
    });
};

/**
 * Recursively creates REST api on application by given data object.
 * Object may have these properties:
 * ._name: string (required) - the name of collection, used to make up an api endpoint url
 * ._ignore = false: boolean - do not make api for this object (is not recursively)
 * These methods of data object will be taken into consideration and converted to api endpoints:
 * .read - get a single item of a collection, GET /name/:params
 * .create - create a single item, PUT /name (or) POST /name
 * .update - update existing single item, POST /name/:params
 * .delete - delete single item, DELETE /name
 * Each of these methods can have additional properties:
 * .method: string - overrides used method
 * .paramsRequired: number - how many parameters should be always specified
 * @param app express app object
 * @param apiObj object with specified methods
 * @param prefix the prefix for all of api endpoints
 */

const prohibitedKeys = ['create', 'read', 'update', 'delete', '_name', '_ignore'];
let makeApi = (app, apiObj, prefix = '') => {
    for (let key in apiObj)
    {
        if (!apiObj.hasOwnProperty(key)) continue;
        if (prohibitedKeys.indexOf(key) != -1) continue;
        if (typeof apiObj[key] === typeof {})
        {
            makeApi(app, apiObj[key], prefix + '/' + apiObj._name);
        }
    }

    if (apiObj._name && !apiObj._ignore)
        makeCRUD(app, apiObj, prefix + '/' + apiObj._name);
};

makeApi.config = {
    errors: {
        noMethod: { code: 501, message: 'Requested resource does not support this method' },
        exception: { code: 500, message: 'Internal error occured' }
    },

    debugMode: false
};

module.exports = makeApi;
