import React from 'react';
import type { TableColumnsType } from 'antd';
import { HomeOutlined, DollarCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Card, Breadcrumb, Alert, Tooltip, Table, message, Modal, Input, Form, InputNumber, RadioChangeEvent } from 'antd';

import styles from './styles.module.less';
import AppLayout from '../../../components/base/Layout';
import SendTo from '../../../components/ui/Fiat-Coins/SendTo';
import ExchangeFrom from '../../../components/ui/Fiat-Coins/ExchangeFrom';
import ExchangeTo from '../../../components/ui/Fiat-Coins/ExchangeTo';

import IMAGES from '../../../constants/images';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { getCurrencyBalance } from '../../../redux/balances/balance-slice';
import { getCoinExchangeRates, getCoinsTransaction, mintCoins } from '../../../redux/coins/coins-slice';

type TCoin = {
    id: number;
    rateKey: string;
    balKey: string;
    name: string;
    currency: string;
}

const columns: TableColumnsType<any> | undefined = [
    {
        key: 'hash',
        width: 200,
        title: 'Transaction Hash',
        dataIndex: 'EV_Hash',
        align: 'left',
        render: (value) => (
            <Tooltip title={value}>
                <p className={styles.transactions__table__hash}>
                    {value}
                </p>
            </Tooltip>
        )
    },
    {
        key: 'user',
        width: 200,
        title: 'Transaction Address',
        dataIndex: 'EV_To',
        align: 'left',
        render: (value) => (
            <Tooltip title={value}>
                <p className={styles.transactions__table__user}>
                    {value}
                </p>
            </Tooltip>
        )
    },
    {
        key: 'type',
        title: 'Transaction Type',
        dataIndex: 'EV_Event',
        align: 'center',
        filters: [
            {
                text: 'SELL TORO',
                value: 'SellToro'
            },
            {
                text: 'TRANSFER',
                value: 'Transfer'
            },
            {
                text: 'RESERVE TRANSFER',
                value: 'TransferFromReserve'
            },
        ],
        onFilter: (value, record) => record.EV_Event.indexOf(value) === 0,
    },
    {
        key: 'type',
        title: 'Amount sold',
        dataIndex: 'EV_Value',
        align: 'center',
        sorter: (a, b) => a.EV_Value - b.EV_Value,
        render: (value) => (
            <span>
                {Math.floor(Number(value)).toFixed(2)} TORO
            </span>
        )
    },
    {
        key: 'type',
        title: 'Amount gained',
        dataIndex: 'EV_Value2',
        align: 'center',
        sorter: (a, b) => a.EV_Value2 - b.EV_Value2,
        render: (value) => (
            <span>
                {Math.floor(Number(value)).toFixed(2)} TORO
            </span>
        )
    },
    {
        key: 'createdAt',
        title: 'Transaction date',
        dataIndex: 'EV_Time',
        align: 'left',
        render: (value) => (
            <span>{new Date(value).toDateString()}</span>
        )
    },
];

const TABS = [
    {
        id: 'SEND',
        name: 'send'
    },
    {
        id: 'EXCHANGE_FROM',
        name: 'exchange from',
    },
    {
        id: 'EXCHANGE_TO',
        name: 'exchange to'
    }
];

const STABLE_COINS: TCoin[] = [
    {
        id: 1,
        rateKey: 'rate_dollar',
        balKey: 'bal_dollar',
        name: 'TORO USD',
        currency: 'USD',
    },
    {
        id: 2,
        rateKey: 'rate_egp',
        balKey: 'bal_egp',
        name: 'TORO EGP',
        currency: 'EGP',
    },
    {
        id: 3,
        rateKey: 'rate_euro',
        balKey: 'bal_euro',
        name: 'TORO EUR',
        currency: 'EUR',
    },
    {
        id: 4,
        rateKey: 'rate_pound',
        balKey: 'bal_pound',
        name: 'TORO GBP',
        currency: 'GBP',
    },
    {
        id: 5,
        rateKey: 'rate_ksh',
        balKey: 'bal_ksh',
        name: 'TORO KSH',
        currency: 'KSH',
    },
    {
        id: 6,
        rateKey: 'rate_naira',
        balKey: 'bal_naira',
        name: 'TORO NGN',
        currency: 'NGN',
    },
    {
        id: 7,
        rateKey: 'rate_zar',
        balKey: 'bal_zar',
        name: 'TORO ZAR',
        currency: 'ZAR',
    },
    // {
    //     id: 8,
    //     rateKey: 'rate_eth',
    //     balKey: 'bal_eth',
    //     name: 'ETH',
    //     currency: 'ETH'
    // }
];

