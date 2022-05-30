import React from 'react';
import type { RadioChangeEvent } from 'antd';
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Form, Input, Radio, Skeleton, Button, InputNumber, message, Modal } from 'antd';

import styles from './styles.module.less';

import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { getToroBalance } from '../../../../redux/balances/balance-slice';
import { calculateCryptoFee, calculateCryptoFeeResult, verifyCryptoTransaction } from '../../../../redux/crypto/crypto-slice';

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
    onSelect: (e: RadioChangeEvent) => void;
    callback: () => void;
}

const ExchangeFrom: React.FC<TProps> = ({ coins, selectedCoin, onSelect, callback }): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const { calculating, verifying, rateStatus, rates } = useAppSelector(state => state.crypto);
    const { cryptoBalance, cryptoStatus, balance, balanceStatus } = useAppSelector(state => state.balances);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const [open, setOpen] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>('');

    React.useEffect(() => {
        fetchToroBalance();

        //eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        if (selectedCoin && rates && balance) {
            form.setFieldsValue({
                exchangeRate: Number(rates.exchangerate).toFixed(2),
                balance: Number(balance.balance).toFixed(2)
            })
        }
    }, [selectedCoin, form, balance, rates]);

    const fetchToroBalance = async (): Promise<any> => {
        if (user) {
            const query = { name: "addr", value: `${user.addr}` }
            const { payload }: any = await dispatch(getToroBalance(query));
            if (!payload.result) {
                message.error(payload.error);
            }
        }
    };

    const onFinish = async (values: any): Promise<any> => {
        if (!user || !selectedCoin) return;
        const query = {
            op: 'calculatesellfee',
            crypto: selectedCoin.balKey.split('_')[1],
            name1: 'client',
            value1: user.addr,
            name2: 'val',
            value2: values.amount.toString()
        }
        const { payload }: any = await dispatch(calculateCryptoFee(query));
        if (!payload.result) message.error(payload.error ? payload.error : 'An error occured. Please contact a Toronet Administrator.');
        else {
            fetchBuyResult(payload.fee);
        }
    }

    const fetchBuyResult = async (fee: string): Promise<any> => {
        if (!user || !selectedCoin) return;
        const query = {
            op: "calculatesellresult",
            crypto: selectedCoin.balKey.split('_')[1],
            name1: 'client',
            value1: user.addr,
            name2: 'val',
            value2: form.getFieldValue('amount')
        }
        const { payload }: any = await dispatch(calculateCryptoFeeResult(query));
        if (!payload.result) message.error(payload.error ? payload.error : 'An error occured. Please contact a Toronet Administrator.');
        else {
            Modal.confirm({
                centered: true,
                title: 'Confirm Transaction!',
                icon: <ExclamationCircleOutlined />,
                content: `This transaction will have a fee of ${fee} ${selectedCoin.currency}. You stand to make ${Number(payload.amount).toFixed(2)} TORO from this transaction. Do you want to continue ?`,
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
            op: 'selltoro',
            crypto: selectedCoin.balKey.split('_')[1],
            params: [
                { name: 'client', value: user.addr },
                { name: 'clientpwd', value: password },
                { name: 'val', value: form.getFieldValue('amount').toString() },
            ]
        };
        const { payload }: any = await dispatch(verifyCryptoTransaction(userPayload));
        if (!payload.result) message.error(payload.error);
        else {
            form.resetFields();
            toggleModal();
            setPassword('');
            callback();
            message.success('Transaction successful!');
        }
    }

    const toggleModal = (): void => {
        setOpen(prevState => !prevState);
    }

    return (
        <div className={styles.container}>
            <Row justify="center" align='middle'>
                <Col>
                    <Radio.Group onChange={onSelect} defaultValue={selectedCoin.name}>
                        <Row gutter={[6, 6]} justify='center'>
                            {coins.map(coin => (
                                <Col key={coin.id}>
                                    <Radio.Button value={coin.name}>
                                        {coin.name}
                                    </Radio.Button>
                                </Col>
                            ))}
                        </Row>
                    </Radio.Group>
                </Col>
            </Row>

            {cryptoStatus === 'pending' ? (
                <Row className={styles.spacer} justify='center'>
                    <Col>
                        <Skeleton.Input active />
                    </Col>
                </Row>
            ) : (
                <h3 className={styles.title}>
                    {Math.floor(Number(cryptoBalance?.balance)).toFixed(2)}
                    <sup>{selectedCoin.currency}</sup>
                </h3>
            )}

            <Row justify='center'>
                <Col xl={14} lg={16} md={13} sm={18} xs={24}>
                    <Form
                        form={form}
                        name="sendTo"
                        initialValues={{}}
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="exchangeRate"
                            label={`Exchange rate`}
                            hasFeedback
                            rules={[{ required: false, message: 'Exchange rate is required!' }]}
                        >
                            {rateStatus === 'pending' ? (
                                <Skeleton.Button block active />
                            ) : (
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    size="large"
                                    placeholder="0.00"
                                    addonBefore={selectedCoin && `${selectedCoin.name} - TORO`}
                                    readOnly
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            name="balance"
                            label='Balance'
                            hasFeedback
                            tooltip="Number of TORO's in your wallet"
                            rules={[{ required: false, message: 'Balance is required!' }]}
                        >
                            {balanceStatus === 'pending' ? (
                                <Skeleton.Button block active />
                            ) : (
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    size="large"
                                    placeholder="0.00"
                                    addonBefore="TORO"
                                    readOnly
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            name="amount"
                            label="Amount to exchange"
                            hasFeedback
                            tooltip={`How much TORO do you want to exchange?`}
                            rules={[{ required: true, message: 'Amount is required!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={1}
                                size="large"
                                placeholder="10"
                                addonBefore="TORO"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                block
                                size="large"
                                type="primary"
                                htmlType='submit'
                                className={styles.button}
                                loading={calculating === 'pending'}
                            >
                                CONTINUE
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
        </div>
    )
}

export default ExchangeFrom