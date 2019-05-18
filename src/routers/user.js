const crypto = require('crypto')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dogsutf',
    password: 'Eldorado20',
    port: 5432,
})

const router = require('express').Router()

async function hashSenha(senha) {
    let salt = crypto.randomBytes(10).toString('hex')
    let pbk = await crypto.pbkdf2Sync(senha, salt, 100000, 64, 'sha512')
    let hash = pbk.toString('hex')
    return {hash, salt}
}

router.get('/postgres', async (req, res) => {
    const resp = await pool.query('SELECT $1::text as message', ['Hello world!'])
    res.send(resp.rows[0])
    await pool.end()
})

//cadastro usuario
router.post('/', async (req, res) => {
    try{
        let sql = 'INSERT INTO usuario (nome, email, senha, salt, aluno, curso, campus) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *'
        let { nome, email, aluno, curso, campus } = req.body
        let fullHash = await hashSenha(req.body.senha)
        let senha = fullHash.hash
        let salt = fullHash.salt
        let params = [nome, email, senha, salt, aluno, curso, campus]
        const resp = await pool.query(sql, params)
        res.send(resp.rows[0])
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router