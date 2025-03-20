import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { droneStore } from '../../shared/stores/droneStore';
import styles from './DroneList.module.scss';

export const DroneList = observer(() => {
  // Локальное состояние для хранения состояний чекбоксов
  const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});

  // Локальное состояние для хранения видимости меню схем для каждого дрона
  const [menuVisibility, setMenuVisibility] = useState<{ [key: string]: boolean }>({});

  // Локальное состояние для хранения выбранного пути перенаправления для каждого дрона
  const [redirectPaths, setRedirectPaths] = useState<{ [key: string]: string }>({});

  // Обработчик изменения состояния чекбокса
  const handleCheckboxChange = (droneId: string, schemaName: string, isChecked: boolean) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [`${droneId}-${schemaName}`]: isChecked,
    }));
  };

  // Обработчик нажатия на кнопку "Обновить подписки"
  const handleUpdateSubscriptions = async (droneId: string) => {
    try {
      // Собираем состояния чекбоксов для текущего дрона
      const topics = droneStore.drones
        .find((drone) => drone.id === droneId)
        ?.schemas.map((schema) => ({
          schemaName: schema.schemaName,
          status: checkboxStates[`${droneId}-${schema.schemaName}`] || false, // Если состояние не задано, по умолчанию false
        }));

      if (topics) {
        // Отправляем данные на сервер
        await droneStore.updateSubscriptions(droneId, topics);
        alert('Подписки успешно обновлены!');
      }
    } catch (error) {
      console.error('Ошибка при обновлении подписок:', error);
      alert('Не удалось обновить подписки.');
    }
  };

  // Обработчик изменения выбранного пути перенаправления
  const handleRedirectPathChange = (droneId: string, path: string) => {
    setRedirectPaths((prev) => ({
      ...prev,
      [droneId]: path,
    }));
  };

  // Обработчик нажатия на кнопку "Перенаправить"
  const handleRedirectLogs = async (droneId: string) => {
    const selectedPath = redirectPaths[droneId] || 'none'; // Если путь не выбран, по умолчанию 'none'
    try {
      // Отправляем запрос на сервер
      await droneStore.redirectLogs(droneId, selectedPath);
      alert(`Логи перенаправлены в: ${selectedPath}`);
    } catch (error) {
      console.error('Ошибка при перенаправлении логов:', error);
      alert('Не удалось перенаправить логи.');
    }
  };

  // Обработчик клика на блок дрона для переключения видимости меню схем
  const toggleMenuVisibility = (droneId: string) => {
    setMenuVisibility((prev) => ({
      ...prev,
      [droneId]: !prev[droneId], // Переключаем видимость меню для конкретного дрона
    }));
  };

  return (
    <div className={styles.droneList}>
      {droneStore.drones.map((drone) => (
        <div key={drone.id} className={styles.droneBlock}>
          <div className={styles.droneHeader} onClick={() => toggleMenuVisibility(drone.id)}>
            <span>{drone.id}</span>
          </div>
          {menuVisibility[drone.id] && ( // Рендерим меню схем только если оно видимо
            <div className={styles.topics}>
              {drone.schemas.map((schema) => (
                <div key={`${drone.id}-${schema.schemaName}`} className={styles.topic}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkboxStates[`${drone.id}-${schema.schemaName}`] || false}
                      onChange={(e) => {
                        e.stopPropagation(); // Предотвращаем всплытие события
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
          <button
            onClick={(e) => {
              e.stopPropagation(); // Предотвращаем всплытие события, чтобы не сработал клик на блок дрона
              handleUpdateSubscriptions(drone.id);
            }}
            className={styles.updateButton}
          >
            Обновить подписки
          </button>
                        {/* Выпадающий список для выбора пути перенаправления */}
                        <div className={styles.redirectSection}>
                <select
                  value={redirectPaths[drone.id] || 'none'} // Значение по умолчанию 'none'
                  onChange={(e) => handleRedirectPathChange(drone.id, e.target.value)}
                  className={styles.redirectSelect}
                >
                  <option value="none">None</option>
                  <option value="rerun">Rerun</option>
                  <option value="foxglove">Foxglove</option>
                  <option value="site">Окно логов на сайте</option>
                </select>

                {/* Кнопка "Перенаправить" */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    handleRedirectLogs(drone.id);
                  }}
                  className={styles.redirectButton}
                >
                  Перенаправить логи
                </button>
              </div>
              </div>
        </div>
      ))}
    </div>
  );
});