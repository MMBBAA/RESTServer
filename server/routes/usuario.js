const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore'); //el guion bajo es un standard para usar underscore

const Usuario = require('../models/usuario');
const app = express();



app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);


    Usuario.find({}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //countDocuments elimina el problema de deprecated de count
            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            });

        })
});
//no olvides, el post funciona con x-www-form urlencoded, y es allí donde hay que escribir los parámetros
app.post('/usuario', function(req, res) {


    let body = req.body;
    //let nombre = "test2";
    //let correo = "test2@gmail.com";
    //let clave = "123456";

    let usuario = new Usuario({

        nombre: body.nombre,
        //nombre: nombre,
        email: body.email,
        //email: correo,
        password: bcrypt.hashSync(body.password, 10),
        //password: body.password,
        //password: bcrypt.hashSync(clave, 10),
        role: body.role

    });


    usuario.save((err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

});
//modificar usuario por id
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});



app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                usuario: usuarioBorrado
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
});

module.exports = app;