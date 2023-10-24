const express = require('express');
const axios = require('axios');
const PORT = 8000;
const {Client} = require('pg');
const app = express();


const dbc = {
    user : "postgres",
    password : "Softjuandius_25",
    database : "postgres",
    port : 5432,
    host : "127.0.0.1"
}

const client = new Client(dbc);

client.connect();

async function getAnime(req,res){
    try{
        const id = req.query.id;
        const result = await client.query(`SELECT * FROM anime WHERE mal_id = $1`, [id]);
        // console.log(result.rows[0].title);
        /////////////////////////////////////////
        if(result.rows.length === 0){
            console.log("Aqui");
            let response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
            response = response.data.data;
            let cols = Object.keys(response).filter(col => Object.keys(anime).includes(col)).join(', ');
            let values = Object.values(response).filter((_, i) => Object.keys(anime).includes(Object.keys(response)[i])).map(val => val instanceof Object ? JSON.stringify(val) : val).map(val => `'${String(val).replace(/'/g, "")}'`).join(', ');
            console.log(`INSERT INTO anime (${cols}) VALUES (${values})`);
            await client.query(`INSERT INTO anime (${cols}) VALUES (${values})`);
            res.send(response);
        } else {
            res.send(result.rows[0]);
        }
    } catch(err){
        console.log(err.message);
    } 
}

app.get('/getanime',getAnime);

app.listen(PORT,()=>{
    console.log(`Escuchando en puerto ${PORT}`);
})

const anime = {
    mal_id: null,
    title: null,
    type: null,
    score: null,
    scored_by: null,
    status: null,
    episodes: null,
    aired_from: null,
    aired_to: null,
    source: null,
    members: null,
    favorites: null,
    duration: null,
    rating: null,
    nsfw: null,
    pending_approval: null,
    premiered_season: null,
    premiered_year: null,
    broadcast_day: null,
    broadcast_time: null,
    genres: null,
    themes: null,
    demographics: null,
    studios: null,
    producers: null,
    licensors: null,
    synopsis: null,
    background: null,
    main_picture: null,
    url: null,
    trailer_url: null,
    title_english: null,
    title_japanese: null,
    title_synonyms: null
};
