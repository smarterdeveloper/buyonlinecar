module.exports = (app) => {
    const billinginfos = require('./billinginfo.controller');

    // Retrieve all BillingInfos
    app.get('/billinginfos', billinginfos.findAll);

    // Retrieve a single BillingInfo with id
    app.get('/billinginfos/:id', billinginfos.findOne);

    // Update a BillingInfo with id
    app.put('/billinginfos/:id', billinginfos.update);
}