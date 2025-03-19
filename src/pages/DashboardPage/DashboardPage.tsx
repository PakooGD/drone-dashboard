// src/pages/DashboardPage/DashboardPage.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { droneStore } from '../../shared/stores/droneStore';
import { DroneList,LogWindow,Sidebar } from '../../widgets';
import styles from './DashboardPage.module.css';

export const DashboardPage = observer(() => {
    return (
      <div className={styles.dashboard}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.droneSection}>
            <DroneList />
          </div>
          <div className={styles.logSection}>
            <LogWindow />
          </div>
        </div>
      </div>
    );
  });