const express = require('express');
const ejs = require('ejs');
const util = require('util');
const mysql = require('mysql2');
const bodyParser = require('body-parser');


/**
 * The following constants with your MySQL connection properties
 * You should only need to change the password
 */

const PORT = 8000;
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = 'Mm12345678#';
const DB_NAME = 'coursework';
const DB_PORT = 3306;

/**
 * DO NOT CHANGE ANYTHING BELOW THIS LINE UP TO THE NEXT COMMENT
 */
var connection = mysql.createConnection({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	port: DB_PORT
});

connection.query = util.promisify(connection.query).bind(connection);

connection.connect(function (err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		console.log('Please make sure you have updated the password in the index.js file. Also, ensure you have run db_setup.sql to create the database and tables.');
		return;
	}
	console.log('Connected to the Database');
});


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * YOU CAN CHANGE THE CODE BELOW THIS LINE
 */

// Add your code here

app.get('/', async (req, res) => {
    try {

        // Fetch courses count
        var [course_count_result] = await connection.promise().query('SELECT COUNT(*) AS total_courses FROM course');
        var course_count = course_count_result[0].total_courses;

        // Fetch total enrollments
        const [totalEnrollmentResult] = await connection.promise().query('SELECT SUM(Crs_Enrollment) AS total_enrollments FROM course');
        const total_enrollment = totalEnrollmentResult[0].total_enrollments;

        // Fetch average enrollmen
        const [averageEnrollmentResult] = await connection.promise().query('SELECT AVG(Crs_Enrollment) AS average_enrollment FROM course');
        const average_enrollment = averageEnrollmentResult[0].average_enrollment;

        // Fetch highest enrollment
        const [highestEnrollmentResult] = await connection.promise().query('SELECT Crs_Title AS highest_enrollment FROM course WHERE Crs_Enrollment = (SELECT MAX(Crs_Enrollment) FROM course)');
        const highest_enrollment = highestEnrollmentResult[0].highest_enrollment;

        // Fetch lowest enrollment
        const [lowestEnrollmentResult] = await connection.promise().query('SELECT Crs_Title AS lowest_enrollment FROM course WHERE Crs_Enrollment = (SELECT MIN(Crs_Enrollment) FROM course)');
        const lowest_enrollment = lowestEnrollmentResult[0].lowest_enrollment;

        res.render('index', { course_count, total_enrollment, average_enrollment, highest_enrollment, lowest_enrollment });
    } catch (err) {
        console.error('Error fetching courses statics:', err);
        res.status(500).send('Server error');
    }
});


app.get('/courses', async (req, res) => {
    try {

        const [courses] = await connection.promise().query('SELECT Crs_Code, Crs_Title, Crs_Enrollment FROM course');

        res.render('courses', { courses })

    } catch (err) {
        console.error('Error fetching courses', err);
        res.status(500).send('Server error');
    }
});



app.get('/edit-course/:id', async (req, res) => {
    try {

        const courseId = req.params.id;
        const [course] = await connection.promise().query('SELECT Crs_Code, Crs_Title, Crs_Enrollment FROM course WHERE crs_code = ?', [courseId])
        res.render('edit', { course })

    } catch (err) {
        console.error('Error fetching courses', err);
        res.status(500).send('Server error');
    }
});




app.get('/create-course', async (req, res) => {
    try {

        res.render('create')

    } catch (err) {
        console.error('Error fetching courses', err);
        res.status(500).send('Server error');
    }
});


app.post('/create-course', async (req, res) => {
    try {
        const { Crs_Code, Crs_Title, Crs_Enrollment } = req.params;
        await connection.promise().query('INSERT into course (Crs_Code, Crs_Title, Crs_Enrollment) Values (?,?,?)', [Crs_Code, Crs_Title, Crs_Enrollment])
        res.redirect('/courses')

    } catch (err) {
        console.error('Error fetching courses', err);
        res.status(500).send('Server error');
    }
});





app.post('/edit-course/:id', async (req, res) => {
    try {
        const courseId = req.params.id; 
        const { Crs_Title, Crs_Enrollment } = req.body; 

        
        let query = 'UPDATE courses SET';
        const params = [];
        if (Crs_Title) {
            query += ' crs_title = ?';
            params.push(Crs_Title);
        }
        if (Crs_Enrollment) {
            query += params.length ? ', crs_enrollment = ?' : ' crs_enrollment = ?';
            params.push(Crs_Enrollment);
        }
        query += ' WHERE crs_code = ?';
        params.push(courseId);

        
        await connection.promise().query(query, params);

        res.redirect('/courses');
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).send('Server error');
    }
});


app.get('/view_header', async (req, res) => {
    try {
        res.render('header')

    } catch (err) {
        console.error('Error fetching courses', err);
        res.status(500).send('Server error');
    }
});





/**
 * DON'T CHANGE ANYTHING BELOW THIS LINE
 */

app.listen(PORT, () => {

	console.log(`Server is running on port http://localhost:${PORT}`);

});



exports.app = app;