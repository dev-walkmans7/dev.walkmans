const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const contactController = require('../../modules/contact_us/controller/contact_us.controller');

const multer = require('multer');
const request_param = multer();

//authentication section of cms
namedRouter.all('/contact*', auth.authenticate);

// admin cms list route
namedRouter.get("contact.list", '/contact/list', contactController.list);
namedRouter.post("contact.getall", '/contact/getall', async (req, res) => {
    try {
        const success = await contactController.getAll(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});
/*@Route:  cms  Edit*/
namedRouter.get("contact.detail", '/contact/detail/:id', contactController.edit);



//Export the express.Router() instance
module.exports = router;