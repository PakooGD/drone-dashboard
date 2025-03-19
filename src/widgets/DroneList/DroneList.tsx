// src/widgets/DroneList/DroneList.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { droneStore } from '../../shared/stores/droneStore';
import styles from './DroneList.module.scss';

export const DroneList = observer(() => {
  return (
    <div className={styles.droneList}>
      {droneStore.drones.map((drone) => (
        <div key={drone.id} className={styles.droneBlock}>
          <div
            className={styles.droneHeader}
            // onClick={() => droneStore.toggleDroneExpansion(drone.id)}
          >
            <span>{drone.id}</span>
            <span>Active topics: {drone.topics.filter((t) => t.isSubscribed).length}</span>
          </div>
          {drone.isExpanded && (
            <div className={styles.topics}>
              {drone.topics.map((topic) => (
                <div key={topic.name} className={styles.topic}>
                  <label>
                    <input
                      type="checkbox"
                      checked={topic.isSubscribed}
                      onChange={() => droneStore.toggleTopicSubscription(drone.id, topic.name)}
                    />
                    {topic.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});