import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { DroneTopicList } from '../../features/droneLog/ui/DroneTopicList';
import { logStore } from '../../entities/log/model/logStore';

export const LogViewer: React.FC = observer(() => {
    useEffect(() => {
        logStore.createConnection();
        return () => {
            logStore.closeConnection();
        };
    }, []);

    const droneIds: string[] = Array.from(logStore.logs.keys());

    return (
        <div>
            <h1>Logs</h1>

            {droneIds.map((id) => {
                const topics = logStore.logs.get(id);
                return topics ? (
                    <DroneTopicList key={id} droneId={id} topics={topics} />
                ) : null;
            })}
        </div>
    );
});