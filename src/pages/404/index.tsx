import React from 'react';
import { Button } from 'antd';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.less';
import ANIMATIONS from '../../constants/animations';

const NotFound: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className={styles.container}>
            <div className={styles.animation}>
                <Lottie loop style={{ width: '100%', height: "100%" }} animationData={ANIMATIONS.not_found} />
            </div>
            <h1 className={styles.title}>Page not found!</h1>
            <p className={styles.text}>
                Don't freak out, remain calm, you didn't get hacked. Looks
                like our junior software engineer is cooking beans somewhere
                in our codebase. Please go back while we turn off the cooker.
            </p>
            <Button onClick={goBack} size="large" type="primary">
                TAKE ME BACK
            </Button>
        </div>
    )
}

export default NotFound