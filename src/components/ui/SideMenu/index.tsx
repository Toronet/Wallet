import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, Menu, Badge } from 'antd';
import { AppstoreOutlined, GiftOutlined, DollarCircleOutlined, CloudServerOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import styles from './styles.module.less';

import IMAGES from '../../../constants/images';

type TProps = {
    open: boolean;
    close: () => void;
    activePath: string;
    handleMenu: (e: any) => void
}

const SideMenu: React.FC<TProps> = ({ open, close, activePath, handleMenu }): JSX.Element => {
    return (
        <Drawer
            visible={open}
            onClose={close}
            placement="left"
            maskClosable={true}
        >
            <figure className={styles.sidemenu__logo}>
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
        </Drawer>
    )
}

export default SideMenu;