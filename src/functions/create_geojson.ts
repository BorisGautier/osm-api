import ogr2ogr from 'ogr2ogr';

export function createGeoJson(
  tag: string,
  country: string,
  identifiant: string,
  cb: (err: any, { result }: any) => void
) {
  const save_path = `C:/Users/HWTP4412/Documents/Projets/Nodejs/osm-api/src/osm/data/${country}/${identifiant}.geojson`;

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
        'point'
      ]
    }
  ).exec(cb);
}
