import React from 'react';
import { Row, Col, Form, Radio, Input, Select, Skeleton, Button, InputNumber, message, Modal } from 'antd';
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';

import styles from './styles.module.less';

import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { calculateFee, calculateFeeResult, verifyExTransaction } from '../../../../redux/transactions/transactions-slice';
const { Option } = Select;

type TProps = {
    callback: () => void;
}

type TCoin = {
    id: number;
    rateKey: string;
    balKey: string;
    name: string;
    currency: string;
}

const STABLE_COINS: TCoin[] = [
    {
        id: 1,
        rateKey: 'rate_dollar',
        balKey: 'bal_dollar',
        name: 'TORO_USD',
        currency: 'USD',
    },
    {
        id: 2,
        rateKey: 'rate_egp',
        balKey: 'bal_egp',
        name: 'TORO_EGP',
        currency: 'EGP',
    },
    {
        id: 3,
        rateKey: 'rate_euro',
        balKey: 'bal_euro',
        name: 'TORO_EUR',
        currency: 'EUR',
    },
    {
        id: 4,
        rateKey: 'rate_pound',
        balKey: 'bal_pound',
        name: 'TORO_GBP',
        currency: 'GBP',
    },
    {
        id: 5,
        rateKey: 'rate_ksh',
        balKey: 'bal_ksh',
        name: 'TORO_KSH',
        currency: 'KSH',
    },
    {
        id: 6,
        rateKey: 'rate_naira',
        balKey: 'bal_naira',
        name: 'TORO_NGN',
        currency: 'NGN',
    },
    {
        id: 7,
        rateKey: 'rate_zar',
        balKey: 'bal_zar',
        name: 'TORO_ZAR',
        currency: 'ZAR',
    },
    {
        id: 8,
        rateKey: 'rate_eth',
        balKey: 'bal_eth',
        name: 'ETH',
        currency: 'ETH'
    }
];

const ExchangeTo: React.FC<TProps> = ({ callback }): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const { calculating, verifying } = useAppSelector(state => state.transactions);
    const { balance, balances, balanceStatus, balancesStatus, rateStatus, rates } = useAppSelector(state => state.balances);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const [open, setOpen] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>('');
    const [selectedCoin, setSelectedCoin] = React.useState<TCoin>();

    React.useEffect(() => {
        if (selectedCoin && rates && balances) {
            //@: loop through the rates and get the selected coin's rate
            Object.entries(rates).map(([key, value]) => {
                if (selectedCoin.rateKey === key) {
                    form.setFieldsValue({ exchangeRate: Number(value).toFixed(2) })
                }
                return ([key, value])
            });
            //@: loop through the balances and get the selected coin's balance
            Object.entries(balances).map(([key, value]) => {
                if (selectedCoin.balKey === key) {
                    form.setFieldsValue({ balance: Number(value).toFixed(2) })
                }
                return ([key, value])
            });
        }
    }, [selectedCoin, form, rates, balances]);

    const onFinish = async (values: any): Promise<any> => {
        if (!user || !selectedCoin) return;
        const query = {
            op: 'calculatesellfee',
            currency: selectedCoin.balKey.split('_')[1],
            name1: 'client',
            value1: user.addr,
            name2: 'val',
            value2: values.amount.toString()
        }
        const { payload }: any = await dispatch(calculateFee(query));
        if (!payload.result) message.error(payload.error ? payload.error : 'An error occured. Please contact a Toronet Administrator.');
        else {
            fetchBuyResult(payload.fee);
        }
    }

    const fetchBuyResult = async (fee: string): Promise<any> => {
        if (!user || !selectedCoin) return;
        const query = {
            op: 'calculatesellresult',
            currency: selectedCoin.balKey.split('_')[1],
            name1: 'client',
            value1: user.addr,
            name2: 'val',
            value2: form.getFieldValue('amount')
        }
        const { payload }: any = await dispatch(calculateFeeResult(query));
        if (!payload.result) message.error(payload.error ? payload.error : 'An error occured. Please contact a Toronet Administrator.');
        else {
            Modal.confirm({
                centered: true,
                title: 'Confirm Transaction!',
                icon: <ExclamationCircleOutlined />,
                content: `This transaction will have a fee of ${fee} TORO. You stand to make ${Number(payload.amount).toFixed(2)} TORO from this transaction. Do you want to continue ?`,
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
            currency: selectedCoin?.balKey.split('_')[1],
            op: 'buytoro',
            params: [
                { name: 'client', value: user.addr },
                { name: 'clientpwd', value: password },
                { name: 'val', value: form.getFieldValue('amount').toString() },
            ]
        };
        const { payload }: any = await dispatch(verifyExTransaction(userPayload));
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

    const onSelect = (coinId: number): void => {
        const coin = STABLE_COINS.find(coin => coin.id === coinId);
        if (!coin) return;
        setSelectedCoin(coin);
    }

    return (
        <div className={styles.container}>
            <Row justify="center">
                <Col>
                    <Radio.Group defaultValue="TORO">
                        <Radio.Button value="TORO">TORO</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>

            {balanceStatus === 'pending' ? (
                <Row className={styles.spacer} justify='center'>
                    <Col>
                        <Skeleton.Input active />
                    </Col>
                </Row>
            ) : (
                <h3 className={styles.title}>
                    {Math.floor(Number(balance?.balance)).toFixed(2)}
                    <sup>TORO</sup>
                </h3>
            )}

            <Row justify='center'>
                <Col xl={16} lg={16} md={13} sm={16} xs={12}>
                    <Form
                        form={form}
                        name="sendTo"
                        initialValues={{}}
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="stableCoin"
                            label="Select a stable coin"
                            hasFeedback
                            rules={[{ required: true, message: 'Stable coin is required!' }]}
                        >
                            <Select size="large" placeholder="TORO_USD" loading={rateStatus === 'pending' || balancesStatus === 'pending'} onChange={val => onSelect(val)}>
                                {STABLE_COINS.map(coin => (
                                    <Option key={coin.id} value={coin.id}>
                                        {coin.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="exchangeRate"
                            label={`Exchange rate`}
                            hasFeedback
                            rules={[{ required: false, message: 'Exchange rate is required!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                size="large"
                                placeholder="0.00"
                                addonBefore={selectedCoin && `TORO-${selectedCoin.currency}`}
                                readOnly
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="amount"
                            label="Amount"
                            hasFeedback
                            tooltip="How much TORO's do you want to send?"
                            rules={[{ required: true, message: 'Amount is required!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={1}
                                size="large"
                                placeholder="0.00"
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

export default ExchangeTo;