const db = require('../../database/models');
const moment = require('moment');

const throwError = (res, error) => {
    console.log(error)
    return res.status(error.status).json({
        meta : {
            status : error.status || 500
        },
        data : error.message
    })
}

module.exports = {
    list: async (req, res) => {
        try {
            let movies = await db.Movie.findAll();
            let response = {
                meta : {
                    status : 200,
                    total : movies.length,
                    link : 'api/movies'
                },
                data : movies
            }

            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                meta : {
                    status : 500,
                    link : 'api/movies'
                },
                data : error
            })
        }
    },
    detail: async (req, res) => {
        try {

            if(isNaN(req.params.id)){
                let error = new Error('ID incorrecto');
                error.status = 422;
                throw error
            }

            let movie = await db.Movie.findByPk(req.params.id);


            if(!movie){
                let error = new Error('ID inexistente');
                error.status = 404;
                throw error
            }

            let response = {
                meta : {
                    status : 200,
                    link : 'api/movies' + req.params.id
                },
                data : movie
            }
            return res.status(200).json(response)

        } catch (error) {      

            throwError(res, error)
        }
    },    
    create : async(req, res) =>{
        try{
            req.body.release_date ? req.body.release_date = moment(req.body.release_date).format('DD-MM-YYYY') : null

            let movie = await db.Movie.create({
                ...req.body
            }) 

           let  response ={
                meta : {
                    status : 201,
                    link: 'api/movies/' + movie.id,
                    msg: "Pelicula creada con éxito"
   
                },
                data : movie
            }
            return res.status(201).json(response)

        }catch (error) {
            console.log(error);
          return res.status(400).json({
            meta : {
                status : 400
            },
            data : error.errors.map(error => error.message)
          })
        }
    },
    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    destroy: async (req, res) => {
        try {
            NaNError(req.params.id);

            let result = await db.Movie.destroy({
                where : {
                    id: req.params.id
                }
                })
                if (result === 1) {
                    response ={
                       meta : {
                           status : 201,
                           msg: "Se borró la película"
                       },
                       
                   }
                   return res.status(201).json(response)

               }else{
                   response ={
                       meta : {
                           status : 204,
                           msg: "No se borró ninguna película"
          
                       },
               }
               console.log(response);
               return res.status(204).json(response)
           }
              
        } catch (error) {
            console.log(error);
            return res.status(400).json({
              meta : {
                  status : 400
              },
              data : error.errors.map(error => error.message)
            })
        }}
}