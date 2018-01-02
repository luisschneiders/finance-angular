const fs = require('fs');
const clientSideFile = './settings/client-side.json';
/**
 * GET /settings
 */
exports.settingsGet = function(req, res) {
  fs.exists(clientSideFile, function(exists) {
    if(!exists) {
      res.json('No settings found!');
      return;
    }
    fs.readFile(clientSideFile, 'utf8', function(err, contents) {
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
