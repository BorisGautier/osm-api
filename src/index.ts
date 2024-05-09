import express from 'express';
import bodyParser from 'body-parser';
import { createGeoJson } from './functions/create_geojson';
import { osm2position } from './functions/osm2position';
import * as path from 'path';

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
  const tag = req.body.tag;
  const country = req.body.country;
  const identifiant = req.body.identifiant;

  try {
    createGeoJson(tag, country, identifiant, function (err, result) {
      if (err) {
        console.log(err);
        res.send({
          status: false,
          message: 'erreur lors de la création du fichier geojson',
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
  } catch (error) {}
});

app.use('/download', express.static(path.join(__dirname.split('dist')[0], 'src/osm/data')));

app.post('/osm2position', (req, res) => {
  const country = req.body.country;

  try {
    osm2position(country);
  } catch (error) {}
});
