const mongoose = require('mongoose');
const User = require('user/models/user.model');
const perPage = config.PAGINATION_PERPAGE;

const userRepository = {
    fineOneWithRole: async (params) => {
        try {
            
            let user = await User.findOne({
                $or:[
                    {"email": params.username},
                    {"phone": params.username},
                ],
                "isDeleted": false,
                "isActive": true
            }).populate('role').exec();

            if (_.isNull(user)) {
                return {
                    "status": 500,
                    data: null,
                    "message": 'Authentication failed. User not found.'
                }
            }

            if (!user.validPassword(params.password, user.password)) {
                return {
                    "status": 500,
                    data: null,
                    "message": 'Authentication failed. Wrong password.'
                }
            } else {
                return {
                    "status": 200,
                    data: user,
                    "message": ""
                }
            }
        } catch (e) {
            throw e;
        }

    },

    getAllUsers: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({
                "isDeleted": false
            });
            and_clauses.push({
                "user_role.role": { $eq: "user" }
            });

            if(_.has(req.body,'user_type')){
                and_clauses.push({
                    "user_type": req.body.user_type
                });
            }

            if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'first_name': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } },
                        { 'last_name': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } },
                        { 'full_name': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } },                        
                        { 'email': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } },
                        { 'phone': { $regex: req.body.query.generalSearch.trim(), $options: 'i' } }                       
                    ]
                });
            }
            
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                and_clauses.push({ "isActive": req.body.query.Status == 'Active' ? true : false });
                
            }else if (!_.isEmpty(req.body.query_status) && !_.isUndefined(req.body.query_status) && _.has(req.body, 'query_status')) {
                and_clauses.push({ "isActive": req.body.query_status == 'active' ? true : false });
            }           


            conditions['$and'] = and_clauses;

            var sortOperator = {
                "$sort": {}
            };
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

            var aggregate = User.aggregate([{
                    $lookup: {
                        "from": "roles",
                        "localField": "role",
                        "foreignField": "_id",
                        "as": "user_role"
                    }
                },
                {
                    "$unwind": "$user_role"
                },
                {
                    $addFields:{
                        "full_name": { $concat: [ "$first_name", " ", "$last_name" ] }
                    }
                },
                {
                    $match: conditions
                },
                sortOperator
            ]);
           

            var options = {
                page: req.body.pagination.page,
                limit: req.body.pagination.perpage
            };

            
            let allUsers = await User.aggregatePaginate(aggregate, options);
            

            return allUsers;
        } catch (e) {
            throw (e);
        }
    },

    getById: async (id) => {
        
        try {
            let user = await User.findById(id).lean().exec();

            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getUserById: async (id) => {
        
        try {
            let user = await User.findById(id).exec();

            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getByField: async (params) => {
        
        try {
            let user = await User.findOne(params).lean().exec();

            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getAllByField: async (params) => {
        
        try {
            let user = await User.find(params).lean().exec();

            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getLimitUserByField: async (params) => {
        
        try {
            let user = await User.find(params).populate('role').limit(5).sort({
                _id: -1
            }).exec();

            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },



    delete: async (id) => {
        try {
            let user = await User.findById(id);
            if (user) {
                let userDelete = await User.remove({
                    _id: id
                }).exec();
                if (!userDelete) {
                    return null;
                }
                return userDelete;
            }
        } catch (e) {
            throw e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },

	updateById: async (data, id) => {
		try {
            let user = await User.findByIdAndUpdate(id, data, {new: true});
			if (!user) {
				return null;
			}
			return user;
		}
		catch (e) {
			throw e;
		}
	},

    updateByField: async (field, fieldValue, data) => {
        try {
            let user = await User.findByIdAndUpdate(fieldValue, field, {
                new: true
            });
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    save: async (data) => {
        try {
            let user = await User.create(data);

            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    forgotPassword: async (params) => {
        try {
            let user = await User.findOne({
                email: params.email_p_c
            }).exec();
            if (!user) {
                return null;
            } else if (user) {

                let random_pass = Math.random().toString(36).substr(2, 9);
                let readable_pass = random_pass;
                random_pass = user.generateHash(random_pass);

                let user_details = await User.findByIdAndUpdate(user._id, {
                    password: random_pass
                }).exec();
                if (!user_details) {
                    return null;
                }
                return readable_pass;

            }

        } catch (e) {
            throw e;
        }
    },

    getUser: async (id) => {
        try {
            let user = await User.findOne({
                id
            }).exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    getUserByField: async (data) => {
        try {
            let user = await User.findOne(data).populate('role').exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    getUsersCount: async (req) => {
        try {
            var conditions = {
                'isActive': true
            };
            var and_clauses = [];

            and_clauses.push({
                "isDeleted": false
            });
            and_clauses.push({
                "user_role.role": {
                    "$ne": "admin"
                }
            });

            conditions['$and'] = and_clauses;
            let users = await User.aggregate([{
                    "$lookup": {
                        "from": "roles",
                        "localField": "role",
                        "foreignField": "_id",
                        "as": "user_role"
                    },
                },
                {
                    $unwind: "$user_role"
                },
                {
                    $match: conditions
                },
                {
                    $group: {
                        _id: "$user_role._id",
                        name: {
                            $first: "$user_role.role"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    "$sort": {
                        _id: 1
                    }
                },
            ]).exec();
            return users;
        } catch (e) {
            throw (e);
        }
    },

    getCount: async (params) => {
        try {
            let recordCount = await User.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            throw e;
        }
    },

    checkValidUserName: async (params) => {
        try {
            let user = await User.findOne({
                $or:[
                    {"email": params.username},
                    {"phone": params.username},
                ],
                "role":params.role_id,
                "isDeleted": false,
                "isActive": true
            }).exec();

            if (_.isNull(user)) {
                return null;
            }
            else {
                return user;
            }
        } catch (e) {
            throw e;
        }
    },
    getUserDetailById: async (id) => {
        
        try {
            let user = await User.findOne({"_id":id},{first_name:1, last_name:1, email:1,phone:1, user_type:1}).exec();

            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },
};

module.exports = userRepository;