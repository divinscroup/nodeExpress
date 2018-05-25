import express from 'express'
import student from './student.json'
import { version } from 'punycode';
import _ from 'lodash';
import studentRoute from './studentRoute';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import https from 'https';
import fs from 'fs';


const PORT = 8080;
const SLPORT = 8082;
const server = express();
const buildUrl = (path) => `/${path}`;
const studentUrl = buildUrl('student');
const slOptions = {
    key: fs.readFileSync(path.join('key.pem')),
    cert: fs.readFileSync(path.join('cert.pem')),
    passphrase: '123456'
};


server.use(morgan('tiny'));
server.use(bodyParser.json());
server.use(express.static('public'));
server.use(studentUrl, studentRoute);

server.set('views', path.join('views'));
server.set('view engine', 'ejs');

server.get('/', (req,res) => {
    res.render('index', {
        student: student
    });
});

server.get('/download/images/:imgName', (req,res) => {
    res.download(path.join('public', 'images', req.params.imgName));
});

server.listen(PORT, () =>{
    console.log(`Server is up on port ${PORT}...`);
});
https.createServer(slOptions, server).listen(SLPORT, () => {
    console.log(`Secure Server is up on port ${SLPORT}...`)
});
