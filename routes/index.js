import path from 'path';
import express from 'express';
import util from 'util';
import formidable from 'formidable';
import fs from 'fs';
import parser from '../utils/Parser';
const router = express.Router();

router.post('/upload', (req, res, next) => {
  let filePath = null;
  let fileName = null;
  const timeStart = new Date().getTime();

  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../uploads');
  form.on('file', function(field, file) {
  	filePath = file.path;
    fileName = file.name;
  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
  	if (filePath) {
      try{
  	  	parser.parseCsv(filePath, (err, data) => {
          if (err) throw err;
          const time = (new Date().getTime()) - timeStart;
          GLOBAL.exectime.push({fileName, time});
          if (GLOBAL.exectime>10) GLOBAL.exectime.shift();
          return res.json(data);
        });
      } catch (err) {
        res.setStatus(500);
        res.end(err);
      }
	  }
	  else res.end('the file wasn\'t parsed');
  });

  form.parse(req);
});

router.get('/metric', (req, res, next) => {
  return res.json({usage: GLOBAL.usage, time: GLOBAL.exectime});
});

/* GET home page. */
router.get('/*', (req, res, next) => {
	return res.sendFile(path.join(__dirname, '../bin/index.html'));
});

export default router;
