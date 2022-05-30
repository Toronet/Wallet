import React from 'react';
import type { TableColumnsType } from 'antd';
import { HomeOutlined, DollarCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Card, Breadcrumb, Alert, Tooltip, Table, message, Modal, Input, Form, InputNumber, RadioChangeEvent } from 'antd';

import styles from './styles.module.less';
import AppLayout from '../../../components/base/Layout';
import SendTo from '../../../components/ui/Platform-Coins/SendTo';
import ExchangeFrom from '../../../components/ui/Platform-Coins/ExchangeFrom';
import ExchangeTo from '../../../components/ui/Platform-Coins/ExchangeTo';

import IMAGES from '../../../constants/images';
import { mintPlatformCoins } from '../../../redux/coins/coins-slice';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { getBalances, getExchangeRates } from '../../../redux/balances/balance-slice';
import { getAddrTransactions } from '../../../redux/transactions/transactions-slice';

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
        render: (value) => {
            return value && value !== 'NULL' ? (
                <Tooltip title={value}>
                    <p className={styles.transactions__table__user}>
                        {value}
                    </p>
                </Tooltip>
            ) : <span>N/A</span>
        }
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
        rateKey: 'rate_espees',
        balKey: 'bal_espees',
        name: 'ESPEES',
        currency: 'ESPS'
    },
    {
        id: 2,
        rateKey: 'rate_plast',
        balKey: 'bal_plast',
        name: 'PLAST',
        currency: 'PLAST'
    },
];

const PlatformCoins: React.FC = (): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const { minting } = useAppSelector(state => state.coins);
    const { transactions, transactionStatus } = useAppSelector(state => state.transactions);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const [open, setopen] = React.useState<boolean>(false);
    const [activeTab, setActiveTab] = React.useState<string>(TABS[0].id);
    const [selectedCoin, setSelectedCoin] = React.useState<TCoin>(STABLE_COINS[0]);

    React.useEffect(() => {
        fetchBalances();
        fetchExchangeRates();

        //eslint-disable-next-line
    }, [selectedCoin]);

    React.useEffect(() => {
        fetchAddrTransactions();
        //eslint-disable-next-line
    }, [])

    const fetchBalances = async (): Promise<any> => {
        if (user) {
            const query = { name: "addr", value: `${user.addr}` }
            const { payload }: any = await dispatch(getBalances(query));
            if (!payload.result) {
                message.error(payload.error);
            }
        }
    }

    const fetchExchangeRates = async (): Promise<any> => {
        const { payload }: any = await dispatch(getExchangeRates());
        if (!payload.result) message.error(payload.error);
    }

    const fetchAddrTransactions = async (): Promise<any> => {
        if (user) {
            const query = {
                op: `getaddrtransactions_${selectedCoin.balKey.split('_')[1]}`,
                name1: "addr",
                value1: `${user.addr}`,
                name2: 'count',
                value2: '10'
            }
            dispatch(getAddrTransactions(query));
        }
    }

    const _renderViews = (): JSX.Element => {
        switch (activeTab) {
            case 'SEND':
                return <SendTo coins={STABLE_COINS} selectedCoin={selectedCoin} onSelect={onSelect} callback={fetchAddrTransactions} />
            case 'EXCHANGE_FROM':
                return <ExchangeFrom coins={STABLE_COINS} selectedCoin={selectedCoin} onSelect={onSelect} callback={fetchAddrTransactions} />
            case 'EXCHANGE_TO':
                return <ExchangeTo coins={STABLE_COINS} selectedCoin={selectedCoin} onSelect={onSelect} callback={fetchAddrTransactions} />
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
            op: "importcoin",
            currency: selectedCoin.balKey.split('_')[1],
            params: [
                { name: "admin", value: "0xea45bcd1b04233f9240c01d52f773b832704fed0" },
                { name: "adminpwd", value: "toronet" },
                { name: "addr", value: user.addr },
                { name: "val", value: values.amount.toString() }
            ]
        }
        const { payload }: any = await dispatch(mintPlatformCoins(coinPayload));
        if (!payload.result) return message.error(payload.error ? payload.error : 'An unexpected error occurred. Please contact a Toronet Administrator!');
        else {
            message.success('Operation successful!');
            form.resetFields();
            toggleModal();
            fetchBalances();
        }
    }

    const onSelect = (e: RadioChangeEvent): void => {
        const { value } = e.target;
        const coin = STABLE_COINS.find(coin => coin.name === value);
        if (!coin) return;
        setSelectedCoin(coin);
    }

    return (
        <AppLayout>
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
                                            <h4>What are ESPEES tokens?</h4>
                                            <p>
                                                The Espees token is the token designed specifically
                                                for the KingsPay App, and the international community
                                                of over 20 million members utilizing the App.
                                                The Espees is a stablecoin, and helps preserve the assets
                                                of members by utilizing a stablecoin which holds value
                                                strongly compared to some of the deflationary fiat
                                                currencies in some of our member's locations.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.learn__item}>
                                        <img className={styles.learn__item__img} src={IMAGES.wallet} alt="stable-coin" />
                                        <div className={styles.learn__item__info}>
                                            <h4>What are PLAST tokens?</h4>
                                            <p>
                                                The Plastoken is the token used for the plastic waste
                                                disposal and reward mechanism. Each plastoken is equivalent
                                                to a market determined quantity of plastic waste that a
                                                redeemable at industrial redemption locations within the
                                                community utilizing Plastokens.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                </Col>
            </Row>

            <Card className={styles.transactions} loading={transactionStatus === 'pending'}>
                <Row gutter={[0, 12]} justify="space-between" align="middle">
                    <Col>
                        <h3 className={styles.transactions__title}>
                            Platform coins transactions
                        </h3>
                    </Col>
                    <Col lg={6}>
                        <Input.Search placeholder='Search for an address...' />
                    </Col>
                </Row>
                <Table
                    rowKey="EV_Hash"
                    columns={columns}
                    dataSource={transactions}
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
                    you covered. Start minting below to start trading like a PRO.
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

export default PlatformCoins;