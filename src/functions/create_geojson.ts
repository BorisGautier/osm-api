import ogr2ogr from 'ogr2ogr';
import { readFile } from 'fs/promises';

export function createGeoJson(
  tag: string,
  country: string,
  identifiant: string,
  cb: (err: any, { result }: any) => void
) {

  const path = __dirname;
  const project_path = path.split('dist')[0];
  console.log(project_path);

  const pbf_path = `${project_path}src/osm/${country}.osm.pbf`;

  const save_path = `${project_path}src/osm/data/${country}/${identifiant}.geojson`;

  const config_path = `${project_path}src/functions/osmconf.ini`;

 



  //check if file exist and delete it
  const fs = require('fs');

  fs.access(save_path, (err: any) => {
    if (!err) {
      fs.unlink(save_path, (err: any) => {
        if (err) throw err;
        console.log('file deleted');
      });
    } else {
      console.log('file does not exist');
    }
  });


  ogr2ogr(
    pbf_path,
    {
      format: 'GeoJSON',
      destination: save_path,
      timeout: 1800000,
      options: [
        '-where',
        `${tag}`,
        '-oo',
        'CONFIG_FILE=' + config_path,
        'points'
      ]
    }
  ).exec(
    async (err: any, data: any) => {
      if (err) {
        console.error(err);
        cb(err, {
          error: err
        });
      } else {

        //parcours moi le fichier geojson genere
        const file = await readFile(save_path, 'utf8');
        const osmData = JSON.parse(file)['features'];

        console.log(data);
        cb(err, {
          features_count: osmData.length,
          save_path: `/download/${country}/${identifiant}.geojson`
        });
      }
    }
  );
}
