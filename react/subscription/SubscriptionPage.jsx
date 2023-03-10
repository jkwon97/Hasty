import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PricingCard from './PricingCard';
import subscriptionService from '../../services/subscriptionService';
import { loadStripe } from '@stripe/stripe-js';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { subscriptionTiers } from './pricingInfo.js';
import './pricingcard.css';
import stripeImg from '../../assets/images/payments/stripe.png';
import visaImg from '../../assets/images/payments/visa.png';
import amExImg from '../../assets/images/payments/american-express.png';
import masterImg from '../../assets/images/payments/master.png';
import discoverImg from '../../assets/images/payments/discover.png';
import citiImg from '../../assets/images/payments/citi.png';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const SubscriptionPage = (props) => {
    const [planData, setPlanData] = useState({ arrayOfPlans: [], planCards: [] });
    const [currentPlan, setCurrentPlan] = useState({ status: '' });
    const navigate = useNavigate();
    useEffect(() => {
        subscriptionService
            .getAllPlans()
            .then(onGetAllPlansSuccess)
            .then(subscriptionService.getCurrentPlan().then(onGetCurrentPlanSuccess).catch(onGetCurrentPlanError))
            .catch(onGetAllPlansError);
    }, [currentPlan.planId, props.currentUser]);

    const onGetAllPlansSuccess = (response) => {
        let planArray = response.items;
        setPlanData((prevState) => {
            const planData = { ...prevState };
            planData.arrayOfPlans = planArray;
            planData.planCards = planArray.map(mapPlan);
            return planData;
        });
    };
    const onGetAllPlansError = () => {
        toastr.error('Unable to load this page.');
    };

    const onGetCurrentPlanSuccess = (data) => {
        setCurrentPlan(() => {
            return data.item;
        });
    };
    const onGetCurrentPlanError = () => {
        setCurrentPlan(() => {
            return { status: 'false' };
        });
    };

    const mapPlan = (plan) => {
        const idx = subscriptionTiers.map((tier) => tier.id).indexOf(plan.id);
        const planInfo = { ...subscriptionTiers[idx], ...plan };
        return (
            <PricingCard plan={planInfo} key={plan.priceId} onCardClick={onCheckoutRequest} currentPlan={currentPlan} />
        );
    };

    const onCheckoutRequest = async (plan) => {
        if (props.currentUser.id !== 0) {
            const stripe = await stripePromise;
            const onCreateSessionSuccess = (data) => {
                toastr.success('Redirecting to checkout...');
                return stripe.redirectToCheckout({ sessionId: data.item });
            };
            const onCreateSubscriptionError = () => {
                toastr.error('Uh oh, something went wrong. Please try again!');
            };
            subscriptionService.createSession(plan).then(onCreateSessionSuccess).catch(onCreateSubscriptionError);
        } else {
            navigate('/login');
        }
    };

    return (
        <React.Fragment>
            <Container className="mt-4">
                <Row>
                    <Col>
                        <div className="text-center mb-4">
                            <h3>
                                Our <span className="text-primary">Subscription Plans</span> and
                                <span className="text-primary"> Pricing</span>
                            </h3>
                            <p>
                                We have plans and prices that fit your needs perfectly.
                                <br />
                                The perfect tenant is just a few clicks away.
                            </p>
                            <div>
                                <ul className="pc-list-style">
                                    <img src={stripeImg} alt="stripe" className="pc-payment" />
                                    <img src={visaImg} alt="visa" className="pc-payment" />
                                    <img src={masterImg} alt="mastercard" className="pc-payment" />
                                    <img src={amExImg} alt="american express" className="pc-payment" />
                                    <img src={citiImg} alt="citi" className="pc-payment" />
                                    <img src={discoverImg} alt="discover" className="pc-payment" />
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>{planData?.planCards}</Row>
            </Container>
            <div className="text-center mt-4">
                <p>
                    Still have questions? Contact us at{' '}
                    <u>
                        <b>
                            <a href="mailto: hastyAdmin@dispostable.com">hastyAdmin@dispostable.com</a>
                        </b>
                    </u>
                </p>
            </div>
        </React.Fragment>
    );
};
SubscriptionPage.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
    }),
};
export default SubscriptionPage;
