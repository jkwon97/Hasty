import bronze from '../../assets/images/subscription/bronze-tier.png';
import silver from '../../assets/images/subscription/silver-tier.png';
import gold from '../../assets/images/subscription/gold-tier.png';

const subscriptionTiers = [
    {
        id: 1,
        features: [
            'Up to 5 listings a month',
            '1 free boosted post per month',
            'Registered as Verified user',
            'Access to 24/7 support line',
        ],
        image: bronze,
    },
    {
        id: 3,
        features: [
            'Up to 15 listings a month',
            '5 free boosted posts per month',
            'Registered as Verified user',
            'Access to 24/7 support line',
        ],
        image: silver,
    },
    {
        id: 5,
        features: [
            'Unlimited listings',
            '15 free boosted posts per month',
            'Registered as Verified user',
            'Access to 24/7 support line',
            'Assigned account manager',
        ],
        image: gold,
    },
];
export { subscriptionTiers };
