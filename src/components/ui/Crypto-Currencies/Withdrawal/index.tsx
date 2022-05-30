import React from 'react';
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Button, Form, Input, InputNumber, Card, Select, Modal, message } from 'antd';

import styles from './styles.module.less';

import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { calculateCryptoFee, verifyCryptoTransaction } from '../../../../redux/crypto/crypto-slice';

type TCoin = {
    id: number;
    rateKey: string;
    balKey: string;
    name: string;
    currency: string;
}

type TProps = {
    coins: TCoin[];
    selectedCoin: TCoin;
    callback: () => void;
}

const { Option } = Select;

const Withdrawal: React.FC<TProps> = ({ coins, selectedCoin, callback }): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const { verifying } = useAppSelector(state => state.crypto);
    const { cryptoBalance, cryptoStatus } = useAppSelector(state => state.balances);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const [open, setOpen] = React.useState(false);
    const [password, setPassword] = React.useState<string>('');

    const toggleModal = (): void => {
        setOpen(prevState => !prevState);
    };

    const onFinish = async (values: any): Promise<any> => {
        if (!user) return;
        const query = {
            op: "calculateexportfee",
            crypto: selectedCoin.balKey.split('_')[1],
            name1: 'client',
            value1: user.addr,
            name2: 'val',
            value2: values.amount
        }
        const { payload }: any = await dispatch(calculateCryptoFee(query));
        if (!payload.result) message.error(payload.error ? payload.error : 'An error occured. Please contact a Toronet Administrator.');
        else {
            Modal.confirm({
                centered: true,
                title: 'Confirm Transaction!',
                icon: <ExclamationCircleOutlined />,
                content: `This transaction will have a fee of ${payload.fee} ${selectedCoin.currency}. Do you want to continue ?`,
                okText: 'Go Ahead',
                okType: 'primary',
                cancelText: 'No',
                onOk() {
                    toggleModal();
                    Modal.destroyAll();
                },
                onCancel() {
                    console.log('Action cancelled')
                },
            });
        }
    }

    const onVerify = async (): Promise<any> => {
        if (!user) return;
        const userPayload = {
            op: 'withdrawcrypto',
            crypto: selectedCoin.balKey.split('_')[1],
            params: [
                { name: 'client', value: user.addr },
                { name: 'clientpwd', value: password },
                { name: 'val', value: form.getFieldValue('amount').toString() },
                { name: 'crypto', value: user.addr }
            ]
        };
        const { payload }: any = await dispatch(verifyCryptoTransaction(userPayload));
        if (!payload.result) message.error(payload.error);
        else {
            form.resetFields();
            toggleModal();
            setPassword('');
            callback();
            message.success('Withdrawal successful!');
        }
    }

    return (
        <Card loading={cryptoStatus === 'pending'} className={styles.withdraw}>
            <div className={styles.withdraw__header}>
                <h3 className={styles.withdraw__header__title}>
                    Withdrawal
                </h3>
                <p className={styles.withdraw__header__text}>
                    Take out your precious cryptos from your web wallet
                </p>
            </div>
            <h3 className={styles.withdraw__title}>
                {Number(cryptoBalance?.balance).toFixed(2)} <sup>{selectedCoin.currency}</sup>
            </h3>

            <Row justify="center" align="middle">
                <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                    <Form
                        form={form}
                        name="withdraw"
                        initialValues={{
                            currency: 'ETH'
                        }}
                        layout="vertical"
                        autoComplete='off'
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="address"
                            label="ETH Address (Ropsten) to Receive:"
                            hasFeedback
                            rules={[{ required: true, message: 'Eth Ropsten address is required!' }]}
                        >
                            <Input placeholder='0xb17ff94313477a133377ca7eeb8b24bf5d809d3b' size="large" />
                        </Form.Item>

                        <Row gutter={[12, 12]} align='middle'>
                            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                                <Form.Item
                                    name="amount"
                                    label="Amount to send"
                                    hasFeedback
                                    tooltip="How much TORO's do you want to send?"
                                    rules={[{ required: true, message: 'Amount is required!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={1}
                                        size="large"
                                        placeholder="10"
                                        addonBefore="ETH"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                <Form.Item
                                    name="currency"
                                    label="Currency"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Currency is required!' }]}
                                >
                                    <Select size="large">
                                        {coins.map(coin => (
                                            <Option value={coin.currency}>
                                                {coin.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item style={{ marginTop: '1rem' }}>
                            <Button block htmlType='submit' size="large" type="primary">
                                I'D LIKE TO MAKE A WITHDRAWAL
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <Modal
                centered
                maskClosable={false}
                visible={open}
                onCancel={toggleModal}
                okText="VERIFY & SUBMIT"
                onOk={onVerify}
                okButtonProps={{
                    size: 'large',
                    icon: <CheckCircleFilled />,
                    loading: verifying === 'pending',
                }}
                cancelButtonProps={{
                    style: { display: 'none' }
                }}
            >
                <h3 className={styles.modal__title}>
                    Authentication Required!
                </h3>
                <p className={styles.modal__text}>
                    For security reasons, please enter the password
                    to your Toronet address: <span>({user?.addr})</span>.
                    We're simply making sure you are who you say you are
                </p>

                <Input.Password
                    onPressEnter={onVerify}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Toronet password"
                    size="large"
                    disabled={verifying === 'pending'}
                />
            </Modal>
        </Card>
    )
}

export default Withdrawal