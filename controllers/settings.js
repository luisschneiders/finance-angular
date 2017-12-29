const fs = require('fs');
const fileName = './settings/app.json';
/**
 * GET /settings
 */
exports.settingsGet = function(req, res) {
  fs.exists(fileName, function(exists) {
    if(!exists) {
      res.json('No settings found!');
      return;
    }
    fs.readFile(fileName, 'utf8', function(err, contents) {
      try{
        if (err) {
          res.json(err);
          return;
        }
        res.json(JSON.parse(contents));
      }catch(err){
        res.json(err);
      }
    });
  });
};
