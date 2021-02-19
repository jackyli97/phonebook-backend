const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
morgan.token("body", req => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
  )
);
app.use(express.static("build"));

let persons = [
    {
      "name": "Arto Hellas",
      "number": "239-29098",
      "id": 1
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 2
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 3
    },
    {
      "name": "Nancy Wang",
      "number": "415-860-1050",
      "id": 4
    },
    {
      "name": "Jacky Li",
      "number": "510-918-2567",
      "id": 5
    }
  ]

  app.get("/api/persons", (request, response) => {
    response.json(persons);
  });

  app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(pers=>pers.id === id);

    if (person){
        response.json(person)
    }
    else {
        response.status(400).end();
    }
  });

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(pers=> pers.id !== id);

    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * 1000);
};

app.post("/api/persons", (request, response) => {
  const id = generateId();
    const body = request.body;
  
    if (!body.name || !body.number) {
        return response.status(400).json({
        error: "Name or number is missing",
        });
    }
    if (persons.find(pers=>pers.name === body.name)) {
        return response.status(400).json({
        error: "Name must be unique",
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(person);

    response.json(person);
});

app.get("/info", (request, response) => {
const phonebookInfo = `Phone has info for ${persons.length} people`;
const date = new Date().toUTCString()

response.send(`<p>${phonebookInfo}</p>
<p>${date}</p>`);
});

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

   // mongodb+srv://admin:<password>@cluster1.dx60i.mongodb.net/phonebook-app?retryWrites=true&w=majority
