import csv from 'csv-parser';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';

class Parser{

	getType(str){
		if ((Number.parseFloat(str)).toString() !== 'NaN' && str.indexOf('.') === str.lastIndexOf('.')) return 'Number';
		if ((new Date(str)).toString() !== 'Invalid Date') return 'Date';
		if (str === 'true' || str === 'false') return 'Boolean';
		return 'String';
	}

	calcColumn(value, col){
		if (value || value === 0) {
			col.count++;
			col.keys[value] = null;
			if (col.colType) col.colType = this.getType(value);
		}
	}

	checkLimits(timeStart) {
		const time = (new Date().getTime()) - timeStart;
		if(process.env.CSVTEST_MAX_TIME && time>process.env.CSVTEST_MAX_TIME)
			return 'The maximum time for analysing the file is exceeded';
		if(process.env.CSVTEST_MAX_MEMORY) {
			const used = process.memoryUsage().heapUsed;
			if(used > process.env.CSVTEST_MAX_MEMORY)
				return 'The maximum memory for analysing the file is exceeded';
		}
		return null;
	}

	parseCsv(fileInfo, callback) {
		let rows = 0;
		let columns = null;
		let stopped = false;

		const readStream = fs.createReadStream(fileInfo.path);
		readStream.pipe(csv())
			.on('error',(err) => {
				console.log(err);
				fs.unlink(fileInfo.path);
				callback(err)
			})
			.on('headers', function (headerList) {
				columns = headerList.map(c => {
					return {name: c, count: 0, colType: [], keys: {}};
				});
			})
			.on('data',(data) => {
				columns.map(c => this.calcColumn(data[c.name], c));
				rows++;
				const error = this.checkLimits(fileInfo.timeStart);
				if(error && !stopped) {
					// multitas bug fix;
					stopped = true;
					readStream.close();
					fs.unlink(fileInfo.path);
					callback(error);
				}
			})
			.on('end', () =>{
				columns.map(c => {
					c.perc = Math.round(100*c.count/rows);
					c.uniquie = Object.keys(c.keys).length;
					delete c.keys;
					delete c.count;
				});
				const time = (new Date().getTime()) - fileInfo.timeStart;
				GLOBAL.exectime.push({fileName: fileInfo.name, time});
				if (GLOBAL.exectime.length>15) GLOBAL.exectime.shift();
				fs.unlink(fileInfo.path);
				callback(null, {rows, columns});
			});
	}

	readFile(req, res) {
		const fileInfo = { timeStart: new Date().getTime() };
		const form = new formidable.IncomingForm();
		const that = this;
		GLOBAL.activeFiles++;
		if (GLOBAL.activeFiles > process.env.CSVTEST_MAX_FILES) {
			GLOBAL.activeFiles--;
			return res.json({error: 'The maximum count of analysing files is exceeded'});
		}

		form.uploadDir = path.join(__dirname, '../uploads');
		form.on('file', function(field, file) {
			fileInfo.path = file.path;
			fileInfo.name = file.name;
		});
		form.on('error', function(err) {
			GLOBAL.activeFiles--;
			console.log(err);
			return res.json({error: 'reading file error'});
		});
		form.on('end', function() {
			if (fileInfo.path) {
				try{
					that.parseCsv(fileInfo, (err, data) => {
						GLOBAL.activeFiles--;
						return res.json(err ? {error: err} : data);
					});
				} catch (err) {
					GLOBAL.activeFiles--;
					console.log(err);
					return res.json({error: 'parsing file error'});
				}
			}
			else res.end('the file wasn\'t parsed');
		});

		form.parse(req);
	}
}

const parser = new Parser;
export default parser;