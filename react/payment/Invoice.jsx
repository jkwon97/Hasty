import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import toastr from 'toastr';
import { Card, Row, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function Invoice(props) {
    const [invoice, setInvoice] = useState({});
    const [currentPlan, setCurrentPlan] = useState();
    const [params] = useSearchParams();
    const invoiceId = params.get('id');
    useEffect(() => {
        if (params?.invoiceId !== null) {
            subscriptionService.getCurrentPlan().then(onGetCurrentPlanSuccess).catch(onGetCurrentPlanError);
            subscriptionService
                .getLatestInvoice(invoiceId)
                .then(onGetLatestInvoiceSuccess)
                .catch(onGetLatestInvoiceError);
        } else {
            toastr.error('An error has occurred, please login again');
        }
    }, []);

    const onGetLatestInvoiceSuccess = (data) => {
        setInvoice(data.item);
        toastr.success('Your payment was successful');
    };

    const onGetLatestInvoiceError = () => {
        toastr.error('An error has occurred');
    };

    const onGetCurrentPlanSuccess = (data) => {
        setCurrentPlan(data.item);
    };

    const onGetCurrentPlanError = () => {
        toastr.error('An error has occurred, please login again');
    };

    const convertDate = (date) => {
        if (typeof date === 'string') {
            let dateSlice = date.slice(0, date.indexOf('T'));
            return dateSlice;
        }
    };
    const startDate = convertDate(invoice.created);
    return (
        <React.Fragment>
            <Row>
                <Card>
                    <div className="mx-5">
                        <Card.Body className="m-3">
                            <div className="clearfix">
                                <div className="float-start mb-4">
                                    <h3>
                                        Thank you for your purchase
                                        <span className="text-secondary"> {props.currentUser.firstName}</span>!
                                    </h3>
                                </div>
                            </div>
                            <Row>
                                <div className="col-sm-6">
                                    <div className="float-start mt-3">
                                        <p className="font-15">Your order details are below:</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="float-sm-end">
                                        <p className="font-13">
                                            <strong>Order Date: </strong>
                                            <span className="float-end">{startDate}</span>
                                        </p>
                                        <p className="font-13">
                                            <strong>Order Status: </strong>
                                            <span className="badge bg-info float-end">
                                                {invoice.paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </p>
                                        <p className="font-13">
                                            <strong>Order ID: </strong>
                                            <span className="float-end">{currentPlan?.subId}</span>
                                        </p>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className="col">
                                    <div className="table-responsive">
                                        <table className="table mt-4">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Unit Cost</th>
                                                    <th className="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{currentPlan?.planName}</td>
                                                    <td>${invoice.amountPaid / 100}</td>
                                                    <td className="text-end">${invoice.amountPaid / 100}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Row>
                        </Card.Body>
                    </div>
                    <Row>
                        <div className="col d-flex justify-content-center mb-4">
                            <Link to="/pricing">
                                <Button className="mx-1" variant="secondary">
                                    Return
                                </Button>
                            </Link>
                            <a target={'_blank'} href={invoice.hostedInvoiceUrl} rel={'noreferrer'}>
                                <Button variant="secondary">
                                    <i className="mdi mdi-printer"></i> View PDF
                                </Button>
                            </a>
                        </div>
                    </Row>
                </Card>
            </Row>

            <Row>
                <div className="col-sm-4 mx-auto">
                    <p className="text-center">
                        Need help with your order? <br />
                        Contact us at{' '}
                        <u>
                            <b>
                                <a href="mailto: hastyAdmin@dispostable.com">hastyAdmin@dispostable.com</a>
                            </b>
                        </u>
                    </p>
                </div>
            </Row>
        </React.Fragment>
    );
}

Invoice.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
    }).isRequired,
};

export default Invoice;
