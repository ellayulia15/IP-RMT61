import axios from 'axios';

const http = axios.create({
    baseURL: 'https://tutorhub-server.cahya.web.id'
});

export default http;
