import axios from 'axios';
import { onGlobalError, onGlobalSuccess, API_HOST_PREFIX } from './serviceHelpers';

const endpoint = { subscriptionUrl: `${API_HOST_PREFIX}/api/subscriptions` };

const getAllPlans = () => {
    const config = {
        method: 'GET',
        url: endpoint.subscriptionUrl,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const createSession = (payload) => {
    const config = {
        method: 'POST',
        data: payload,
        url: `${endpoint.subscriptionUrl}/checkout`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const postSubscriptionInfo = (sessionId) => {
    const config = {
        method: 'POST',
        url: `${endpoint.subscriptionUrl}/session?sessionId=${sessionId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getCurrentPlan = () => {
    const config = {
        method: 'GET',
        url: `${endpoint.subscriptionUrl}/status`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getLatestInvoice = (invoiceId) => {
    const config = {
        method: 'GET',
        url: `${endpoint.subscriptionUrl}/invoice/${invoiceId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const subscriptionService = { getAllPlans, createSession, postSubscriptionInfo, getCurrentPlan, getLatestInvoice };
export default subscriptionService;
