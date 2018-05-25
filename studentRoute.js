import express from 'express';
import _ from 'lodash';
import student from './student.json';
import mongoose from 'mongoose';

const DB_USER = 'admin';
const DB_PASS = '123123';

const DB_URL = `mongodb://${DB_USER}:${DB_PASS}@ds133570.mlab.com:33570/mydatabase`;
let stuArray = student;
const router = express.Router();

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.once('open', () => {
    console.log('Database connected...');
});

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    course: String
});
const studentModel = mongoose.model('Student', studentSchema);

router.get('/', (req,res) => {
    // res.json(stuArray);
    studentModel.find((err,student) => {
        if (err) res.status(500).send(err);
        res.render('index', {
            student: student
        });
    });
});

router.get('/:id', (req,res) => {
    studentModel.findById(req.params.id, (err, student) => {
        if (err) res.status(500).send(err);
        if (student) {
            res.json(student);
        }else {
            res.status(404).send(`User with Id ${req.params.id} not found!`);
        }
    });
});

router.post('/', (req,res) => {
    // console.log('POST request...');
    // console.log(req.body);
    // stuArray.push(req.body);
    // res.status(200).send('Success');
    const id = new mongoose.Types.ObjectId();
    const stuToPresist = Object.assign({
        _id: id,
    },req.body);
    const student = new studentModel(stuToPresist);
    student.save().then((err, student) => {
        if(err) res.status(500).send(err);
        res.json(student);
    });
    console.log(JSON.stringify(stuToPresist));

});

router.put('/:id', (req,res) => {
    studentModel.findById(req.params.id, (err, student) => {
        if (err) res.status(500).send(err);
        if (student) {
            student.name = req.body.name;
            student.course = req.body.course;
            student.save().then((err, student) => {
                if (err) res.status(500).send(err);
                res.json(student);
            });
        }else {
            res.status(404).send(`User with Id ${req.params.id} not found!`);
        }
    })
});

router.delete('/:id', (req,res) => {
    studentModel.findByIdAndRemove(req.params.id, (err, student) => {
        if (err) res.status(500).send(err);
        res.status(200).send(`Student with Id ${req.params.id}was successfully deleted !`);
    });
});


module.exports = router;
