import React from 'react';
import Lottie from 'lottie-react';
import type { TableColumnsType } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Row, Col, Card, Breadcrumb, Form, Input, Button, Tag, message, Tooltip, Table } from 'antd';

import styles from './styles.module.less';
import AppLayout from '../../../components/base/Layout';

import ANIMATIONS from '../../../constants/animations';

const REF_LINK: string = 'https://www.toronet.com/home?ref=674535AGZ54';

const columns: TableColumnsType<any> | undefined = [
    {
        key: 'user',
        width: 200,
        title: 'Invited users',
        dataIndex: 'user',
        align: 'left',
        render: (value) => (
            <Tooltip title={value}>
                <p className={styles.invites__table__user}>
                    {value}
                </p>
            </Tooltip>
        )
    },
    {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (value) => <Tag>{value.toUpperCase()}</Tag>
    },
];

const DATA = [
    {
        id: 1,
        user: '0xb17ff94313477a133377ca7eeb8b24bf5d809d3b',
        status: 'registered',
    },
    {
        id: 2,
        user: '0xb17ff94313477a133377ca7eeb8b24bf5d809d3b',
        status: 'registered',
    },
    {
        id: 3,
        user: '0xb17ff94313477a133377ca7eeb8b24bf5d809d3b',
        status: 'waiting',
    },
    {
        id: 4,
        user: '0xb17ff94313477a133377ca7eeb8b24bf5d809d3b',
        status: 'waiting',
    },
    {
        id: 5,
        user: '0xb17ff94313477a133377ca7eeb8b24bf5d809d3b',
        status: 'waiting',
    },
    {
        id: 6,
        user: '0xb17ff94313477a133377ca7eeb8b24bf5d809d3b',
        status: 'registered',
    },
]

const Invites: React.FC = (): JSX.Element => {
    const [form] = Form.useForm();

    const onFinish = (values: any): void => {
        window.location.href = `mailto:${values.emailAddress}?subject=Get started with Toronet&body=Use my link: ${REF_LINK} to create your Toronet account today and earn 4.00 TORO`;
    }

    const copyToClipboard = async (): Promise<any> => {
        try {
            await navigator.clipboard.writeText(REF_LINK);
            message.success('Link copied to clipboard');

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AppLayout title="Invite Friends" description="Invite friends & business associates to Toronet and get 4 TORO each">
            <Row justify="space-between" align="middle">
                <Col>
                    {/* <h3 className={styles.title}>
                        Invite & Share
                    </h3> */}
                </Col>

                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            Dashboard
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <span>Invite Friends</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row gutter={[24, 24]} justify="space-between" className={styles.spacer}>
                <Col xl={12} lg={12} md={14} sm={18} xs={24}>
                    <Card className={styles.invite}>
                        <h3 className={styles.invite__title}>Invite a friend to Toronet</h3>
                        <div className={styles.invite__animation}>
                            <Lottie loop style={{ width: '100%', height: '100%' }} animationData={ANIMATIONS.friends} />
                        </div>
                        <p className={styles.invite__text}>
                            Know someone curious about crypto? You'll both
                            receive 4.00 in Toros, worth USD 4.00, when they
                            buy or sell $40.00 or more on Toronet.
                        </p>

                        <Form
                            form={form}
                            name="withdraw"
                            initialValues={{
                                emailAddress: ''
                            }}
                            layout="vertical"
                            autoComplete='off'
                            onFinish={onFinish}
                        >
                            <Row gutter={[12, 12]} align="middle">
                                <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                                    <Form.Item
                                        name="emailAddress"
                                        //label="Email address"
                                        hasFeedback
                                        rules={[{ required: true, message: 'Email address is required!' }]}
                                    >
                                        <Input placeholder='user@test.com' size="large" />
                                    </Form.Item>
                                </Col>
                                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item>
                                        <Button block htmlType='submit' size="large" type="primary">
                                            SEND INVITE
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

                        <Row className={styles.spacer} gutter={[12, 12]} align="middle">
                            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                                <Input size="large" value={REF_LINK} readOnly />
                            </Col>
                            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                <Button onClick={copyToClipboard} block size="large" type="primary">
                                    COPY MY LINK
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xl={12}>
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={DATA}
                        //scroll={{ x: 900 }}
                        />
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    )
}

export default Invites;