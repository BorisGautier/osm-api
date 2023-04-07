import ogr2ogr from 'ogr2ogr';
import tags from './sc.json';
import fs from 'fs'

export function osm2position(
  country: string
) {
    
    if (
      !fs.existsSync(
        `C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/osm/data/${country}`
      )
    ) {
      fs.mkdirSync(
        `C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/osm/data/${country}`
      );
    }
  for (let index = 0; index < tags.length; index++) {
      if (tags[index].tags_osm) {
      const save_path = `C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/osm/data/${country}/${tags[index].id}.geojson`;
          if (tags[index].tags_osm?.includes(";")) {
              const usetags = tags[index].tags_osm?.split(';');
              
              if (usetags!.length < 3) {
                  const keyvalue1 = usetags![0].split('=');
                  const value1 = `'${keyvalue1![1]}'`;
                  const tag1 = `${keyvalue1![0]}=${value1}`;

                  const keyvalue2 = usetags![1].split('=');
                  const value2 = `'${keyvalue2![1]}'`;
                  const tag2 = `${keyvalue2![0]}=${value2}`;


                   ogr2ogr(
                     `C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/osm/${country}.osm.pbf`,
                     {
                       format: "GeoJSON",
                       destination: save_path,
                       timeout: 1800000,
                       options: [
                         '-where',
                         `${tag1} OR ${tag2}`,
                         '-oo',
                         'CONFIG_FILE=C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/functions/osmconf.ini',
                         'points'
                       ]
                     }
                   ).exec(function (err,result) {
                       if (result) {
      console.log('Fichier ' + tags[index].nom + ' chargé avec succès');
                       } else {     
      console.log(err);
                       }
                   });
              } else {

                   const keyvalue1 = usetags![0].split('=');
                   const value1 = `'${keyvalue1![1]}'`;
                   const tag1 = `${keyvalue1![0]}=${value1}`;

                   const keyvalue2 = usetags![1].split('=');
                   const value2 = `'${keyvalue2![1]}'`;
                  const tag2 = `${keyvalue2![0]}=${value2}`;
                  
                    const keyvalue3 = usetags![2].split('=');
                    const value3 = `'${keyvalue3![1]}'`;
                  const tag3 = `${keyvalue3![0]}=${value3}`;
                  

                  ogr2ogr(
                    `C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/osm/${country}.osm.pbf`,
                    {
                      format: 'GeoJSON',
                      destination: save_path,
                      timeout: 1800000,
                      options: [
                        '-where',
                        `${tag1} OR ${tag2} OR ${tag3}`,
                        '-oo',
                        'CONFIG_FILE=C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/functions/osmconf.ini',
                        'points'
                      ]
                    }
                  ).exec(function (err, result) {
                    if (result) {
                      console.log(
                        'Fichier ' + tags[index].nom + ' chargé avec succès'
                      );
                    } else {
                      console.log(err);
                    }
                  });
                  
              }
              
          } else {
              const keyvalue = tags[index].tags_osm?.split('=');
              const value = `'${keyvalue![1]}'`
              const tag = `${keyvalue![0]}=${value}`

              
              ogr2ogr(
                `C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/osm/${country}.osm.pbf`,
                {
                  format: 'GeoJSON',
                  destination: save_path,
                  timeout: 1800000,
                  options: [
                    '-where',
                    `${tag}`,
                    '-oo',
                    'CONFIG_FILE=C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/functions/osmconf.ini',
                    'points'
                  ]
                }
              ).exec(function (err, result) {
                if (result) {
                  console.log(
                    'Fichier ' + tags[index].nom + ' chargé avec succès'
                  );
                } else {
                  console.log(err);
                }
              });
          }
        
      }
  }
}
