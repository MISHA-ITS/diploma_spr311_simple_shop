import axios from "axios";
import EnvConfig from "../config/env";

export const api = axios.create({
    baseURL: EnvConfig.API_URL,
});