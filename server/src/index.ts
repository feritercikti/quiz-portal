import express from 'express';

const port = 8000;

const app = express();

app.get('/', (req, res) => {
  res.send('Hi there');
});

app.get('/za', (req, res) => {
  res.send('dsadsaza');
});

app.listen(port, () => {
  console.log(`now listening port ZAAA ${port}`);
});
