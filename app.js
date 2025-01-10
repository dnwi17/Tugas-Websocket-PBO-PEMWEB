const WebSocket = require ('ws');
const db = require('./db');

//Koneksi ke WebSocket Server
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', ()=>{
    console.log('Terhubung ke WebSocket Server!');

    //Kirim pesan ke Server
    ws.send('Halo Server! Ini dari Client');
});

//Terima data dari WebSocket server
ws.on('message', (data)=>{
    console.log('Data diterima dari server: ', data);
    //Simpan dattta ke MySQL
    const jsonData = JSON.parse(data);
    const query = 'INSERT INTO logs (message, timestamp) VALUES (?, ?)';
    const values  =  [jsonData.message, jsonData.timestamp];

    db.query(query, values, (err, result)=>{
        if (err) {
            console.error('Gagal menyimpan data ke MySQL', err);
        } else {
            console.log('Data berhasil disimpan ke database, ID: ', result.insertId);
        }
    });
});

//Handle error
ws.on('error', (err)=>{
    console.error('Error Websocket: ', err);
});

ws.on('close', ()=>{
    console.log('Koneksi WebSocket ditutup');
});