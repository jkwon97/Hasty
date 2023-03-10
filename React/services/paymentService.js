import axios from 'axios';
import { onGlobalError, onGlobalSuccess, API_HOST_PREFIX } from './serviceHelpers';

const endpoint = { paymentUrl: `${API_HOST_PREFIX}/api/payments` };

const postPayment = () => {
    const config = {
        method: 'POST',
        url: `${endpoint.paymentUrl}/checkout`,
        withCredentials: false,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const paymentService = { postPayment };
export default paymentService;