import axios from "axios";

const baseURL = process.env["NEXT_PUBLIC_ASSISTANT_URL"];

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_ASSISTANT_URL is not defined");
}

export const api = axios.create({ baseURL });
