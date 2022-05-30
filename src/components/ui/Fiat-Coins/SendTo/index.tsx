import React from 'react';
import type { RadioChangeEvent } from 'antd';
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Form, Input, Radio, Skeleton, Button, InputNumber, message, Modal } from 'antd';

import styles from './styles.module.less';

import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { calculateCoinFee, verifyCoinTransaction } from '../../../../redux/coins/coins-slice';

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

const SendTo: React.FC<TProps> = ({ coins, onSelect, callback, selectedCoin }): JSX.Element => {
  const { user } = useAppSelector(state => state.auth);
  const { calculating, verifying } = useAppSelector(state => state.coins);
  const { currBalance, currencyStatus } = useAppSelector(state => state.balances);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const [open, setOpen] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');

  const onFinish = async (values: any): Promise<any> => {
    const query = {
      op: 'calculatetxfee',
      currency: selectedCoin.balKey.split('_')[1],
      name1: 'client',
      value1: values.address,
      name2: 'val',
      value2: values.amount
    };
    const { payload }: any = await dispatch(calculateCoinFee(query));
    if (!payload.result) {
      message.error(payload.error);
    }
    else {
      Modal.confirm({
        centered: true,
        title: 'Confirm Transaction!',
        icon: <ExclamationCircleOutlined />,
        content: `This transaction will have a fee of ${payload.fee} TORO. Do you want to continue ?`,
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
      op: 'transfer',
      currency: selectedCoin.balKey.split('_')[1],
      params: [
        { name: 'client', value: user.addr },
        { name: 'clientpwd', value: password },
        { name: 'to', value: form.getFieldValue('address') },
        { name: 'val', value: form.getFieldValue('amount').toString() },
      ]
    };
    const { payload }: any = await dispatch(verifyCoinTransaction(userPayload));
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
        <Col xl={20} lg={20} md={18} sm={24} xs={24}>
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

      {currencyStatus === 'pending' ? (
        <Row className={styles.spacer} justify='center'>
          <Col>
            <Skeleton.Input active />
          </Col>
        </Row>
      ) : (
        <h3 className={styles.title}>
          {Math.floor(Number(currBalance?.balance)).toFixed(2)}
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
              name="address"
              label="Destination address"
              hasFeedback
              tooltip="The Toronet address you want to send TORO's to"
              rules={[{ required: true, message: 'Destination address is required!' }]}
            >
              <Input placeholder='0xb17ff94313477a133377ca7eeb8b24bf5d809d3b' size="large" />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount to send"
              hasFeedback
              tooltip={`How much ${selectedCoin.currency} do you want to send?`}
              rules={[{ required: true, message: 'Amount is required!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                size="large"
                placeholder="10"
                addonBefore={selectedCoin.currency}
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

export default SendTo