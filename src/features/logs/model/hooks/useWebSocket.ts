import  { useEffect, useState } from 'react';


const useWebSocket = (url:string) => {
    const [message, setMessage] = useState(null)

    const socket = new WebSocket(url);
    
    useEffect(()=>{
    
        socket.onopen = () => {
            console.log('connection open');
        };
    
        socket.onmessage = (event) => {
            setMessage(event.data)
            // const message = JSON.parse(event.data);
            // this.addLog(message.content);
        };
    
        return () => {
            socket.close()
        }
    }, [url])
    return message
}


export default useWebSocket;