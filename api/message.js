let e = require('http-errors');

// quick in-memory db
let db = {};
let increment = 0;

let findOrThrow = (id) => {
    if (id > increment || id <= 0)
        throw new e.NotFound();

    if (typeof +id !== typeof 0)
        throw new e.BadRequest();

    if (!(id in db))
        throw new e.NotFound();
};

let message = {
    _name: 'message',

    create: ({ text }) => {
        let id = ++increment;
        db[id] = {
            text,
            attachments: [],
            id: id
        };
        return {
            success: true,
            id
        }
    },

    read: (id) => {
        if (id === void 0)
        {
            // read with no id is list
            return Object.keys(db).map(id => db[id]);
        }
        findOrThrow(id);

        return db[id];
    },

    update: ([id], {text}) => {
        findOrThrow(id);

        db[id].text = text;

        return { success: true, id }
    },

    delete: ([id]) => {
        findOrThrow(id);

        delete db[id];

        return { success: true, id }
    }
};

module.exports = message;
