import { Drone } from "./IDrone";

export interface AuthResponse {
    accessToken:string;
    refreshToken:string;
    drone: Drone;
}