var admin = require("firebase-admin");
var db = admin.firestore();
var date = require("../common/date");

//Create new ad
exports.create = (req, res) => {
    // Create a ad

    let ad = {
        user_id     : req.body.user_id,
        title       : req.body.title, 
        price       : req.body.price,
        description : req.body.description,
        city        : req.body.city,
        no          : req.body.no,
        approve     : req.body.approve,
        create_at   : date.getDate(),
        update_at   : date.getDate()
    }

    // Save ad in the database
    var doc = db.collection("ads").doc();
    ad.id = doc.id;
    
    doc.set(ad)
    .then(data => {
        res.json(ad);
    }).catch(err => {
        return res.status(500).json({
            message: err.message || "Something wrong while creating the ad."
        });
    });
};


// Retrieve all ads from the database.
exports.findAll = async (req, res) => {
    
    let ads = [];
    
    const adSnaps = await db.collection('ads').get();

    adSnaps.forEach((adDoc) => {
        ad = adDoc.data();
        ads.push(ad);
    });

    res.json(ads);
};

// Find a single ad with a ad_id
exports.findOne = async (req, res) => {

    const adSnaps = await db.collection('ads').where('id', '==', req.params.id).get();

    adSnaps.forEach((adDoc) => {
        ad = adDoc.data();
        res.json(ad);
    });

};

exports.findAllByUserId = async (req, res) => {
    
    let ads = [];
    
    const adSnaps = await db.collection('ads').where('user_id', '==', req.params.user_id).get();

    adSnaps.forEach((adDoc) => {
        ad = adDoc.data();
        ads.push(ad);
    });

    res.json(ads);

};

// Update a ad
exports.update = (req, res) => {
    // Find and update ad with the request body
    if (!req.params.id) {  // new
        var doc = db.collection("ads").doc();
        ad.id = doc.id;
        doc.set(ad);
    } else {               // update
        var ad = {}
        ad[req.body.fname] = req.body.fvalue;
        var doc = db.collection("ads").doc(req.params.id);
        doc.update(ad)
    }
};

// Delete a Ad with the specified id in the request
exports.delete = (req, res) => {
    db.collection('ads').doc(req.params.id).delete()
    .then(ad => {
        if(!ad) {
            return res.status(404).send({
                message: "Ad not found with id " + req.params.id
            });
        }
        return res.send({message: "Ad deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Ad not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete ad with id " + req.params.id
        });
    });
};
