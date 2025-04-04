import { axiosInstance } from "../configs/axios.config.js";

class SongService {
    static async getAllSongs(page = 1, limit = 5, searchQuery = "") {
        let url = `/songs?_page=${page}&_limit=${limit}`;
        if (searchQuery) {
            url += `&name_like=${searchQuery}`;
        }
        const response = await axiosInstance.get(url);
        return {
            data: response.data,
            total: parseInt(response.headers["x-total-count"]) || 0,
        };
    }

    static async createSong(data) {
        return await axiosInstance.post("/songs", data);
    }

    static async updateSong(id, data) {
        return await axiosInstance.patch(`/songs/${id}`, data);
    }
}

export default SongService;