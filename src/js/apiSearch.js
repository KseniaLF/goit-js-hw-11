import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '24536039-c146a0cee4ea2e39b0ff8f9b5'

export default class ApiSearch {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        this.perPage = 40;
        this.total = 0;
    }
    
    async getPhoto() {
        try {
            const url = `?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
            const getData = await axios.get(url);
            this.page += 1;
            return getData.data;
        } catch (error) {
            console.log(error);
        }
    };

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}