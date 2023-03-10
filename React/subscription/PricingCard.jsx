import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './pricingcard.css';

const PricingCard = (props) => {
    const onCheckout = (e) => {
        props.onCardClick(props.plan, e.target);
    };

    const listFeatures = props.plan.features?.map((feature) => (
        <li className="my-2" key={feature + props.plan.id}>
            {feature}
        </li>
    ));

    return (
        <Col>
            <Card className="pc-shadow">
                {props.currentPlan?.planId === props.plan.id && props.currentPlan.status === 'active' ? (
                    <div className="pc-current-plan">Current Plan</div>
                ) : null}
                <Card.Body className="text-center pc-body">
                    <Card.Title className="text-center pc-title">{props.plan.name} Tier</Card.Title>
                    <img src={props.plan.image} alt={props.plan.name + ' tier'} className="pc-resize-img" />
                    <div className="pc-listing-style">
                        <ul className="pc-list-style">{listFeatures}</ul>
                    </div>
                    <div className="pc-plan-cost">${props.plan.amount} per month</div>
                    <div className="pt-3">
                        <Button variant="secondary" onClick={onCheckout}>
                            Choose Plan
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

PricingCard.propTypes = {
    plan: PropTypes.shape({
        id: PropTypes.number.isRequired,
        productId: PropTypes.string.isRequired,
        priceId: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        features: PropTypes.shape([PropTypes.string.isRequired]),
        image: PropTypes.string.isRequired,
    }),
    onCardClick: PropTypes.func,
    currentPlan: PropTypes.shape({
        subId: PropTypes.number,
        planId: PropTypes.number,
        planName: PropTypes.string,
        planCost: PropTypes.number,
        dateCreated: PropTypes.string,
        dateEnd: PropTypes.string,
        status: PropTypes.string.isRequired,
    }),
};

export default PricingCard;
