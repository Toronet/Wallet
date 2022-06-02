import React from 'react';
import { Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { HomeOutlined, DollarCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Card, Breadcrumb, Alert, Tooltip, Table, Tabs, message, Modal, Input, Form, InputNumber, RadioChangeEvent } from 'antd';

import styles from './styles.module.less';
import AppLayout from '../../../components/base/Layout';
import SendTo from '../../../components/ui/Crypto-Currencies/SendTo';
import ExchangeFrom from '../../../components/ui/Crypto-Currencies/ExchangeFrom';
import ExchangeTo from '../../../components/ui/Crypto-Currencies/ExchangeTo';
import Withdrawal from '../../../components/ui/Crypto-Currencies/Withdrawal';

import IMAGES from '../../../constants/images';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { getCryptoBalance } from '../../../redux/balances/balance-slice';
import { getCryptoTransactions, getCryptoExchangeRates, mintCryptos, getCryptoLinkedAddresses } from '../../../redux/crypto/crypto-slice';

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

const linkedAddrColumns: TableColumnsType<any> | undefined = [
    {
        key: 's/n',
        title: 'S/N',
        render: (_value, _record, index) => <span>{index += 1}</span>
    },
    {
        key: 'user',
        title: 'Linked Address',
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
]

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
    },
];

const STABLE_COINS: TCoin[] = [
    {
        id: 1,
        rateKey: 'rate_eth',
        balKey: 'bal_eth',
        name: 'ETH',
        currency: 'ETH'
    },
];

