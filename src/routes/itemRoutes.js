var express = require('express');
var app = express();
// itemRouter Module
var itemRouter = express.Router();

// Require Item model in our routes module
var Item = require('../models/Item');

// Defined Add route (addItem)
itemRouter.route('/add').get(function (req, res) {
    res.render('addItem');
});

// Defined store route (save item/data)
itemRouter.route('/add/post').post(function (req, res) {
    var item = new Item(req.body);
    item.save()
        .then(item => {
            res.redirect('/items');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

// Defined get data(index or listing) route (aka retrieve stored data)
itemRouter.route('/').get(function (req, res) {
    Item.find(function (err, itms) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('items', { itms: itms });
        }
    });
});

// Defined edit data route
itemRouter.route('/edit/:id').get(function (req, res) {
    var id = req.params.id;
    Item.findById(id, function (err, item) {
        res.render('editItem', { item: item });
    });
});

//  Defined update data route
itemRouter.route('/update/:id').post(function (req, res) {
    Item.findById(req.params.id, function (err, item) {
        if (!item)
            return next(new Error('Could not load Document'));
        else {
            // do your updates here
            item.item = req.body.item;

            item.save().then(item => {
                res.redirect('/items');
            })
                .catch(err => {
                    res.status(400).send("unable to update the database");
                });
        }
    });
});

// Defined delete data | remove data | destroy data route
itemRouter.route('/delete/:id').get(function (req, res) {
    Item.findByIdAndRemove({ _id: req.params.id },
        function (err, item) {
            if (err) res.json(err);
            else res.redirect('/items');
        });
});

// Export itemRouter Module
module.exports = itemRouter;