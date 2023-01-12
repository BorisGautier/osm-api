import express from 'express';
import bodyParser from 'body-parser';
import { createGeoJson } from './functions/create_geojson';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

app.get('/', (_req, res) => {
  res.send(__dirname);
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

app.post('/creategeojson', (req, res) => {
    let tag = req.body.tag;
    let country = req.body.country;
    let identifiant = req.body.identifiant;

    try {
        createGeoJson(tag, country, identifiant, function (err, result) {
          if (err) {
            console.log(err);
            res.send({
              status: false,
              message: "erreur lors de la création du fichier geojson",
              error: err
            });
          } else {
            console.log(result!);
            res.send({
              status: true,
              message: 'fichier geojson créé avec succès',
              result: result
            });
          }
        });
        
    } catch (error) {
        
    }



    });