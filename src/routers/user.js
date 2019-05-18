const crypto = require('crypto')
const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dogsutf',
    password: 'Eldorado20',
    port: 5432,
})

const router = require('express').Router()

async function hashSenha(senha, salt) {
    if (!salt) salt = crypto.randomBytes(10).toString('hex')
    let pbk = await crypto.pbkdf2Sync(senha, salt, 100000, 64, 'sha512')
    let hash = pbk.toString('hex')
    return {hash, salt}
}

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

router.post('/login', async (req,res) => {
    let sql = 'SELECT *FROM usuario WHERE email = $1'
    let params = [req.body.email]
    let users = await pool.query(sql, params)

    if (!users.rows.length){
        res.status(400).json({err: 'email not found'})
        return
    }

    let user = users.rows[0]
    let {senha, salt} = user
    let reqSenha = await hashSenha(req.body.senha, salt)
    console.log(reqSenha)

    if (reqSenha.hash != senha){
        res.status(400).json({err: 'wrong pass'})
        return
    }else{
        //gera jwt
        console.log(process.env.JWT)
        let token = jwt.sign({email: user.email, nome: user.nome}, process.env.JWT, { expiresIn: '8h' })
        res.status(200).json({token})
    }
})

module.exports = router