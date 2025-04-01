const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-token', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const token = jwt.sign(
    {
      user_id: userId,
    },
    process.env.STREAM_API_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1h',
    }
  );

  res.json({ token });
});

app.listen(3000, () => {
  console.log('✅ Token server running at http://localhost:3000');
});
