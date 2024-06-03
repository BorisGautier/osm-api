import ogr2ogr from 'ogr2ogr';
import tags from './sc.json'; // Import du fichier JSON contenant les tags
import fs from 'fs';

export async function osm2position(country: string) {
  const appDir = "/var/www/position/osm-api";

  // Vérification et création du répertoire de données
  const dataDir = `${appDir}/src/osm/data/${country}`;
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Fonction pour traiter chaque tag
  const processTag = (tag: { id: number; nom: string; id_categorie: number; tags_osm: string; } | { id: number; nom: string; id_categorie: number; tags_osm?: undefined; }) => {
    return new Promise<void>((resolve, reject) => {
      if (tag.tags_osm) {
        const savePath = `${dataDir}/${tag.id}.geojson`; // Chemin de sauvegarde du fichier GeoJSON

        // Construction des conditions de tag
        const tagConditions = tag.tags_osm.split(';').map((tagCondition) => {
          const [key, value] = tagCondition.split('=');
          return `${key}='${value}'`;
        }).join(' OR ');

        // Exécution de ogr2ogr avec les options appropriées
        ogr2ogr(`${appDir}/src/osm/${country}.osm.pbf`, {
          format: 'GeoJSON',
          destination: savePath,
          timeout: 8800000,
          options: [
            '-where',
            tagConditions,
            '-oo',
            'CONFIG_FILE=' + appDir + '/src/functions/osmconf.ini',
            'points'
          ]
        }).exec((err, result) => {
          if (result) {
            console.log(`Fichier ${tag.nom} chargé avec succès`);
            resolve();
          } else {
            console.error(err);
            reject(err);
          }
        });
      } else {
        resolve();
      }
    });
  };

  // Parcours des tags et traitement
  for (const tag of tags) {
    try {
      await processTag(tag);
    } catch (err) {
      console.error(`Erreur lors du traitement du tag ${tag.nom}:`, err);
    }
  }
}
