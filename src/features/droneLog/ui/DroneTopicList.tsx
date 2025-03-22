import React from 'react';
import { observer } from 'mobx-react-lite';
import { DroneTopicBlock } from './DroneTopicBlock';
import { Log } from '../../../shared/types/ITypes';
import { Dropdown } from '../../../shared/ui/Dropdown/Dropdown';

interface DroneTopicListProps {
    droneId: string;
    topics: Map<string, Log[]>; 
}

export const DroneTopicList: React.FC<DroneTopicListProps> = observer(({ droneId, topics }) => {
    return (
        <Dropdown title={`Drone ID: ${droneId}`}>
            {Array.from(topics.entries()).map(([topic, logs]) => (
                <DroneTopicBlock key={topic} drone={droneId} topic={topic} logs={logs} />
            ))}
        </Dropdown>
    );
});