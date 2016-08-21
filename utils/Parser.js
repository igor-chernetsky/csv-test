import csv from 'csv-parser';
import fs from 'fs';

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

	parseCsv(path, callback) {
		let rows = 0;
		let columns = 0;
		const readStream = fs.createReadStream(path);
		readStream.pipe(csv())
			.on('error',(err) => {
				console.log(err);
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
			})
			.on('end', () =>{
				columns.map(c => {
					c.perc = Math.round(100*c.count/rows);
					c.uniquie = Object.keys(c.keys).length;
					delete c.keys;
					delete c.count;
				});
				fs.unlink(path);
				callback(null, {rows, columns});
			});
	}
}

const parser = new Parser;
export default parser;