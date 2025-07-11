import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello from Myriad backend!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
