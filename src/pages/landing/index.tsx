import React from 'react';
import { useNavigate } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import { Modal, Form, Input, notification, message, Row, Col } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './styles.module.less';

import IMAGES from '../../constants/images';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { loginUser, logoutUser, registerUser } from '../../redux/auth/auth-slice';

const ValidIcon = <CheckCircleFilled style={{ marginRight: '.5rem', color: '#00b256' }} />;
const InvalidIcon = <CloseCircleFilled style={{ marginRight: '.5rem', color: '#de2f40' }} />;

const Landing: React.FC = (): JSX.Element => {
  const { user, status, registering } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [open, setOpen] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = React.useState<boolean>(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      triggerConfirm();
    }
    //eslint-disable-next-line
  }, []);

  const triggerConfirm = () => {
    Modal.confirm({
      centered: true,
      title: 'Active session detected!',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to continue from you left off ?',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        navigate('/dashboard', { replace: true });
      },
      onCancel() {
        dispatch(logoutUser());
      },
    });
  }

  const onLogin = async (): Promise<any> => {
    if (!address) {
      message.error('Address cannot be empty! Please enter your Toronet address.');
      return;
    }

    const userPayload = { op: 'isaddress', name: 'addr', value: address };
    const { error, payload }: any = await dispatch(loginUser(userPayload));
    if (!payload.result) {
      message.error(payload.error);
      return;
    }
    else if (!error) {
      navigate('/dashboard', { replace: true });
    }
  }

  const onFinish = async (values: any): Promise<any> => {
    if (values.password !== values.confirmPassword) {
      form.setFields([
        { name: 'password', errors: ['Your passwords do not match'] },
        { name: 'confirmPassword', errors: ['Your passwords do not match'] },
      ]);
      return;
    }

    else if (!isPasswordValid) {
      form.setFields([
        { name: 'password', errors: ['Your password is too weak'] },
        { name: 'confirmPassword', errors: ['Your password is too weak'] },
      ])
      return;
    }
    const newValues = { ...values };
    delete newValues.confirmPassword;

    const userPayload = { op: 'createkey', params: [{ name: "pwd", value: newValues.password }] };
    const { error, payload }: any = await dispatch(registerUser(userPayload));
    if (!payload.result) {
      message.error(payload.error);
      return;
    }
    else if (!error) {
      notification.success({
        duration: 6.5,
        message: "Operation successful!",
        description: `Your Toronet web address has been created successfully. Your address is ${payload.address}`,
      });
      form.resetFields();
      toggleModal();
      setAddress(payload.address);
    }
  }

  const toggleModal = () => setOpen(prevState => !prevState);

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddress(value);
  }

  return (
    <section className={styles.container}>
      <nav className={styles.nav}>
        <figure className={styles.nav__brand}>
          <img src={IMAGES.logo_brand_2} alt="toronet" />
        </figure>
      </nav>

      <div className={styles.hero}>
        <h1 className={styles.hero__title}>
          Buy and sell <span>digital</span> currency
        </h1>

        <p className={styles.hero__text}>
          TóróNet platform is blockchain built to empower
          human aspirations in unbanked and underbanked communities.
        </p>

        <div className={styles.hero__search}>
          <input
            required
            type="text"
            value={address}
            autoComplete='off'
            onChange={handleAddress}
            placeholder="Enter your Toronet address..."
          />
          <button onClick={onLogin}>
            {status === 'pending' ? <LoadingOutlined spin /> : 'Search Address'}
          </button>
        </div>

        <p className={styles.hero__subtitle} onClick={toggleModal}>
          Don't have a TóróNet address ? Create one here.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.grid__item}>
          <img src={IMAGES.cubes} alt="cubes" />
          <h3 className={styles.grid__item__title}>Experienced</h3>
          <p className={styles.grid__item__text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Nisi eum sint quibusdam vero?
          </p>
          <a href="https://google.com" target="_blank" rel="noreferrer">Read more</a>
        </div>

        <div className={styles.grid__item}>
          <img src={IMAGES.cubes} alt="cubes" />
          <h3 className={styles.grid__item__title}>Your partners</h3>
          <p className={styles.grid__item__text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Nisi eum sint quibusdam vero?
          </p>
          <a href="https://google.com" target="_blank" rel="noreferrer">Read more</a>
        </div>

        <div className={styles.grid__item}>
          <img src={IMAGES.cubes} alt="cubes" />
          <h3 className={styles.grid__item__title}>Technical Proficient</h3>
          <p className={styles.grid__item__text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Nisi eum sint quibusdam vero?
          </p>
          <a href="https://google.com" target="_blank" rel="noreferrer">Read more</a>
        </div>
      </div>

      <Modal
        centered
        visible={open}
        onOk={form.submit}
        okText="CREATE ADDRESS"
        maskClosable={false}
        onCancel={toggleModal}
        okButtonProps={{
          size: 'large',
          icon: <CheckCircleFilled />,
          loading: registering === 'pending',
        }}
        cancelButtonProps={{
          style: { display: 'none' }
        }}
      >
        <h1 className={styles.modal__title}>Get your Toronet Address.</h1>
        <p className={styles.modal__text}>
          You can get your personal Toronet address today
          by creating a secure password below. Be careful
          not to loose it.
        </p>

        <Form
          form={form}
          name="login"
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password"
                label="Password"
                hasFeedback
                rules={[{ required: true, message: 'Password is required!' }]}
              >
                <Input.Password
                  onChange={e => setPassword(e.target.value)}
                  placeholder="********"
                  size="large"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col xl={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="confirmPassword"
                label="Repeat your Password"
                hasFeedback
                rules={[{ required: true, message: 'Password confirm is required!' }]}
              >
                <Input.Password
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  size="large"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
          </Row>

          <PasswordChecklist
            minLength={8}
            value={password}
            valueAgain={confirmPassword}
            iconComponents={{ ValidIcon, InvalidIcon }}
            onChange={(isValid) => setIsPasswordValid(isValid)}
            rules={["minLength", "specialChar", "number", "capital", "match"]}
          />
        </Form>
      </Modal>
    </section>
  )
}

export default Landing;