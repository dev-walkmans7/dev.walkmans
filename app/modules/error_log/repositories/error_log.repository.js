const mongoose = require("mongoose");
const ErrorLog = require("error_log/models/error_log.model");
const perPage = config.PAGINATION_PERPAGE;

const ErrorLogRepository = {
  
  save: async (data) => {
    try {
      let save = await ErrorLog.create(data);
      if (!save) {
        return null;
      }
      return save;
    } catch (e) {
      throw e;
    }
  },

};

module.exports = ErrorLogRepository;
