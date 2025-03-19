import { IDrone } from "./IDrone";

export interface AuthResponse {
    accessToken:string;
    refreshToken:string;
    drone: IDrone;
}