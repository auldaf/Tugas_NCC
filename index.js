const express =  require("express");
//ini buat supaya kita bisa ngirim data dari postman lewat body
const bodyParser = require("body-parser");

const app = express();
const dbconnection = require('./connection');


app.use(bodyParser.json());

const PORT = 3100;

const db = [
    {
        id:"1",
        judul: "Exhuma",
        tahunRilis:"2024",
        ratings:9,
        genre:"Horror",
        penulis:"Jang Jae Hyun",
        masihTayangBioskop:1,
    }
];

app.get("/", (req, res) => {
    res.send("Hello");
});

app.get("/page1", (req,res) => {
    res.send("halo 1");
});

app.get("/page2", (req,res) => {
    res.send("halo 2");
});

app.get("/page3", (req,res) => {
    res.send("halo 3");
});

app.get("/db", (req,res) => {
    res.status(200).json({data: db});
});

app.get ("/db-mysql", (req,res) => {
    const querySql = 'SELECT * FROM biodata';

    dbconnection.query(querySql,(err, rows, field) => {
        if(err){
            //server error response
            return res.status(500).json({message: 'error:', error:err});
        }
        //successfull responnse
        res.status(200).json({data: rows});
    });
    return 0;
});

app.get("/db-mysql/:id", (req, res) => {
    //buat cari id nya
    const { id } = req.params;
    //trs ini query supaya bisa nampilin data yang punya id = id yang dicari
    const querySql = 'SELECT * FROM biodata WHERE id = ?';

    dbconnection.query(querySql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error:', error: err });
        }

        if (results.length === 0) {
            //client error response, atau data ga bisa ketemu
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ data: results[0] });
    });
});


app.post ("/db-mysql", (req,res) => {
    //supaya bisa masukkan adata lewat body di postman
    const requestData = req.body;

    if (!requestData.id || !requestData.alamat_domisili) {
        return res.status(400).json({ message: 'Semua bidang harus diisi' });
    }
    //ini query buat masukkan data ke database
    const querySql = 'INSERT INTO biodata SET ?';

    // console.log('Received data:', requestData);

    dbconnection.query(querySql, requestData,(err, results) => {
        if(err){
            //internal server error si srever gabisa handle
            return res.status(500).json({message: 'error:', error:err});
        }

        //request success di add
        res.status(201).json({ message: 'Data add'});
    });
});


app.put("/db-mysql/:id", (req, res) => {
    const { id } = req.params;

    //supaya bisa dimasukkan dari body postman
    const requestData = req.body;

    if (!requestData.id || !requestData.alamat_domisili) {
        return res.status(400).json({ message: 'Semua bidang harus diisi' });
    }

    //query buat update datanya
    const querySql = 'UPDATE biodata SET ? WHERE id = ?';

    dbconnection.query(querySql, [requestData, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error:', error: err });
        }

        // klo data ga ketemu
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.json({ message: 'Success' });
    });
});

app.delete("/db-mysql/:id", (req, res) => {
    const { id } = req.params;
    // const requestData = req.body;

    //query buat update datanya
    const querySql = 'DELETE from biodata WHERE id = ?';

    dbconnection.query(querySql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error:', error: err });
        }

        // klo data ga ketemu
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.json({ message: 'Success Delete data' });
    });
});



app.listen(PORT, () => console.log(`Berhasil ${PORT}`));

