const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'))

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employeelist_db'
    },
    console.log(`Connected to the employeelist_db database.`)
)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

