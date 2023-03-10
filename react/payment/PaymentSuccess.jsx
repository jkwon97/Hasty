import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import './paymentsuccess.css';

function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId !== null) {
            subscriptionService
                .postSubscriptionInfo(sessionId)
                .then(onPostSubscriptionSuccess)
                .catch(onPostSubscriptionError);
        } else {
            toastr.error('An error has occurred with this page. Please try logging in again.');
        }
    }, [sessionId]);
    const onPostSubscriptionSuccess = (data) => {
        navigate(`/invoice?id=${data.item}`);
    };
    const onPostSubscriptionError = () => {
        toastr.error('Please contact support');
    };

    return (
        <html>
            <body className="ps-size">
                <div className="ps-spinner">
                    <div className="spinner-border text-warning m-2" />
                    <p className="ps-message">Processing payment...</p>
                </div>
            </body>
        </html>
    );
}

export default PaymentSuccess;
