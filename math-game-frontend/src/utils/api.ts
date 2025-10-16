import { ILoginForm } from "@/app/login/page";
import { IRegisterForm } from "@/app/types/userTypes";
import axios from "axios";
import { LoginResponse, RegisterResponse, StartGameResponse, SubmitGameRequest, SubmitGameResponse } from "./types";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

export const registerUser = async (formData: IRegisterForm): Promise<RegisterResponse> => {
    try {
        const res = await axios.post<RegisterResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
            formData,
            { headers: { "Content-Type": "application/json" } }
        );
        return res.data;
    } catch (error: any) {
        return error.response?.data || { message: "Something went wrong" };
    }
};

export const loginUser = async (data: ILoginForm): Promise<LoginResponse> => {
    try {
        const res = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data);
        return res.data;
    } catch (error: any) {
        return error.response?.data || { message: "Something went wrong" };
    }
};

export const startGame = async (payload: { userId: string }): Promise<StartGameResponse> => {
    try {
        const res = await axios.post<StartGameResponse>(`${process.env.NEXT_PUBLIC_API_URL}/game/start`, payload);
        return res.data;
    } catch (error: any) {
        return { message: "Something went wrong", gameId: "", questions: [] };
    }
};

export const submitGame = async (data: SubmitGameRequest): Promise<SubmitGameResponse> => {
    try {
        const res = await API.post<SubmitGameResponse>(`${process.env.NEXT_PUBLIC_API_URL}/game/submit`, data);
        return res.data;
    } catch (error) {
        return { message: "Something went wrong", totalQuestions: 0, score: 0, results: [] };
    }
};
