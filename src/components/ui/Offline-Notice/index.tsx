import React from 'react';
import { Row, Col } from 'antd';
import Lottie from 'lottie-react';
import { Detector } from "react-detect-offline";

import styles from './styles.module.less';
import ANIMATIONS from '../../../constants/animations';

const OfflineNotice: React.FC = (): JSX.Element => {
    return (
        <Detector
            render={({ online }) => {
                if (!online) {
                    return (
                        <div className={styles.container}>
                            <Row gutter={[12, 0]} align="middle">
                                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                                    <Lottie loop animationData={ANIMATIONS.no_wifi} />
                                </Col>
                                <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                                    <h3>Weak / No Internet Connection</h3>
                                    <p>
                                        You are currently {online ? "online" : "offline"}.
                                        Please check your internet connection and try again...
                                    </p>
                                </Col>
                            </Row>
                        </div>
                    )
                }
                return null;
            }}
        />
    )
}

export default OfflineNotice;