import axios from "axios";




export async function getCompletion(text) {
    const queryParams = {
        text: text
    }

    const response = await axios.get("http://localhost:5000/completion", {
        params: queryParams
    });

    return response.data;
}



