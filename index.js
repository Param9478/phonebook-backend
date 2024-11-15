const express = require('express');
var morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Welcome to my Phonebook<h1>');
});

app.get('/api/phonebook', (req, res) => {
  res.json(phonebook);
});

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${phonebook.length} people<p> ${new Date()}`
  );
});

app.get('/api/phonebook/:id', (req, res) => {
  const id = req.params.id;
  const searchedEntry = phonebook.find((p) => p.id === id);
  if (searchedEntry) {
    res.json(searchedEntry);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/phonebook/:id', (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter((p) => p.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId =
    phonebook.length > 0 ? Math.max(...phonebook.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post('/api/phonebook', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    });
  }
  const findName = phonebook.find((p) => p.name === body.name);
  if (findName) {
    return res.status(400).json({
      error: 'Name already exists',
    });
  }
  const newEntry = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  phonebook = phonebook.concat(newEntry);
  res.json(newEntry);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
