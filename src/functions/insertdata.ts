import { readFile } from 'fs/promises';
import { convertHour } from './convert';
import nominatim from 'nominatim-client';
import { PoolClient } from 'pg';

const clientNominatim = nominatim.createClient({
  useragent: 'Position', // The name of your application
  referer: 'https://position.cm' // The referer link
});

export async function insertData(client: PoolClient, country: string) {
  const data = [];
  const osmids = [];
  const data1 = [];
  const dataosm: any[] = [];

  for (let i = 1; i <= 478; i++) {
    const file_path = './src/osm/data/' + country + '/' + i + '.geojson';

    try {
      const file = await readFile(file_path, 'utf8');
      const osmData = JSON.parse(file)['features'];

      for (let j = 0; j < osmData.length; j++) {
        osmData[j]['souscategorie'] = i;
        osmData[j]['id'] = osmData[j]['properties']['osm_id'];

        if (osmData[j]['properties']['other_tags']) {
          osmData[j]['tags'] = JSON.parse(
            '{' +
            osmData[j]['properties']['other_tags'].replace(/=>/g, ':') +
            '}'
          );
        }

        data.push(osmData[j]);
      }
    } catch (error) { }
  }

  for (let i = 0; i < data.length; i++) {
    const osm = data[i];
    let name = osm['properties']['name'];

    if (name != undefined) {
      data1.push(osm);
    }
  }

  for (let k = 0; k < data1.length; k++) {
    let osm = data1[k];
    let idosm = osm['id'];
    if (osmids.indexOf(idosm) !== -1) {
    } else {
      osmids.push(idosm);
      dataosm.push(osm);
    }
  }

  var time = 0;
  let number = 0;

  var interval = setInterval(function () {
    if (time < dataosm.length) {
      number = number + 1;
      let commodites: string | undefined = '';
      let osm = dataosm[time];
      let name = osm['properties']['name'];
      let lon = osm['geometry']['coordinates'][0];
      let lat = osm['geometry']['coordinates'][1];

      let opening_hours: string | undefined;
      let phone: string | undefined;
      let website: string | undefined;
      let addr_postcode: string | undefined;
      let city: string | undefined;
      let rue: string | undefined;
      let image: string | undefined;
      let description: string | undefined;
      let services: string | undefined;

      if (osm['tags']) {
        opening_hours = osm['tags']['opening_hours'];
        phone = osm['tags']['phone'] ?? osm['tags']['contact:phone'];
        website = osm['tags']['website'] ?? osm['tags']['contact:website'];
        addr_postcode = osm['tags']['addr:postcode'];

        city = osm['tags']['addr:city'];
        rue = osm['tags']['addr:street'];
        image = osm['tags']['image'];
        description = osm['tags']['description'];
        services =
          osm['tags']['service'] ??
          osm['tags']['animal_breeding'] ??
          osm['tags']['brewery'] ??
          'Aucun service';
        if (osm['tags']['air_conditioning']) {
          commodites = commodites + 'Air Conditionné;';
        }
        if (osm['tags']['cuisine']) {
          commodites = commodites + 'Cuisine : ' + osm['tags']['cuisine'] + ';';
        }
        if (opening_hours == '24/7') {
          commodites = commodites + 'Ouvert 24h;';
        }
        if (osm['tags']['outdoor_seating']) {
          commodites = commodites + 'Sièges Extérieurs;';
        }
        if (osm['tags']['capacity']) {
          commodites =
            commodites +
            'Capacité : ' +
            osm['tags']['capacity'] +
            ' places' +
            ';';
        }
        if (osm['tags']['internet_access']) {
          commodites = commodites + 'Wifi;';
        }
        if (osm['tags']['payment:cash']) {
          commodites = commodites + 'Espèces;';
        }
        if (
          osm['tags']['payment:debit_cards'] ||
          osm['tags']['payment:mastercard'] ||
          osm['tags']['payment:visa']
        ) {
          commodites = commodites + 'Carte bancaire;';
        }
        if (osm['tags']['payment:mtm_money']) {
          commodites = commodites + 'Paiement mobile;';
        }
      }

      let souscategorie = osm['souscategorie'];
      let id = osm['id'];

      const requete = {
        lat: lat,
        lon: lon
      };

      try {
        clientNominatim.reverse(requete).then((nominatim) => {
          let osm_data_insert = {
            sous_categorie_id: souscategorie,
            osm_id: id,
            nom: name,
            lon: lon,
            lat: lat,
            opening_hours: opening_hours,
            phone: phone,
            website: website,
            code_postal: addr_postcode,
            city: city ?? nominatim.address.city ?? nominatim.address.state,
            quartier: nominatim.address.suburb,
            rue: rue ?? nominatim.address.road,
            image: image ?? '/images/logo-nom.jpg',
            description: description,
            services: services,
            commodites: commodites,
            createdAt: new Date()
              .toISOString()
              .replace(/T/, ' ')
              .replace(/\..+/, ''),
            updatedAt: new Date()
              .toISOString()
              .replace(/T/, ' ')
              .replace(/\..+/, '')
          };

          var replaceNameCaract = name.replace("'", "''");
          var upperCaseName = replaceNameCaract;
          let query = `INSERT INTO osm_data ("sous_categorie_id", "osm_id", "name", "lon", "lat", "opening_hours", "phone", "website", "code_postal", "city", "quartier", "rue", "image", "description", "services", "commodites", created_at, updated_at) VALUES ('${osm_data_insert.sous_categorie_id}', '${osm_data_insert.osm_id}', '${upperCaseName}', '${osm_data_insert.lon}', '${osm_data_insert.lat}', '${osm_data_insert.opening_hours}', '${osm_data_insert.phone}', '${osm_data_insert.website}', '${osm_data_insert.code_postal}', '${osm_data_insert.city}', '${osm_data_insert.quartier}', '${osm_data_insert.rue}', '${osm_data_insert.image}', '${osm_data_insert.description}', '${osm_data_insert.services}', '${osm_data_insert.commodites}', '${osm_data_insert.createdAt}', '${osm_data_insert.updatedAt}') RETURNING *`;

          client.query(query, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(
                'Etablissement ' +
                name +
                ' Bien ajouté' +
                ' ' +
                number +
                '/' +
                dataosm.length
              );
}
            
          });
        }).catch((err) => {
        });

      } catch (error) {
      }

      time++;
    } else {
      clearInterval(interval);
    }
  }, 2000);
}
