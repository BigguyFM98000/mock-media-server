const http = require('http');
const url = require('url');

// Dummy data
let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "Wachowskis", year: 1999 }
];

let series = [
  { id: 1, title: "Breaking Bad", seasons: 5 },
  { id: 2, title: "Stranger Things", seasons: 4 }
];

let songs = [
  { id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
  { id: 2, title: "Imagine", artist: "John Lennon" }
];

// Helper: get data array based on route
function getDataByPath(path) {
  switch (path) {
    case '/movies': return movies;
    case '/series': return series;
    case '/songs': return songs;
    default: return null;
  }
}

// Helper: set data array based on route
function setDataByPath(path, newData) {
  switch (path) {
    case '/movies': movies = newData; break;
    case '/series': series = newData; break;
    case '/songs': songs = newData; break;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.toLowerCase();
  let dataArray = getDataByPath(path);

  if (!dataArray) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dataArray));
  }

  else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const newItem = JSON.parse(body);
      newItem.id = Date.now();
      dataArray.push(newItem);
      setDataByPath(path, dataArray);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dataArray));
    });
  }

  else if (req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const updatedItem = JSON.parse(body);
      dataArray = dataArray.map(item => item.id === updatedItem.id ? updatedItem : item);
      setDataByPath(path, dataArray);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dataArray));
    });
  }

  else if (req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { id } = JSON.parse(body);
      dataArray = dataArray.filter(item => item.id !== id);
      setDataByPath(path, dataArray);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dataArray));
    });
  }

  else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
