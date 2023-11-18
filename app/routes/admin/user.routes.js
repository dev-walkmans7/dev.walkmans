const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const userController = require('user/controllers/user.controller');

const Storage = multer.diskStorage({
	destination: (req, file, callback) => {
		if (file.fieldname === 'profile_pic') {
			callback(null, "./public/uploads/user/profile_pic")
		} else {
			callback(null, "./public/uploads/user");
		}
	},
	filename: (req, file, callback) => {
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
	}
});

const uploadFile = multer({
	storage: Storage
});
const request_param = multer();

// 

// login render route
namedRouter.get('user.login', '/', userController.login);

// login process route
namedRouter.post("user.login.process", '/login', request_param.any(), userController.signin);

namedRouter.post('user.forgot.password.process', '/user/forgot/password', request_param.any(), userController.forgotPassword);

namedRouter.get('user.logout', "/logout", userController.logout);
namedRouter.all('/*', auth.authenticate);

/*
// @Route: Users Dashboard [Admin]
*/
// dashboard route
namedRouter.get("user.dashboard", '/dashboard', userController.dashboard);

namedRouter.get("admin.profile", '/profile', request_param.any(), userController.viewmyprofile);

// admin update profile
namedRouter.post("admin.update.profile", '/update/profile', uploadFile.any(), userController.updateProfile);

// admin change Password
namedRouter.get("admin.changepassword", '/change/password', userController.adminChangePassword);

/*
// @Route: Chnage password [Admin] action
*/
namedRouter.post("admin.updateAdminPassword", '/update/admin-password', request_param.any(), userController.adminUpdatePassword);


// User List
namedRouter.get("user.list", '/user/list', userController.userList);


// Get All User
namedRouter.post("user.getall", '/user/getall', async (req, res) => {
	try {
		const success = await userController.getAllUser(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

// User add
namedRouter.get("user.add", '/user/add', userController.addUser);
// User insert
namedRouter.post("user.insert", '/user/insert', request_param.any(), userController.saveUser);

// User Edit Route
namedRouter.get("user.edit", "/user/edit/:id", userController.editUser);

// User Update Route
namedRouter.post("user.update", '/user/update', request_param.any(), userController.updateUser);

// User Status change
namedRouter.get("user.status-change", '/user/status-change/:id', request_param.any(), userController.userStatusChange);

// User Delete
namedRouter.get("user.delete", '/user/delete/:id', userController.deleteUser);



// Client List
namedRouter.get("user.client.list", '/user/client/list', userController.clientList);

// Get All Clients
namedRouter.post("user.client.getall", '/user/client/getall', async (req, res) => {
	try {
		const success = await userController.getAllClient(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});
// Client add
namedRouter.get("user.client.add", '/user/client/add', userController.addUserClient);

// Client insert
namedRouter.post("user.client.insert", '/user/client/insert', request_param.any(), userController.saveUserClient);
// Client mail send page view
namedRouter.get("user.client.view", '/user/client/view/:id', userController.clientView);
// client send mail
namedRouter.post("user.client.send", '/user/client/send', request_param.any(), userController.UserClientsendMail);
// Client Edit Route
namedRouter.get("user.client.edit", "/user/client/edit/:id", userController.editUserClient);

// Client Update Route
namedRouter.post("user.client.update", '/user/client/update', request_param.any(), userController.updateUserClient);

// Client Status change
namedRouter.get("user.client.status-change", '/user/client/status-change/:id', request_param.any(), userController.userClientStatusChange);

// User Delete
namedRouter.get("user.client.delete", '/user/client/delete/:id', userController.deleteUserClient);







// Cleaner List
namedRouter.get("user.cleaner.list", '/user/cleaner/list', userController.cleanerList);

// Get All Cleaners 
namedRouter.post("user.cleaner.getall", '/user/cleaner/getall', async (req, res) => {
	try {
		const success = await userController.getAllCleaner(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});
// User  cleaner add
namedRouter.get("user.cleaner.add", '/user/cleaner/add', userController.addUserCleaner);

// Cleaner insert
namedRouter.post("user.cleaner.insert", '/user/cleaner/insert', request_param.any(), userController.saveUserCleaner);

// Cleaner mail send page view
namedRouter.get("user.cleaner.view", '/user/cleaner/view/:id', userController.cleanerView);

// Cleaner send mail
namedRouter.post("user.cleaner.send", '/user/cleaner/send', request_param.any(), userController.UserCleanerMailsend);

// Cleaner Edit Route
namedRouter.get("user.cleaner.edit", "/user/cleaner/edit/:id", userController.editUserCleaner);

// Cleaner Update Route
namedRouter.post("user.cleaner.update", '/user/cleaner/update', request_param.any(), userController.updateUserCleaner);

// // Cleaner Status change
namedRouter.get("user.cleaner.status-change", '/user/cleaner/status-change/:id', request_param.any(), userController.userCleanerStatusChange);

// Cleaner Delete
namedRouter.get("user.cleaner.delete", '/user/cleaner/delete/:id', userController.deleteUserCleaner);


// Export the express.Router() instance
module.exports = router;