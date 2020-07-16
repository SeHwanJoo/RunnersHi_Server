const rankingModel = require("../models/rankingModel");
const recordModel = require("../models/recordModel");

const ranking = {
  runner: async(req, res, next) => {
    try{
      const result = await rankingModel.runner();
      return next(result);
    } catch(error){
      return next(error);
    }
  },

  winner: async(req, res, next) => {
    try{
      const result = await rankingModel.winner();
      return next(result);
    } catch(error){
      return next(error);
    }
  },

  loser: async(req, res, next) => {
    try{
      const result = await rankingModel.loser();
      return next(result);
    } catch(error){
      return next(error);
    }
  },

  getDetailProfile: async(req, res, next) => {
    const user_idx = req.params.user_idx;
    let final_data = {};

    if(user_idx === undefined) 
      return next("NO_EXIST_PARAMETER");

    try{
      const user_data = await rankingModel.getDetailProfile(user_idx);

      if(user_data.nickname === null)
        return next("WRONG_PARM");

      const recentrecord = await recordModel.getUserRecentRecord(user_idx);
      const badge = await recordModel.getBadge(user_idx);

      const pace_data = await recordModel.getPace(recentrecord[0].time, recentrecord[0].distance);

      if(recentrecord === null || badge === null) 
       return next();

      final_data = user_data;
      final_data.distance = recentrecord[0].distance;
      final_data.time = recentrecord[0].time;
      final_data.pace_minute = pace_data.pace_minute;
      final_data.pace_second = pace_data.pace_second;
      final_data.badge = badge.badge;

      return next({code : "RUNNER_DETAIL_PROFILE_SUCCESS", result : final_data});
    } catch(error){
      return next(error);
    }
  },

   getOpponentRecent: async(req, res, next) => {
     const user_idx = req.params.user_idx;
    
    try{
      const result = await recordModel.getUserRecentRecord(user_idx);

      if(result.nickname === null)
        return next("WRONG_PARM");
        

      const final_data = {
        distance: result[0].distance,
        pace : result[0].pace,
        time : result[0].time
      }
      return next({code: "GET_RECENT_RECORD_SUCCESS", result: final_data});


    } catch(error){
      return next(error);
    }
  }
};

module.exports = ranking;