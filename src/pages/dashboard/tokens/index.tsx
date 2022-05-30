import React from 'react';
import type { TableColumnsType } from 'antd';
import { HomeOutlined, MoneyCollectOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Card, Breadcrumb, Alert, Tooltip, Table, message, Modal, Input, Form, InputNumber } from 'antd';

import styles from './styles.module.less';
import AppLayout from '../../../components/base/Layout';
import SendTo from '../../../components/ui/Tokens/SendTo';
import ExchangeTo from '../../../components/ui/Tokens/ExchangeTo';
import ExchangeFrom from '../../../components/ui/Tokens/ExchangeFrom';

import IMAGES from '../../../constants/images';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { getToroAddrTransactions, mintToro } from '../../../redux/transactions/transactions-slice';
import { getToroBalance, getBalances, getExchangeRates } from '../../../redux/balances/balance-slice';

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
]

const Tokens: React.FC = (): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const { transactions, transactionStatus, minting } = useAppSelector(state => state.transactions);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const [open, setopen] = React.useState<boolean>(false);
    const [activeTab, setActiveTab] = React.useState<string>(TABS[0].id);

    React.useEffect(() => {
        fetchBalances();
        fetchToroBalance();
        fetchExchangeRates();
        fetchToroTransactions();
        //eslint-disable-next-line
    }, []);

    const fetchToroBalance = async (): Promise<any> => {
        if (!user) return;
        const query = { name: 'addr', value: user.addr }
        const { payload }: any = await dispatch(getToroBalance(query));
        if (!payload.result) {
            message.error(payload.error);
        }
    }

    const fetchBalances = async (): Promise<any> => {
        if (user) {
            const query = { name: "addr", value: `${user.addr}` }
            const { payload }: any = await dispatch(getBalances(query));
            if (!payload.result) {
                message.error(payload.error);
            }
        }
    };

    const fetchToroTransactions = async (): Promise<any> => {
        if (user) {
            const query = { name1: "addr", value1: `${user.addr}`, name2: 'count', value2: '10' }
            dispatch(getToroAddrTransactions(query));
        }
    }

    const fetchExchangeRates = async (): Promise<any> => {
        const { payload }: any = await dispatch(getExchangeRates());
        if (!payload.result) message.error(payload.error);
    }

    const _renderViews = (): JSX.Element => {
        switch (activeTab) {
            case 'SEND':
                return <SendTo callback={fetchToroTransactions} />
            case 'EXCHANGE_FROM':
                return <ExchangeFrom callback={fetchToroTransactions} />
            case 'EXCHANGE_TO':
                return <ExchangeTo callback={fetchToroTransactions} />
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
        const toroPayload = {
            op: "mint",
            params: [
                { name: "admin", value: "0xea45bcd1b04233f9240c01d52f773b832704fed0" },
                { name: "adminpwd", value: "toronet" },
                { name: "addr", value: user.addr },
                { name: "val", value: values.amount.toString() }
            ]
        }
        const { payload }: any = await dispatch(mintToro(toroPayload));
        if (!payload.result) return message.error(payload.error ? payload.error : 'An unexpected error occurred. Please contact a Toronet Administrator!');
        else {
            message.success('Operation successful!');
            form.resetFields();
            toggleModal();
            fetchToroBalance();
        }
    }

    return (
        <AppLayout>
            <Row gutter={[0, 12]} justify="space-between" align="middle">
                <Col>
                    <h3 className={styles.title}>
                        Toronet Tokens
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
                            Toronet tokens
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

                        <Tooltip placement="rightBottom" title="Mint new TORO's">
                            <div className={styles.card__mint} onClick={toggleModal}>
                                <div className={styles.card__mint__icon}>
                                    <MoneyCollectOutlined />
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
                                        Easily send tokens to a recent destination address.
                                    </p>
                                </div>

                                <div className={styles.recent__empty}>
                                    <img src={IMAGES.recent} alt="recent" />
                                    <p className={styles.recent__empty__text}>
                                        After you send Toros, the destination
                                        addresses will appear here
                                    </p>
                                </div>
                            </Card>
                        </Col>
                        <Col xl={24} lg={24} md={12} sm={24} xs={24}>
                            <Card className={styles.learn}>
                                <div className={styles.learn__header}>
                                    <h3 className={styles.learn__title}>
                                        learn
                                    </h3>
                                    <p className={styles.learn__subtitle}>
                                        Useful guides and tutorials about Toronet trading
                                    </p>
                                </div>

                                <div className={styles.learn__container}>
                                    <div className={styles.learn__item}>
                                        <img className={styles.learn__item__img} src={IMAGES.wallet} alt="stable-coin" />
                                        <div className={styles.learn__item__info}>
                                            <h4>What is TORO?</h4>
                                            <p>
                                                The Tóró token is the basic token of the TóróNet platform.
                                                The Tóró is a stablecoin backed by true reserves.
                                                A benefit of using a stablecoin as the platform's main
                                                coin is that the transaction fees on the platform is
                                                also relatively stable compared to other blockchains
                                                which utilize an unbacked and potentially volatile or
                                                deflationary token.
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
                            Toronet token transactions
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
                <h3 className={styles.modal__title}>Mint TORO</h3>
                <p className={styles.modal__text}>
                    Looks like you're short on TORO's. No worries, we've got
                    you covered. Mint some TORO's to start trading like a PRO.
                </p>

                <Form
                    form={form}
                    name="mint-toro"
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
                            addonAfter="TORO"
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

export default Tokens;