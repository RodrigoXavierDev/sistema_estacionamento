const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sistema_estacionamento',
    password: 'BemVindo!',
    port: 5432,
});

// Exporta o pool para encerramento controlado
module.exports = { pool };

app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'app/assets/css')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Endpoint para obter carros
app.get('/carro', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM carros');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

// Endpoint para adicionar um carro
app.post('/carros', async (req, res) => {
    const { cupom, placa, descricao } = req.body;
    const entrada = new Date(); // Define a data e hora atual para entrada_timestamp
    const entradaDate = entrada.toISOString().split('T')[0]; // Pega apenas a data (YYYY-MM-DD)

    const queryText = 'INSERT INTO carros (cupom, entrada, entrada_hora, placa, descricao) VALUES ($1, $2, $3, $4, $5)';
    const values = [cupom, entradaDate, entrada, placa, descricao]; // 'entrada' vai para a coluna DATE, 'entrada_timestamp' para TIMESTAMP

    try {
        await pool.query(queryText, values);
        res.status(201).send('Carro adicionado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});


// Endpoint para remover um carro por placa
app.delete('/carros/:placa', async (req, res) => {
    const { placa } = req.params;

    try {
        const result = await pool.query('DELETE FROM carros WHERE placa = $1', [placa]);
        if (result.rowCount === 0) {
            return res.status(404).send('Carro não encontrado');
        }
        res.status(200).send('Carro removido');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
