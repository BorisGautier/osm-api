import { pool } from "./functions/db.config";
import { insertData } from "./functions/insertdata";

function osmquery() {
    pool.connect((err, client, done) => {
        if (err) {
            console.log(err);
            return done(err);
        }
        if (client) {

            insertData(client, process.argv[2]);   
        }
    });
}

osmquery();