const admin        = require('firebase-admin');
const date         = require('../common/date');
const db           = admin.firestore();

//Create new billinginfo
exports.create = () => {

    // Create a billinginfo
    let billinginfo = {
        country         : '',
        city            : '',
        address         : '',
        mobile          : '',
        email           : '',
        create_at       : date.getDate(),
        update_at       : date.getDate()
    }

    // Save billinginfo in the database
    var doc = db.collection("billinginfos").doc();
    billinginfo.id = doc.id;
    
    return new Promise(function(resolve, reject) {
        doc.set(billinginfo)
        .then(data => {
            resolve(billinginfo);
        }).catch(err => {
            reject(err);
        });
    })

    
};

// Retrieve all billinginfos from the database.
exports.findAll = (req, res) => {
    
    db.collection('billinginfos').get()
        .then((snapshot) => {
            let billinginfos = [];
            snapshot.forEach((doc) => {
                billinginfos.push(doc.data());
            });
            res.json(billinginfos);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Something wrong while retrieving billinginfos."
            });
        });
};

// Find a single billinginfo with a billinginfo id
exports.findOne = (req, res) => {

    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "BillingInfo content can not be empty"
        });
    }
    
    db.collection('billinginfos').doc(req.params.id).get()
        .then((doc) => {
            let billinginfo = doc.data();
            res.json(billinginfo);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Something wrong while retrieving billinginfo with id."
            });
        });     
};

// Update a billinginfo with a billinginfo id
exports.update2 = (req, res) => {
    
    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "BillingInfo content can not be empty"
        });
    }

    let billinginfo = req.body;
    billinginfo.password = bcrypt.hashSync(billinginfo.password, 10);

    var doc = db.collection("billinginfos").doc(req.params.id);
    doc.update(billinginfo)
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "BillingInfo not found with id " + req.params.id
                });
            }
            res.send({message: "BillingInfo updated successfully!"});
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Could not delete billinginfo with id " + req.params.id
            });
        });
};

// Update a billinginfo with a field name
exports.update = (req, res) => {
    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "BillingInfo content can not be empty"
        });
    }

    let billinginfo = {}
    billinginfo[req.body.fname] = req.body.fvalue;

    var doc = db.collection("billinginfos").doc(req.params.id);
    doc.update(billinginfo)
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "BillingInfo not found with id " + req.params.id
                });
            }
            res.send({message: "BillingInfo updated successfully!"});
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Could not delete billinginfo with id " + req.params.id
            });
        });
};

// Delete a billinginfo with a billinginfo id in the request
exports.delete = (req, res) => {

    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "BillingInfo content can not be empty"
        });
    }

    db.collection('billinginfos').doc(req.params.id).delete()
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "BillingInfo not found with id " + req.params.id
                });
            }
            res.send({message: "BillingInfo deleted successfully!"});
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Could not delete billinginfo with id " + req.params.id
            });
        });

};
