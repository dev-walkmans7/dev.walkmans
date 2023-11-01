const contact_usRepo = require("../repository/contact_us.repository");
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');



class contactUsController {
    constructor() {
        this.contactUs = [];
    }

    /*
    // @Method: view 
    // @Description: show contact details 
    */
    async edit(req, res) {
        try {
            let result = {};
            let contact = await contact_usRepo.getById(req.params.id);
            if (!_.isEmpty(contact)) {
                result.contact_data = contact;
                res.render('contact_us/views/detail.ejs', {
                    page_name: 'contact-management',
                    page_title: 'Contact Details',
                    user: req.user,
                    response: result
                });
            } else {
                req.flash('error', "Sorry Contact not found!");
                res.redirect(namedRouter.urlFor('contact.list'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

   


    /* @Method: list
    // @Description: To get all the users from DB
    */
    async list(req, res) {
        try {
            res.render('contact_us/views/list.ejs', {
                page_name: 'contact-management',
                page_title: 'Contact List',
                user: req.user,
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };


    async getAll(req, res) {
        try {
            let contact = await contact_usRepo.getAll(req);

            if (_.has(req.body, 'sort')) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = '_id';
            }
            let meta = {
                "page": req.body.pagination.page,
                "pages": contact.pages,
                "perpage": req.body.pagination.perpage,
                "total": contact.total,
                "sort": sortOrder,
                "field": sortField
            };
            return {
                status: 200,
                meta: meta,
                data: contact.docs,
                message: `Data fetched succesfully.`
            };
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    }

}

module.exports = new contactUsController();