const FiatCoins: React.FC = (): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const { coinTransactions, coinTransactionStatus, minting } = useAppSelector(state => state.coins);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const [open, setopen] = React.useState<boolean>(false);
    const [activeTab, setActiveTab] = React.useState<string>(TABS[0].id);
    const [selectedCoin, setSelectedCoin] = React.useState<TCoin>(STABLE_COINS[0]);

    React.useEffect(() => {
        fetchCurrencyBalance();
        fetchCoinExchangeRates();

        //eslint-disable-next-line
    }, [selectedCoin]);

    React.useEffect(() => {
        fetchCoinsTransactions();
        //eslint-disable-next-line
    }, [])

    const fetchCurrencyBalance = async (): Promise<any> => {
        if (!user) return;
        const query = { currency: selectedCoin.balKey.split('_')[1], address: user.addr }
        const { payload }: any = await dispatch(getCurrencyBalance(query));
        if (!payload.result) {
            message.error(payload.error);
        }
    }

    const fetchCoinExchangeRates = async (): Promise<any> => {
        const currency = selectedCoin.balKey.split('_')[1];
        const { payload }: any = await dispatch(getCoinExchangeRates(currency));
        if (!payload.result) message.error(payload.error);
    }

    const fetchCoinsTransactions = async (): Promise<any> => {
        if (user) {
            const currency = selectedCoin.balKey.split('_')[1];
            const query = { op: `getaddrtransactions_${currency}`, name1: "addr", value1: `${user.addr}`, name2: 'count', value2: '10' }
            dispatch(getCoinsTransaction(query));
        }
    }

    const callbacks = (): void => {
        fetchCurrencyBalance();
        fetchCoinsTransactions();
    }

    const _renderViews = (): JSX.Element => {
        switch (activeTab) {
            case 'SEND':
                return <SendTo coins={STABLE_COINS} selectedCoin={selectedCoin} onSelect={onSelect} callback={callbacks} />
            case 'EXCHANGE_FROM':
                return <ExchangeFrom coins={STABLE_COINS} selectedCoin={selectedCoin} onSelect={onSelect} callback={callbacks} />
            case 'EXCHANGE_TO':
                return <ExchangeTo coins={STABLE_COINS} selectedCoin={selectedCoin} onSelect={onSelect} callback={callbacks} />
            default:
                return (
                    <Alert
                        message="Invalid Tab"
                        description="This tab does not exist! Looks like someone is cooking beans in our codebase."
                        type="error"
                    />
                )
        }
    };

    const toggleModal = (): void => {
        setopen(prevState => !prevState);
    };

    const onFinish = async (values: any): Promise<any> => {
        if (!user) return;
        const coinPayload = {
            op: "importcurrency",
            currency: selectedCoin.balKey.split('_')[1],
            params: [
                { name: "admin", value: "0xea45bcd1b04233f9240c01d52f773b832704fed0" },
                { name: "adminpwd", value: "toronet" },
                { name: "addr", value: user.addr },
                { name: "val", value: values.amount.toString() }
            ]
        }
        const { payload }: any = await dispatch(mintCoins(coinPayload));
        if (!payload.result) return message.error(payload.error ? payload.error : 'An unexpected error occurred. Please contact a Toronet Administrator!');
        else {
            message.success('Operation successful!');
            form.resetFields();
            toggleModal();
            fetchCurrencyBalance();
        }
    }

    const onSelect = (e: RadioChangeEvent): void => {
        const { value } = e.target;
        const coin = STABLE_COINS.find(coin => coin.name === value);
        if (!coin) return;
        setSelectedCoin(coin);
    }

    return (
        <AppLayout title="Fiat stable coins" description="Start making transactions with the fiat stable coins on the Toronet platform today">
            <Row gutter={[0, 12]} justify="space-between" align="middle">
                <Col>
                    <h3 className={styles.title}>
                        Stable Coins
                    </h3>
                </Col>
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <span>My Dashboard</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            Fiat stable coins
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row className={styles.spacer} gutter={[24, 24]}>
                <Col xl={14} lg={15} md={24} sm={24} xs={24}>
                    <Card className={styles.card} bordered={false} bodyStyle={{ padding: 0 }}>
                        <ul className={styles.card__list}>
                            {TABS.map(tab => (
                                <li
                                    key={tab.id}
                                    onClick={setActiveTab.bind(this, tab.id)}
                                    className={`${styles.card__list__item} ${tab.id === activeTab && styles.active}`}
                                >
                                    {tab.name}
                                </li>
                            ))}
                        </ul>

                        <div className={styles.card__body}>
                            {_renderViews()}
                        </div>

                        <Tooltip placement="rightBottom" title={`Mint new ${selectedCoin.name}`}>
                            <div className={styles.card__mint} onClick={toggleModal}>
                                <div className={styles.card__mint__icon}>
                                    <DollarCircleOutlined />
                                </div>
                                {/* <p className={styles.card__mint__text}>
                                    MINT
                                </p> */}
                            </div>
                        </Tooltip>
                    </Card>
                </Col>
                <Col xl={10} lg={9} md={24} sm={24} xs={24}>
                    <Row gutter={[24, 24]}>
                        <Col xl={24} lg={24} md={12} sm={24} xs={24}>
                            <Card className={styles.recent}>
                                <div className={styles.recent__header}>
                                    <h3 className={styles.recent__title}>
                                        Recent sends
                                    </h3>
                                    <p className={styles.recent__text}>
                                        Easily send coins to a recent destination address.
                                    </p>
                                </div>

                                <div className={styles.recent__empty}>
                                    <img src={IMAGES.recent} alt="recent" />
                                    <p className={styles.recent__empty__text}>
                                        After you send coins, the destination
                                        addresses will appear here
                                    </p>
                                </div>
                            </Card>
                        </Col>
                        <Col xl={24} lg={24} md={12} sm={24} xs={24}>
                            <Card className={styles.learn}>
                                <div className={styles.learn__header}>
                                    <h3 className={styles.learn__title}>
                                        Learn
                                    </h3>
                                    <p className={styles.learn__subtitle}>
                                        Useful guides and tutorials about stable coin trading
                                    </p>
                                </div>

                                <div className={styles.learn__container}>
                                    <div className={styles.learn__item}>
                                        <img className={styles.learn__item__img} src={IMAGES.wallet} alt="stable-coin" />
                                        <div className={styles.learn__item__info}>
                                            <h4>What are stable coins?</h4>
                                            <p>
                                                A stablecoin is a digital currency that is pegged to a
                                                “stable” reserve asset like the U.S. dollar or gold.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.learn__item}>
                                        <img className={styles.learn__item__img} src={IMAGES.stable_coin} alt="stable-coin" />
                                        <div className={styles.learn__item__info}>
                                            <h4>Are there any Market caps on coins?</h4>
                                            <p>
                                                A stablecoin is a digital currency that is pegged to a
                                                “stable” reserve asset like the U.S. dollar or gold.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                </Col>
            </Row>

            <Card className={styles.transactions} loading={coinTransactionStatus === 'pending'}>
                <Row gutter={[0, 12]} justify="space-between" align="middle">
                    <Col>
                        <h3 className={styles.transactions__title}>
                            Fiat coins transactions
                        </h3>
                    </Col>
                    <Col lg={6}>
                        <Input.Search placeholder='Search for an address...' />
                    </Col>
                </Row>
                <Table
                    rowKey="EV_Hash"
                    columns={columns}
                    dataSource={coinTransactions}
                    scroll={{ x: 1400 }}
                    className={styles.transactions__table}
                />
            </Card>

            <Modal
                centered
                maskClosable={false}
                visible={open}
                onCancel={toggleModal}
                okText="SUBMIT"
                onOk={form.submit}
                okButtonProps={{
                    size: 'large',
                    icon: <CheckCircleFilled />,
                    loading: minting === 'pending',
                }}
                cancelButtonProps={{
                    style: { display: 'none' }
                }}
            >
                <h3 className={styles.modal__title}>Mint {selectedCoin.name}</h3>
                <p className={styles.modal__text}>
                    Looks like you're short on {selectedCoin.name}. No worries, we've got
                    you covered. Mint some {selectedCoin.name} to start trading like a PRO.
                </p>

                <Form
                    form={form}
                    name="mint"
                    initialValues={{}}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        name="amount"
                        label="How much do you want to mint?"
                        hasFeedback
                        rules={[{ required: true, message: 'Amount is required!' }]}
                    >
                        <InputNumber
                            min={1}
                            size="large"
                            placeholder="10.00"
                            addonAfter={selectedCoin.name}
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>
    )
}

export default FiatCoins;