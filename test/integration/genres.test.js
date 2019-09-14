const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
        await server.close();
        await Genre.remove({});
     });

    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'},
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('GET /:id', () => {
       it('Should return a genre when valid id passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre.id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
       });
    
        it('Should return 404 error if invalid ID is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('Should return 404 error if no genre with the f=given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        const exec = async() => {
            return( res = await request(server).post('/api/genres').set('x-auth-token', token).send({ name }));
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

    it('Should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('Should return 400 if genre is less than 5 characters', async () => {
            name = 'John';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('Should return 400 if genre is greater than 50 characters', async () => {
            name = new Array(53).join('a');
           const res = await exec();
           expect(res.status).toBe(400);
    
        });
    
        it('Should save the genre if it is valid', async () => {
            await exec();       
            const genre = await Genre.find({ name: 'genre1'});
            expect(genre).not.toBeNull();
         });
    
        it('Should return the genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1'); 
         });
    });

    
});