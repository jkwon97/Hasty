import React from 'react';
import { Button, Form } from 'react-bootstrap';
import paymentService from '../../services/paymentService';
import debug from 'sabio-debug';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

function CheckoutButton() {
    const _logger = debug.extend('CheckoutButton');

    const onCheckout = async () => {
        const stripe = await stripePromise;
        const onPostPaymentSuccess = (data) => {
            return stripe.redirectToCheckout({ sessionId: data.item });
        };
        const onPostPaymentError = (data) => {
            return _logger(data);
        };
        paymentService.postPayment().then(onPostPaymentSuccess).catch(onPostPaymentError);
    };

    return (
        <Form>
            <Button type="button" onClick={onCheckout}>
                Checkout
            </Button>
        </Form>
    );
}

export default CheckoutButton;
