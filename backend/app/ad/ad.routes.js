module.exports = (app) => {
    const ads = require('./ad.controller');

    // Create a new Ad
    app.post('/ads', ads.create);
    
    // Retrieve all Ads
    app.get('/ads', ads.findAll);

    // Retrieve a single Ad with id
    app.get('/ads/:id', ads.findOne);

    // Retrieve a single Ad with id
    app.get('/ads/userid/:user_id', ads.findAllByUserId);

    // Update a Ad with id
    app.put('/ads/:id', ads.update);

    // Delete a Ad with id
    app.delete('/ads/:id', ads.delete);
}