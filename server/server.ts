import { FileController } from './file.controller';
import cors from 'cors';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
const fileController = new FileController();

app.post('/create-file', async (req: any, res: any) => {
  try {
    await fileController.createFile(req.body.fileName, req.body.content);
    res.json({ message: 'File written successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
