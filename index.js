require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
    const concertsEndpoint = 'https://api.hubspot.com/crm/v3/objects/2-52193574?properties=concert_name,artist,event_date';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(concertsEndpoint, { headers });
        const data = resp.data.results;
        
        res.render('homepage', { title: 'Homepage | HubSpot APIs', data });

    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const newConcert = {
        properties: {
            "concert_name": req.body.concert_name,
            "artist": req.body.artist,
            "event_date": req.body.event_date
        }
    };

    const createConcertEndpoint = 'https://api.hubspot.com/crm/v3/objects/2-52193574';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createConcertEndpoint, newConcert, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));