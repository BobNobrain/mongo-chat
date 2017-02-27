module.exports = app => {
    app.get('/api/articles', function(req, res)
    {
        res.send('This is not implemented now');
    });

    app.post('/api/articles', function(req, res)
    {
        res.send('This is not implemented now');
    });

    app.get('/api/articles/:id', function(req, res)
    {
        res.send('This is not implemented now');
    });

    app.put('/api/articles/:id', function (req, res)
    {
        res.send('This is not implemented now');
    });

    app.delete('/api/articles/:id', function (req, res)
    {
        res.send('This is not implemented now');
    });
};