const CryptoCurrencies: React.FC = (): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const { cryptoStatus } = useAppSelector(state => state.balances);
    const { cryptoTransactions, cryptoTransactionStatus, minting, linkedAddrs, linkedAddrStatus } = useAppSelector(state => state.crypto);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const [open, setopen] = React.useState<boolean>(false);
    const [activeTab, setActiveTab] = React.useState<string>(TABS[0].id);
    const [selectedCoin, setSelectedCoin] = React.useState<TCoin>(STABLE_COINS[0]);

    React.useEffect(() => {
        fetchBalance();
        fetchExchangeRates();
        //eslint-disable-next-line
    }, [selectedCoin]);

    React.useEffect(() => {
        fetchCryptoLinkedAddr();
        fetchCryptoTransactions();
        //eslint-disable-next-line
    }, [])

    const fetchBalance = async (): Promise<any> => {
        if (user) {
            const query = { crypto: selectedCoin.balKey.split('_')[1], address: `${user.addr}` }
            const { payload }: any = await dispatch(getCryptoBalance(query));
            if (!payload.result) {
                message.error(payload.error);
            }
        }
    }

    const fetchExchangeRates = async (): Promise<any> => {
        const crypto = selectedCoin.balKey.split('_')[1];
        const { payload }: any = await dispatch(getCryptoExchangeRates(crypto));
        if (!payload.result) message.error(payload.error);
    }

    const fetchCryptoTransactions = async (): Promise<any> => {
        if (user) {
            const query = {
                op: `getaddrtransactions_${selectedCoin.balKey.split('_')[1]}`,
                name1: "addr",
                value1: `${user.addr}`,
                name2: 'count',
                value2: '10'
            }
            dispatch(getCryptoTransactions(query));
        }
    }

    const fetchCryptoLinkedAddr = async (): Promise<any> => {
        if (user) {
            const query = {
                crypto: selectedCoin.balKey.split('_')[1],
                name1: "toro",
                value1: `${user.addr}`,
            }
            dispatch(getCryptoLinkedAddresses(query));
        }
    }

    const callbacks = (): void => {
        fetchBalance();
        fetchCryptoTransactions();
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
                        showIcon
                        type="error"
                        description="This tab does not exist! Looks like someone is cooking beans in our codebase."
                        message="Invalid Tab"
                    />
                )
        }
    };

    const toggleModal = (): void => {
        setopen(prevState => !prevState);
    };

    const onMintFinish = async (values: any): Promise<any> => {
        if (!user) return;
        const coinPayload = {
            op: "importcrypto",
            crypto: selectedCoin.balKey.split('_')[1],
            params: [
                { name: "admin", value: "0xea45bcd1b04233f9240c01d52f773b832704fed0" },
                { name: "adminpwd", value: "toronet" },
                { name: "addr", value: user.addr },
                { name: "val", value: values.amount.toString() }
            ]
        }
        const { payload }: any = await dispatch(mintCryptos(coinPayload));
        if (!payload.result) return message.error(payload.error ? payload.error : 'An unexpected error occurred. Please contact a Toronet Administrator!');
        else {
            message.success('Operation successful!');
            form.resetFields();
            toggleModal();
            fetchBalance();
        }
    }

    const onSelect = (e: RadioChangeEvent): void => {
        const { value } = e.target;
        const coin = STABLE_COINS.find(coin => coin.name === value);
        if (!coin) return;
        setSelectedCoin(coin);
    }

    return (
        <AppLayout title="Crypto Currencies" description="List your crypto currencies, make withdrawls, deposits & perform transactions all on Toronet today">
            <Row gutter={[0, 12]} justify="space-between" align="middle">
                <Col>
                    <h3 className={styles.title}>
                        Cryptos
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
                            Crypto currencies
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row className={styles.spacer} gutter={[24, 24]}>
                <Col xl={14} lg={14} md={24} sm={24} xs={24}>
                    <Withdrawal
                        coins={STABLE_COINS}
                        callback={callbacks}
                        selectedCoin={selectedCoin}
                    />
                </Col>
                <Col xl={10} lg={10} md={24} sm={24} xs={24}>
                    <Card loading={cryptoStatus === 'pending'} className={styles.deposit}>
                        <div className={styles.deposit__header}>
                            <h3 className={styles.deposit__header__title}>
                                Deposit
                            </h3>
                            <p className={styles.deposit__header__text}>
                                Deposit your crypto currencies in 3 easy steps.
                            </p>
                        </div>

                        <div className={styles.deposit__body}>
                            <div className={styles.deposit__body__item}>
                                <Tag color="#DE2F40">Step 1</Tag>
                                <p className={styles.deposit__body__item__text}>
                                    Confirm that the Ethereum address which you want
                                    to use to transfer Ether has been linked with your
                                    Toronet address. If not, link the Eth address first.
                                </p>
                            </div>
                            <div className={styles.deposit__body__item}>
                                <Tag color="#DE2F40">Step 2</Tag>
                                <p className={styles.deposit__body__item__text}>
                                    On Ethereum Ropsten testnet, choose a Ether wallet
                                    and transfer an amount of Ether to the following
                                    Ethereum address: {" "} "<strong>{user?.addr}</strong>".
                                    Note that you need to cover additional
                                    transaction fee on Ropsten.
                                </p>
                            </div>
                            <div className={styles.deposit__body__item}>
                                <Tag color="#DE2F40">Step 3</Tag>
                                <p className={styles.deposit__body__item__text}>
                                    The same amount of Ether will be shown
                                    on your Toronet address.
                                </p>
                            </div>
                        </div>
                    </Card>
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
                                        <img className={styles.learn__item__img} src={IMAGES.ether} alt="stable-coin" />
                                        <div className={styles.learn__item__info}>
                                            <h4>What is Ethereum?</h4>
                                            <p>
                                                Ethereum is the second-biggest cryptocurrency by market cap
                                                after Bitcoin. It is also a decentralized computing platform
                                                that can run a wide variety of applications — including the
                                                entire universe of DeFi.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Card className={styles.transactions} loading={cryptoTransactionStatus === 'pending' || linkedAddrStatus === 'pending'}>
                <Tabs type="card" defaultActiveKey='1' size="large">
                    <Tabs.TabPane tab="Transactions" key="1">
                        <Row gutter={[0, 12]} justify="space-between" align="middle">
                            <Col>
                                <h3 className={styles.transactions__title}>
                                    Crypto Transactions
                                </h3>
                            </Col>
                            <Col lg={6}>
                                <Input.Search placeholder='Search for an address...' />
                            </Col>
                        </Row>
                        <Table
                            rowKey="EV_Hash"
                            columns={columns}
                            dataSource={cryptoTransactions}
                            scroll={{ x: 1400 }}
                            className={styles.transactions__table}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={`Linked Addresses`} key="2">
                        <Row gutter={[0, 12]} justify="space-between" align="middle">
                            <Col>
                                <h3 className={styles.transactions__title}>
                                    Linked {selectedCoin.currency} Addresses
                                </h3>
                            </Col>
                            <Col lg={6}>
                                <Input.Search placeholder='Search for an address...' />
                            </Col>
                        </Row>
                        <Table
                            rowKey="s/n"
                            columns={linkedAddrColumns}
                            dataSource={linkedAddrs}
                            className={styles.transactions__table}
                        />
                    </Tabs.TabPane>
                </Tabs>
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
                    onFinish={onMintFinish}
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
                            max={20}
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

export default CryptoCurrencies;