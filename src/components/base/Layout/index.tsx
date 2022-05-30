import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Row, Col, Badge, Dropdown, Divider } from 'antd';
import { AppstoreOutlined, GiftOutlined, GiftFilled, DollarCircleOutlined, BellFilled, CloudServerOutlined, QuestionCircleOutlined, UserOutlined, SettingOutlined, LineChartOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';

import styles from './styles.module.less';
import OfflineNotice from '../../ui/Offline-Notice';

import IMAGES from '../../../constants/images';
import { logoutUser } from '../../../redux/auth/auth-slice';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';

const { Header, Content, Footer, Sider } = Layout;

type TProps = {
    theme?: string;
    title?: string;
    description?: string;
    children: React.ReactNode
}

const AppLayout: React.FC<TProps> = ({ children, title, description, theme }): JSX.Element => {
    const { user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const location = useLocation();

    const [activePath, setActivePath] = React.useState<string>(location.pathname);

    const logout = (): void => {
        dispatch(logoutUser());
    }

    const handleMenu = (e: any): void => {
        setActivePath(e.key);
    }

    const dropdownMenu = () => (
        <div className={styles.dropdown}>
            <div className={styles.dropdown__top}>
                <h4>{user?.addr}</h4>
                <small>CLIENT USER</small>
            </div>
            <ul className={styles.dropdown__list}>
                <li className={styles.dropdown__list__item}>
                    <Link to="/dashboard">
                        <UserOutlined /> Change Address
                    </Link>
                </li>
                <li className={styles.dropdown__list__item}>
                    <Link to="/dashboard">
                        <SettingOutlined /> Account Settings
                    </Link>
                </li>
                <li className={styles.dropdown__list__item}>
                    <Link to="/dashboard">
                        <LineChartOutlined /> Login Activity
                    </Link>
                </li>
                <Divider />
                <li className={styles.dropdown__list__item}>
                    <span onClick={logout}>
                        <LogoutOutlined /> Logout of Toronet
                    </span>
                </li>
            </ul>
        </div>
    )

    return (
        <Layout className={styles.layout}>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="theme-color" content={theme} />
            </Helmet>

            <Sider
                width={300}
                breakpoint="xl"
                collapsedWidth={0}
                className={styles.layout__sider}
            >
                <figure className={styles.layout__sider__logo}>
                    <img src={IMAGES.logo_brand} alt="toronet" />
                </figure>

                <Menu
                    theme="light"
                    mode="inline"
                    onClick={handleMenu}
                    defaultSelectedKeys={[activePath]}
                >
                    <Menu.ItemGroup title="overview">
                        <Menu.Item key="/dashboard" icon={<AppstoreOutlined />}>
                            <Link to="/dashboard">My Dashboard</Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="tokens">
                        <Menu.Item key="/dashboard/tokens" icon={<CloudServerOutlined />}>
                            <Link to="/dashboard/tokens">
                                Toronet Tokens
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="stable coins">
                        <Menu.Item key="/dashboard/fiat-coins" icon={<DollarCircleOutlined />}>
                            <Link to="/dashboard/fiat-coins">
                                Fiat Stable Coins
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/platform-coins" icon={<DollarCircleOutlined />}>
                            <Link to="/dashboard/platform-coins">
                                Platform Stable Coins
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="cryptos">
                        <Menu.Item key="/dashboard/crypto-currencies" icon={<CloudServerOutlined />}>
                            <Link to="/dashboard/crypto-currencies">
                                Crypto Currencies
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="others">
                        <Menu.Item key="/dashboard/invites" icon={<GiftOutlined />}>
                            <Link to="/dashboard/invites">
                                Invite Friends <Badge count={Number(4).toFixed(2)} />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/support" icon={<QuestionCircleOutlined />}>
                            <Link to="/dashboard/support">
                                Help & Support
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
            </Sider>

            <Layout className={styles.layout__content}>
                <Header className={styles.layout__content__header}>

                    <div className={styles.layout__content__header__menu}>
                        <MenuOutlined />
                        <img src={IMAGES.logo_brand} alt="toronet" />
                    </div>
                    <span className={styles.layout__content__header__title}>
                        <strong>Did you hear about our latest feature?</strong> {" "}
                        Toro is now...
                    </span>
                    <Row gutter={[28, 0]} align="middle">
                        <Col>
                            <Badge offset={[-5, 0]} dot>
                                <BellFilled className={styles.layout__content__header__icon} />
                            </Badge>
                        </Col>
                        <Col>
                            <GiftFilled className={styles.layout__content__header__icon} />
                        </Col>
                        <Col>
                            <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight">
                                <img className={styles.layout__content__header__avatar} src="https://randomuser.me/api/portraits/women/79.jpg" alt="user" />
                            </Dropdown>
                        </Col>
                    </Row>
                </Header>

                <Content className={styles.layout__content__body}>
                    {children}
                </Content>

                <Footer className={styles.layout__content__footer}>
                    <ul>
                        <li>
                            <Link to="/dashboard">Home</Link>
                        </li>
                        <li>
                            <Link to="/careers">Careers</Link>
                        </li>
                        <li>
                            <Link to="/legals">Legal & Privacy</Link>
                        </li>
                        <li>
                            <span>&copy; {new Date().getFullYear()} Toronet Web Wallet</span>
                        </li>
                    </ul>
                </Footer>
            </Layout>

            <OfflineNotice />
        </Layout>
    )
}

AppLayout.defaultProps = {
    theme: '#05a165',
    title: 'Toronet Web Wallet',
    description: 'Financial inclusion via technology'
}

export default AppLayout;