const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ['Active', 'Inactive'];
const bools = [true,false]

const contactUsSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, default: 'Active', enum: status },
  isDeleted: { type: Boolean, default: false, enum: bools },
}, { timestamps: true, versionKey: false });

// For pagination
contactUsSchema.plugin(mongooseAggregatePaginate);


module.exports = mongoose.model('Contact-Us', contactUsSchema);