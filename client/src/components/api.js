import axios from "axios";

export function computeAPIUrlPrefix() {
    if (window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1")) {
        return "http://localhost:5000";
    } else {
        return window.location.href + "/api";
    }
}



export async function getCompletion(text) {
    const queryParams = {
        text: text
    }

    const response = await axios.get(`${computeAPIUrlPrefix()}/completion`, {
        params: queryParams
    });

    return response.data;
}



