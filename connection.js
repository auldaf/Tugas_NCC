const {createPool} = require('mysql');

// buat konfigurasi koneksi
const pool = createPool({
    host: '127.0.0.1', //'localhost', //127.0.0.1
    user: 'root',
    password: '',
    database: 'tugas2ncc',
    connectionLimit: 10
});

module.exports = pool;