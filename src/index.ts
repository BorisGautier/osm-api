import express from 'express';
import bodyParser from 'body-parser';

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
