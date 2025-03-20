import { TopicSchema } from './ISchema'

export interface Drone{
    id:string;
    schemas:TopicSchema[];
}