let dbf = require("./modules/db");
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;


app.get('/getfilters', async (req, res) => {
    dbf.getfilters()
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});

app.get('/authorfilter/:name', async (req, res) => {
    dbf.byAuthor(req.params.name)
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});

app.get('/categoryfilter/:cate', async (req, res) => {
    dbf.byCategroy(req.params.cate)
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});

app.get('/sortrecent', async (req, res) => {
    dbf.recent()
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});

app.get('/sortoldest', async (req, res) => {
    dbf.oldest()
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});


app.get('/search/:keywords', async (req, res) => {
    dbf.search(req.params.keywords)
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});


app.post('/createuser', async (req, res) => {
    dbf.createUser(req.body)
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});

app.get('/getuser/:id', async (req, res) => {
    dbf.getUser(req.params.id)
        .then(x => {
            res.status(200).json(x);
        })
        .catch((err) => {
            res.status(500).send('Something went wrong,check backend log message.');
            console.log(err);
        });
});


app.listen(port, () => {
    console.log(`\n\n\tListening on port ${port}\n\n\tQuick API List.(For more info. refer to README.pdf or README.xlsx)\n
                GET http://localhost:3000/getfilters \n
                GET http://localhost:3000/authorfilter/:name \n
                GET http://localhost:3000/categoryfilter/:category \n
                GET http://localhost:3000/sortrecent \n
                GET http://localhost:3000/sortoldest \n
                GET http://localhost:3000/search/:keywords \n
                POST http://localhost:3000/createuser body= {name,email,phone,dob,password} \n
                GET http://localhost:3000/getuser/:id`);
});