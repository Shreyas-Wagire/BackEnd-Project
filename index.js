const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const Path = require('path');
const methodOverride = require('method-override');


app.set('view engine', 'ejs');
app.set("views", Path.join(__dirname , "/views"));
app.use(express.static(Path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'webapp',
    password: 'Shreyas@007'
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(), 
        faker.internet.email(),
        faker.internet.password(),
    ];
}

// HOME Route
app.get('/', (req, res) => {
    let q = `SELECT count(*) FROM user;`;
    try {
    connection.query(q, (err, result) => {
        if (err) throw err;
        let count = result[0]['count(*)'];
        res.render("home.ejs", {count})
    });

}
catch (err) {
    console.log(err);
    res.send("Error");
}
});

// SHOW Route
app.get('/users', (req,res) => {
    let q = `SELECT * FROM user;`;
    try {
    connection.query(q, (err, users) => {
        if (err) throw err;
        res.render("users.ejs", {users});
    });
}
catch (err) {
    console.log(err);
    res.send("Error");
}
});

// Edit Route
app.get('/users/:id/edit', (req, res) => { 
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
    connection.query(q,[id] ,(err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("edit.ejs", {user});
    });
}
catch (err) {
    console.log(err);
    res.send("Error");
}
});


// Update Route
app.patch('/users/:id', (req, res) => {
    // res.send("Update Route");
    let {id} = req.params;
    let {password: formPass, username: newUser} = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
    connection.query(q,(err, result) => {
        if (err) throw err;
        let user = result[0];
        if(formPass != user.password) {
            res.send("Password Incorrect");
        }
        else{
            let q2 = `UPDATE user SET username='${newUser}' WHERE id='${id}'`;
            connection.query(q2, (err, result) => {
                if(err) throw err;
                res.redirect("/users");
            });
        }
        res.render("edit.ejs", {user});
    });
}
catch (err) {
    console.log(err); 
    res.send("Error");
}
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});















// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });

// }
// catch (err) {
//     console.log(err);
// }

// connection.end();// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });

// }
// catch (err) {
//     console.log(err);
// }

// connection.end();