import path from 'path';
import express from 'express';
import parser from '../utils/Parser';
const router = express.Router();

router.post('/upload', (req, res, next) => {
	parser.readFile(req, res);
});

router.get('/metric', (req, res, next) => {
	return res.json({usage: GLOBAL.usage, time: GLOBAL.exectime});
});

router.get('/*', (req, res, next) => {
	return res.sendFile(path.join(__dirname, '../bin/index.html'));
});

export default router;
