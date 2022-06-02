import React from 'react';
import Lottie from "lottie-react";
import Marquee from "react-fast-marquee";
import { Divider, TableColumnsType, Tag } from 'antd';
import { Row, Col, Card, Button, Tooltip, Table, message } from 'antd';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

import styles from './styles.module.less';
import AppLayout from '../../components/base/Layout';

import IMAGES from '../../constants/images';
import ANIMATIONS from '../../constants/animations';

import useGreeting from '../../hooks/useGreeting';
import { getBalances } from '../../redux/balances/balance-slice';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { getAddrTransactions } from '../../redux/transactions/transactions-slice';

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

const Dashboard: React.FC = (): JSX.Element => {
  const { user } = useAppSelector(state => state.auth);
  const { balances, balancesStatus } = useAppSelector(state => state.balances);
  const { transactions, transactionStatus } = useAppSelector(state => state.transactions);
  const dispatch = useAppDispatch();

  const [greeting] = useGreeting();

  React.useEffect(() => {
    fetchBalances();
    fetchTransactions();
    //eslint-disable-next-line
  }, [user]);

  const fetchBalances = async (): Promise<any> => {
    if (user) {
      const query = { name: "addr", value: `${user.addr}` }
      const { payload }: any = await dispatch(getBalances(query));
      if (!payload.result) {
        message.error(payload.error);
      }
    }
  };

  const fetchTransactions = async (): Promise<any> => {
    if (user) {
      const query = {
        op: "getaddrtransactions",
        name1: "addr",
        value1: `${user.addr}`,
        name2: 'count',
        value2: '5'
      }
      dispatch(getAddrTransactions(query));
    }
  }

  return (
    <AppLayout title="Toronet Dashboard" description="Access your dashboard and get up-to date information about your TORO tokens and cryptocurrencies">

      <Row>
        <Col lg={24}>
          <Card bordered={false} bodyStyle={{ padding: '2rem' }} className={styles.banner}>
            <Row gutter={[0, 48]} justify='space-between' align="middle">
              <Col xl={14} lg={14} md={12} sm={24} xs={24}>
                <div className={styles.banner__info}>
                  <h3 className={styles.banner__info__title}>
                    {greeting}, <br /> {user?.addr}
                  </h3>
                  <p className={styles.banner__info__text}>
                    TóróNet is a platform built for financial
                    aspirations of human communities, specifically beyond the
                    reach of the traditional financial industry as well as most
                    blockchain platforms....
                  </p>

                  <Button type="primary" size="large">
                    CONTINUE READING
                  </Button>
                </div>
              </Col>

              <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                <Lottie loop style={{ width: '100%', height: '15rem' }} animationData={ANIMATIONS.blockchain} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Marquee pauseOnHover className={styles.spacer}>
        <div className={styles.coins}>
          <Row gutter={[12, 0]} align="middle">
            <Col>
              <figure className={styles.coins__img}>
                <span>TU</span>
              </figure>
            </Col>
            <Col>
              <p className={styles.coins__subtitle}>
                Toro usd
              </p>
            </Col>
          </Row>
          <h3 className={styles.coins__title}>
            {Number(balances?.bal_toro).toFixed(2)} <sup>TUSD</sup>
          </h3>
          <span className={`${styles.coins__text} ${styles.danger}`}>
            -2.42 (-2.05)
          </span>
        </div>

        <div className={styles.coins}>
          <Row gutter={[12, 0]} align="middle">
            <Col>
              <figure className={styles.coins__img}>
                <span>TE</span>
              </figure>
            </Col>
            <Col>
              <p className={styles.coins__subtitle}>
                Toro egp
              </p>
            </Col>
          </Row>
          <h3 className={styles.coins__title}>
            {Number(balances?.bal_egp).toFixed(2)} <sup>TEGP</sup>
          </h3>
          <span className={`${styles.coins__text} ${styles.success}`}>
            +141.42 (+1.03)
          </span>
        </div>

        <div className={styles.coins}>
          <Row gutter={[12, 0]} align="middle">
            <Col>
              <figure className={styles.coins__img}>
                <span>TR</span>
              </figure>
            </Col>
            <Col>
              <p className={styles.coins__subtitle}>
                Toro euro
              </p>
            </Col>
          </Row>
          <h3 className={styles.coins__title}>
            {Number(balances?.bal_euro).toFixed(2)} <sup>TEUR</sup>
          </h3>
          <span className={`${styles.coins__text} ${styles.success}`}>
            +55.42 (+1.16)
          </span>
        </div>

        <div className={styles.coins}>
          <Row gutter={[12, 0]} align="middle">
            <Col>
              <figure className={styles.coins__img}>
                <span>TP</span>
              </figure>
            </Col>
            <Col>
              <p className={styles.coins__subtitle}>
                Toro gbp
              </p>
            </Col>
          </Row>
          <h3 className={styles.coins__title}>
            {Number(balances?.bal_pound).toFixed(2)} <sup>TGBP</sup>
          </h3>
          <span className={`${styles.coins__text} ${styles.success}`}>
            +141.42 (+1.03)
          </span>
        </div>

        <div className={styles.coins}>
          <Row gutter={[12, 0]} align="middle">
            <Col>
              <figure className={styles.coins__img}>
                <span>TK</span>
              </figure>
            </Col>
            <Col>
              <p className={styles.coins__subtitle}>
                Toro ksh
              </p>
            </Col>
          </Row>
          <h3 className={styles.coins__title}>
            {Number(balances?.bal_ksh).toFixed(2)} <sup>TKSH</sup>
          </h3>
          <span className={`${styles.coins__text} ${styles.danger}`}>
            -141.42 (-1.03)
          </span>
        </div>

        <div className={styles.coins}>
          <Row gutter={[12, 0]} align="middle">
            <Col>
              <figure className={styles.coins__img}>
                <span>TN</span>
              </figure>
            </Col>
            <Col>
              <p className={styles.coins__subtitle}>
                Toro NGN
              </p>
            </Col>
          </Row>
          <h3 className={styles.coins__title}>
            {Number(balances?.bal_naira).toFixed(2)} <sup>TNGN</sup>
          </h3>
          <span className={`${styles.coins__text} ${styles.danger}`}>
            -8.42 (-0.03)
          </span>
        </div>

        <div className={styles.coins}>
          <Row gutter={[12, 0]} align="middle">
            <Col>
              <figure className={styles.coins__img}>
                <span>TZ</span>
              </figure>
            </Col>
            <Col>
              <p className={styles.coins__subtitle}>
                Toro zar
              </p>
            </Col>
          </Row>
          <h3 className={styles.coins__title}>
            {Number(balances?.bal_zar).toFixed(2)} <sup>TZAR</sup>
          </h3>
          <span className={`${styles.coins__text} ${styles.success}`}>
            +47.25 (+2.05)
          </span>
        </div>
      </Marquee>

      <Row gutter={[12, 24]} className={styles.spacer}>
        <Col xl={6} lg={6} md={12} sm={12} xs={24}>
          <Card loading={balancesStatus === 'pending'} className={styles.crypto}>
            <Row gutter={[12, 0]} align='middle'>
              <Col>
                <img className={styles.crypto__img} src={IMAGES.eth} alt="eth" />
              </Col>
              <Col>
                <p className={styles.crypto__label}>
                  Bridged Ethereum
                </p>
              </Col>
            </Row>
            <h3 className={styles.crypto__title}>
              ETH {Number(balances?.bal_eth).toFixed(2)}
            </h3>
            <Row gutter={[12, 0]} align="middle">
              <Col>
                <p className={styles.crypto__text}>36,651.20</p>
              </Col>
              <Col>
                <Tag color="error">-0.79%</Tag>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xl={6} lg={6} md={12} sm={12} xs={24}>
          <Card loading={balancesStatus === 'pending'} className={styles.crypto}>
            <Row gutter={[12, 0]} align='middle'>
              <Col>
                <img className={styles.crypto__img} src={IMAGES.bitcoin} alt="eth" />
              </Col>
              <Col>
                <p className={styles.crypto__label}>
                  Bridged Bitcoin
                </p>
              </Col>
            </Row>
            <h3 className={styles.crypto__title}>
              BTC 0.00
            </h3>
            <Row gutter={[12, 0]} align="middle">
              <Col>
                <p className={styles.crypto__text}>36,651.20</p>
              </Col>
              <Col>
                <Tag color="success">+0.79%</Tag>
              </Col>
            </Row>
            <span className={styles.crypto__badge}>coming soon</span>
          </Card>
        </Col>

        <Col xl={6} lg={6} md={12} sm={12} xs={24}>
          <Card loading={balancesStatus === 'pending'} className={styles.crypto}>
            <Row gutter={[12, 0]} align='middle'>
              <Col>
                <img className={styles.crypto__img} src={IMAGES.avax} alt="eth" />
              </Col>
              <Col>
                <p className={styles.crypto__label}>
                  Bridged Avax
                </p>
              </Col>
            </Row>
            <h3 className={styles.crypto__title}>
              AVX 0.00
            </h3>
            <Row gutter={[12, 0]} align="middle">
              <Col>
                <p className={styles.crypto__text}>36,651.20</p>
              </Col>
              <Col>
                <Tag color="success">+0.79%</Tag>
              </Col>
            </Row>
            <span className={styles.crypto__badge}>coming soon</span>
          </Card>
        </Col>

        <Col xl={6} lg={6} md={12} sm={12} xs={24}>
          <Card loading={balancesStatus === 'pending'} className={styles.crypto}>
            <Row gutter={[12, 0]} align='middle'>
              <Col>
                <img className={styles.crypto__img} src={IMAGES.bnb} alt="eth" />
              </Col>
              <Col>
                <p className={styles.crypto__label}>
                  Bridged BNB
                </p>
              </Col>
            </Row>
            <h3 className={styles.crypto__title}>
              BNB 0.00
            </h3>
            <Row gutter={[12, 0]} align="middle">
              <Col>
                <p className={styles.crypto__text}>36,651.20</p>
              </Col>
              <Col>
                <Tag color="error">-0.79%</Tag>
              </Col>
            </Row>
            <span className={styles.crypto__badge}>coming soon</span>
          </Card>
        </Col>
      </Row>

      <Row gutter={[12, 12]} className={styles.spacer}>
        <Col xl={18} lg={24} md={24} sm={24} xs={24}>
          <Card className={styles.transactions} loading={transactionStatus === 'pending'}>
            <h3 className={styles.transactions__title}>
              Most recent Toronet transactions
            </h3>
            <Table
              rowKey="EV_Hash"
              columns={columns}
              dataSource={transactions}
              scroll={{ x: 1400 }}
              className={styles.transactions__table}
            />
          </Card>
        </Col>

        <Col xl={6} lg={24} md={24} sm={24} xs={24}>
          <Card className={styles.tokens} loading={balancesStatus === 'pending'}>
            <h3 className={styles.tokens__title}>
              All Tokens
            </h3>

            <div className={styles.tokens__item}>
              <Row gutter={[24, 24]} justify="space-between" align="middle">
                <Col>
                  <h3 className={styles.tokens__item__title}>toro</h3>
                  <p className={styles.tokens__item__text}>
                    {Number(balances?.bal_toro).toFixed(2)}
                  </p>
                </Col>
                <Col xl={10} lg={5} md={6} sm={6} xs={8}>
                  <Sparklines data={[5, 10, 5, 20, 8, 15]}>
                    <SparklinesLine color="green" />
                    <SparklinesSpots />
                  </Sparklines>
                </Col>
              </Row>
            </div>
            <Divider />
            <div className={styles.tokens__item}>
              <Row gutter={[24, 24]} justify="space-between" align="middle">
                <Col>
                  <h3 className={styles.tokens__item__title}>plast</h3>
                  <p className={styles.tokens__item__text}>
                    {Number(balances?.bal_plast).toFixed(2)}
                  </p>
                </Col>
                <Col xl={10} lg={5} md={6} sm={6} xs={8}>
                  <Sparklines data={[5, 5, 2, 7, 8, 6]}>
                    <SparklinesLine color="red" />
                  </Sparklines>
                </Col>
              </Row>
            </div>
            <Divider />
            <div className={styles.tokens__item}>
              <Row gutter={[24, 24]} justify="space-between" align="middle">
                <Col>
                  <h3 className={styles.tokens__item__title}>espees</h3>
                  <p className={styles.tokens__item__text}>
                    {Number(balances?.bal_espees).toFixed(2)}
                  </p>
                </Col>
                <Col xl={10} lg={5} md={6} sm={6} xs={8}>
                  <Sparklines data={[5, 9, 3, 4, 6, 6]}>
                    <SparklinesLine color="red" />
                  </Sparklines>
                </Col>
              </Row>
            </div>
            <Divider />
            <div className={styles.tokens__item}>
              <Row gutter={[24, 24]} justify="space-between" align="middle">
                <Col>
                  <h3 className={styles.tokens__item__title}>aza</h3>
                  <p className={styles.tokens__item__text}>
                    0.00
                  </p>
                </Col>
                <Col xl={10} lg={5} md={6} sm={6} xs={8}>
                  <Sparklines data={[5, 10, 5, 20, 8, 15]}>
                    <SparklinesLine color="green" />
                  </Sparklines>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  )
}

export default Dashboard;