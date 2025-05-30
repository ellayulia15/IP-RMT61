import axios from 'axios';

const http = axios.create({
    // baseURL: 'https://tutorhub-server.cahya.web.id'
    baseURL: 'http://localhost:3000'
});

export default http;
