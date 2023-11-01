const mongoose = require('mongoose');
const Contact_us = require('../model/contact_us.model');
const perPage = config.PAGINATION_PERPAGE;

const contact_usRepository = {

    getAll: async (req) => {
        
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({ "isDeleted": false });

            if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'email': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        { 'message': { $regex: req.body.query.generalSearch, $options: 'i' } }
                       
                    ]
                });
            }
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                and_clauses.push({ "status": req.body.query.Status });
            }
            conditions['$and'] = and_clauses;
            
            var sortOperator = { "$sort": {} };
            if (_.has(req.body, 'sort')) {
                var sortField = req.body.sort.field;
                if (req.body.sort.sort == 'desc') {
                    var sortOrder = -1;
                } else if (req.body.sort.sort == 'asc') {
                    var sortOrder = 1;
                }

                sortOperator["$sort"][sortField] = sortOrder;
            } else {
                sortOperator["$sort"]['_id'] = -1;
            }

            var aggregate =  Contact_us.aggregate([
               { $project: {
                    _id : "$_id",
                    name: "$name",                    
                    email: "$email",                    
                    phone: "$phone",                    
                    message: "$message",                    
                    status : "$status",
                    isDeleted : "$isDeleted"
                }
            },
                { $match: conditions },
                sortOperator
            ]);
            
            var options = { page: req.body.pagination.page, limit: req.body.pagination.perpage };
            let allrecords = await Contact_us.aggregatePaginate(aggregate, options);
            
            return allrecords;
        } catch (e) {
            throw (e);
        }
    },

    getById: async (id) => {
        
        try {
            let record = await Contact_us.findById(id).exec();
            
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },
    save: async (data) => {
        try {
            let save = await Contact_us.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            return e;
        }
    },
    getByField: async (params) => {
        
        try {
            let record = await Contact_us.findOne(params).exec();

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getAllByField: async (params) => {
        
        try {
            let record = await User.find(params).exec();

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getCmsCount: async (params) => {
        try {
            let recordCount = await Contact_us.countDocuments(params);
            if (!recordCount) {
                return null;
            }
            return recordCount;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let record = await Contact_us.findById(id);
            if (record) {
                let recordDelete = await Contact_us.remove({ _id: id }).exec();
                if (!recordDelete) {
                    return null;
                }
                return recordDelete;
            }
        } catch (e) {
            throw e;
        }
    },
    
    updateById: async (data, id) => {
        try {
            let record = await Contact_us.findByIdAndUpdate(id, data, { new: true, upsert: true }).exec();
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    },

};

module.exports = contact_usRepository;