const mongoose = require('mongoose');
const userModel = mongoose.model('User');
// const errorLogRepo = require("error_log/repositories/error_log.repository");
// const categoryRepo= require("category/repositories/category.repository");
// const postRepo = require("post/repositories/post.repository");
var moment = require('moment');
const slugify = require('slugify');
class Helper {
	constructor() {
		
	}
	
	async isEmailAvailable(email){
		let emailAvailable = userModel.findOne({email:email});
		if(emailAvailable){
			return true;
		}
		else{
			return false;
		}
	}
	
	async getDate(){
		return (new Date()).toISOString().substring(0, 10) ;
	}
	
	async getRandomString(text){
		return text + Math.floor((Math.random() * 100000) + 1);
	}
	
	async getRandomInt(){
		return Math.floor((Math.random() * 100000) + 1);
	}
	
	async getRandomAmount(){
		let amount = ((Math.random() * 100) + 1).toFixed(2);
		return amount;
	}
	
	async generateUniqueOrderNumber(length){
		const obj = {
			'length': parseInt(length),
			'chars': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
		};
		const uniqueNumber = await randomString(obj);
		const orderDet = orderRepo.getByField({
			'order_no': uniqueNumber.toString()
		});
		if (_.isEmpty(orderDet)) {
			return uniqueNumber;
		}
		else {
			return generateUniqueOrderNumber();
		}
	}
	
	async randomString(req){
		var result = '';
		for (var i = req.length; i > 0; --i)
			result += req.chars[Math.round(Math.random() * (req.chars.length - 1))];
		return result;
	}

// 	//Store Error
// 	async storeError(param){
// 		try{			
// 			var addObj = {
// 				"api_url": param.api_url,
// 				"error_msg": param.error_msg
// 			}		
// 			await errorLogRepo.save(addObj);
// 			return true;
// 		}
// 		catch(e){
// 			console.log("storeError err: ",e.message);
// 			return false;
// 		}
// 	}

// //  post slug
// 	async createNewPostSlug (slug,attempt) {
// 		try{			
						
// 			var exp_slug = slug;
// 			if(attempt>0){
// 				exp_slug = slug+attempt.toString();
// 			}
// 			var chkQuery = {
// 				"slug": { $regex: '^'+exp_slug.trim()+'$', $options: 'i' }
// 			};
// 			let userData = await postRepo.getByField(chkQuery);
// 			if (_.isEmpty(userData) || _.isNull(userData)) {
// 				return exp_slug;
// 			}
// 			else{
// 				attempt++;
// 				let nwStr = await this.createNewPostSlug (slug,attempt);
// 				return nwStr;
// 			}			
// 		}
// 		catch(e){
// 			throw(e);
// 		}
// 	}

// 	async generateNewPostSlug(str){
// 		try{
// 			var new_str = slugify(str, {
// 				replacement: '-',  // replace spaces with replacement character, defaults to `-`
// 				remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
// 				lower: true,      // convert to lower case, defaults to `false`
// 				strict: false,     // strip special characters except replacement, defaults to `false`			
// 			})
			
// 			let uname = await this.createNewPostSlug (new_str,0);
// 			return uname;
// 		}
// 		catch(e){
// 			throw e;
// 		}
// 	}

// 	async createUpdatedPostSlug (slug,exp_id,attempt) {
// 		try{			
						
// 			var exp_slug = slug;
// 			if(attempt>0){
// 				exp_slug = slug+attempt.toString();
// 			}
// 			var chkQuery = {
// 				"slug": { $regex: '^'+exp_slug.trim()+'$', $options: 'i' },
// 				"_id": { $ne: mongoose.Types.ObjectId(exp_id) }
// 			};
// 			let userData = await postRepo.getByField(chkQuery);
// 			if (_.isEmpty(userData) || _.isNull(userData)) {
// 				return exp_slug;
// 			}
// 			else{
// 				attempt++;
// 				let nwStr = await this.createUpdatedPostSlug (slug,exp_id,attempt);
// 				return nwStr;
// 			}			
// 		}
// 		catch(e){
// 			throw(e);
// 		}
// 	}

// 	async generateUpdatedPostSlug(str,exp_id){
// 		try{
// 			var new_str = slugify(str, {
// 				replacement: '-',  // replace spaces with replacement character, defaults to `-`
// 				remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
// 				lower: true,      // convert to lower case, defaults to `false`
// 				strict: false,     // strip special characters except replacement, defaults to `false`			
// 			})
			
// 			let uname = await this.createUpdatedPostSlug (new_str,exp_id,0);
// 			return uname;
// 		}
// 		catch(e){
// 			throw(e);
// 		}
// 	}

// 	// category slug
// 	async createNewCategorySlug (slug,attempt) {
// 		try{			
						
// 			var exp_slug = slug;
// 			if(attempt>0){
// 				exp_slug = slug+attempt.toString();
// 			}
// 			var chkQuery = {
// 				"slug": { $regex: '^'+exp_slug.trim()+'$', $options: 'i' }
// 			};
// 			let userData = await categoryRepo.getByField(chkQuery);
// 			if (_.isEmpty(userData) || _.isNull(userData)) {
// 				return exp_slug;
// 			}
// 			else{
// 				attempt++;
// 				let nwStr = await this.createNewCategorySlug (slug,attempt);
// 				return nwStr;
// 			}			
// 		}
// 		catch(e){
// 			throw(e);
// 		}
// 	}

// 	async generateNewCategorySlug(str){
// 		try{
// 			var new_str = slugify(str, {
// 				replacement: '-',  // replace spaces with replacement character, defaults to `-`
// 				remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
// 				lower: true,      // convert to lower case, defaults to `false`
// 				strict: false,     // strip special characters except replacement, defaults to `false`			
// 			})
			
// 			let uname = await this.createNewCategorySlug (new_str,0);
// 			return uname;
// 		}
// 		catch(e){
// 			throw e;
// 		}
// 	}

// 	async createUpdatedCategorySlug (slug,exp_id,attempt) {
// 		try{			
						
// 			var exp_slug = slug;
// 			if(attempt>0){
// 				exp_slug = slug+attempt.toString();
// 			}
// 			var chkQuery = {
// 				"slug": { $regex: '^'+exp_slug.trim()+'$', $options: 'i' },
// 				"_id": { $ne: mongoose.Types.ObjectId(exp_id) }
// 			};
// 			let userData = await categoryRepo.getByField(chkQuery);
// 			if (_.isEmpty(userData) || _.isNull(userData)) {
// 				return exp_slug;
// 			}
// 			else{
// 				attempt++;
// 				let nwStr = await this.createUpdatedCategorySlug (slug,exp_id,attempt);
// 				return nwStr;
// 			}			
// 		}
// 		catch(e){
// 			throw(e);
// 		}
// 	}

// 	async generateCategoryUpdatedSlug(str,exp_id){
// 		try{
// 			var new_str = slugify(str, {
// 				replacement: '-',  // replace spaces with replacement character, defaults to `-`
// 				remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
// 				lower: true,      // convert to lower case, defaults to `false`
// 				strict: false,     // strip special characters except replacement, defaults to `false`			
// 			})
			
// 			let uname = await this.createUpdatedCategorySlug (new_str,exp_id,0);
// 			return uname;
// 		}
// 		catch(e){
// 			throw(e);
// 		}
	// }
}

module.exports = new Helper();

