import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { droneStore } from '../../shared/stores/droneStore';
import styles from './DroneList.module.scss';

export const DroneList = observer(() => {
  const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});
  const [menuVisibility, setMenuVisibility] = useState<{ [key: string]: boolean }>({});
  const [redirectPaths, setRedirectPaths] = useState<{ [key: string]: string }>({});


  const handleCheckboxChange = (droneId: string, schemaName: string, isChecked: boolean) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [`${droneId}-${schemaName}`]: isChecked,
    }));
  };

  const handleUpdateSubscriptions = async (droneId: string) => {
    const selectedPath = redirectPaths[droneId] || 'site'; 
    try {
      await droneStore.redirectLogs(droneId, selectedPath);

      const topics = droneStore.drones
        .find((drone) => drone.id === droneId)
        ?.schemas.map((schema) => ({
          schemaName: schema.schemaName,
          status: checkboxStates[`${droneId}-${schema.schemaName}`] || false, 
        }));
      if (topics) {
        await droneStore.updateSubscriptions(droneId, topics);
      }
    } catch (error) {
      console.error('Ошибка при обновлении подписок:', error);
    }
  };

  const handleLoadUlog = async (droneId: string) => {
    try {
      await droneStore.loadLogs(droneId);
    } catch (error) {
      console.error('Ошибка при загрузке логов:', error);
    }
  };


  const handleRedirectPathChange = (droneId: string, path: string) => {
    setRedirectPaths((prev) => ({
      ...prev,
      [droneId]: path,
    }));
  };

  const toggleMenuVisibility = (droneId: string) => {
    setMenuVisibility((prev) => ({
      ...prev,
      [droneId]: !prev[droneId], 
    }));
  };

  return (
    <div className={styles.droneList}>
      {droneStore.drones.map((drone) => (
        <div key={drone.id} className={styles.droneBlock}>
          <div className={styles.droneHeader} onClick={() => toggleMenuVisibility(drone.id)}>
            <span>{drone.id}</span>
          </div>
          {menuVisibility[drone.id] && ( 
            <div className={styles.topics}>
              {drone.schemas.map((schema) => (
                <div key={`${drone.id}-${schema.schemaName}`} className={styles.topic}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkboxStates[`${drone.id}-${schema.schemaName}`] || false}
                      onChange={(e) => {
                        e.stopPropagation(); 
                        handleCheckboxChange(drone.id, schema.schemaName, e.target.checked);
                      }}
                    />
                    <span className={styles.topicName}>{schema.topic}</span>
                    <span className={styles.schemaName}>{schema.schemaName}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
          <div className={styles.droneMenu}>
            <div className={styles.menuSection}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateSubscriptions(drone.id);
                }}
                className={styles.updateButton}
              > Изменить параметры </button>
              <div className={styles.redirectSection}>
                <select
                  value={redirectPaths[drone.id] || 'site'} 
                  onChange={(e) => handleRedirectPathChange(drone.id, e.target.value)}
                  className={styles.redirectSelect}
                >
                  <option value="site">Окно логов на сайте</option>
                  <option value="foxglove">Foxglove</option> 
                </select>
              </div>
            </div> 
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLoadUlog(drone.id);
              }}
              className={styles.updateButton}
            > Загрузить ULOG </button>
          </div>
        </div>
      ))}
    </div>
  );
});