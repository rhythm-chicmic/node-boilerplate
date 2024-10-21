/* eslint-disable radix */
/* eslint-disable no-else-return */

'use strict';

const STRIPE = require('stripe');
const config = require('../../config');

// const stripe = new STRIPE(config.STRIPE.SECRET_KEY);
const stripeService = {};

/** **********************************************
 ***************** stripe methods **************
 ************************************************* */

/**
 * This function creates a new customer in Stripe.
 * 
 * @param {Object} user - The user object containing user details.
 * @param {string} user.email - The email of the user.
 * @param {string} user.name - The name of the user.
 * @param {Object} user.city - The city of the user.
 * @param {Object} user.countryCode.alphaTwo - The two-letter country code of the user.
 * @param {string} user.address - The address of the user. If not provided, the city is used as the address.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe customer object.
 */
stripeService.createCustomer = async (user) => {
    const stripeCustomerCreateData = {
        email: user.email,
        // test_clock: 'test_clock_id_here',
        name: user.name,
        shipping: {
            address: {
                city: user.city,
                country: user.countryCode.alphaTwo,
                line1: user.address || user.city,
            },
            name: user.name,
        },
        address: {
            city: user.city,
            country: user.countryCode.alphaTwo,
            line1: user.address || user.city,
        },
        description: 'New customer',
    };
    return await stripe.customers.create(stripeCustomerCreateData);
};

/**
 * This function updates an existing customer in Stripe.
 * 
 * @param {string} stripeCustomerId - The ID of the Stripe customer to be updated.
 * @param {Object} user - The user object containing updated user details.
 * @param {string} user.email - The updated email of the user.
 * @param {string} user.name - The updated name of the user.
 * @param {Object} user.city - The updated city of the user.
 * @param {Object} user.countryCode.alphaTwo - The updated two-letter country code of the user.
 * @param {string} user.address - The updated address of the user. If not provided, the city is used as the address.
 * 
 * @returns {Promise<Object>} A promise that resolves to the updated Stripe customer object.
 */
stripeService.updateCustomer = async (stripeCustomerId, user) => {
    const stripeCustomerUpdateData = {
        email: user.email,
        name: user.name,
        shipping: {
            address: {
                city: user.city,
                country: user.countryCode.alphaTwo,
                line1: user.address || user.city,
            },
            name: user.name,
        },
        address: {
            city: user.city,
            country: user.countryCode.alphaTwo,
            line1: user.address || user.city,
        },
        description: 'Updated customer',
    };
    return await stripe.customers.update(stripeCustomerId, stripeCustomerUpdateData);
};

/**
 * This function updates the default payment method for an existing customer in Stripe.
 * 
 * @param {string} stripeCustomerId - The ID of the Stripe customer to be updated.
 * @param {string} defaultPaymentMethod - The ID of the new default payment method.
 * 
 * @returns {Promise<Object>} A promise that resolves to the updated Stripe customer object.
 */
stripeService.updateCustomerDefaultPaymentMethod = async (stripeCustomerId, defaultPaymentMethod) => await stripe.customers.update(stripeCustomerId, {
    invoice_settings: {
        default_payment_method: defaultPaymentMethod,
    },
});

/**
 * This function creates a new product in Stripe.
 * 
 * @param {string} product - The name of the product to be created.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe product object.
 */
stripeService.createProduct = async (product) => await stripe.products.create({
    name: product,
});

/**
 * This function creates a new price for a product in Stripe.
 * 
 * @param {string} product - The ID of the product for which the price is to be created.
 * @param {number} amount - The amount to be charged for the product. This is multiplied by 100 to convert to the smallest currency unit.
 * @param {string} currency - The currency in which the amount is to be charged.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe price object.
 */
stripeService.createPrice = async (product, amount, currency) => await stripe.prices.create({
    unit_amount: amount * 100,
    currency,
    recurring: { interval: 'month' }, // change it to 'year' for annual subscription
    product,
});

/**
 * This function creates a new subscription in Stripe.
 * 
 * @param {string} customer - The ID of the customer for whom the subscription is to be created.
 * @param {string} price - The ID of the price object that should be used for the subscription.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe subscription object.
 * The subscription object includes the latest invoice and the associated payment intent.
 */
stripeService.createSubscription = async (customer, price) => {
    const data = {
        customer,
        items: [
            { price },
        ],
        collection_method: 'charge_automatically',

        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
    };
    return await stripe.subscriptions.create(data);
};

/**
 * This function lists the prices in Stripe.
 * 
 * @param {number} limit - The maximum number of prices to return
 * 
 * @returns {Promise<Object>} A promise that resolves to a list of Stripe price objects.
 */
stripeService.listPrices = async (limit) => await stripe.prices.list({
    limit,
});

/**
 * This function lists the products in Stripe.
 * 
 * @param {number} limit - The maximum number of products to return
 * 
 * @returns {Promise<Object>} A promise that resolves to a list of Stripe price objects.
 */
stripeService.listProducts = async (limit) => await stripe.products.list({
    limit,
});

/**
 * This function updates an existing subscription in Stripe.
 * 
 * @param {string} subscriptionId - The ID of the subscription to be updated.
 * @param {string} newPrice - The ID of the new price object to be used for the subscription.
 * 
 * @returns {Promise<Object>} A promise that resolves to the updated Stripe subscription object.
 * The subscription is not prorated, and it does not cancel at the end of the period.
 */
stripeService.updateSubscription = async (subscriptionId, newPrice) => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: false,
        proration_behavior: 'none', // change it as per requirement
        items: [{
            id: subscription.items.data[0].id,
            price: newPrice,
        }],
    });
};

/**
 * This function updates the default payment method (card) for an existing subscription in Stripe.
 * 
 * @param {string} subscriptionId - The ID of the subscription to be updated.
 * @param {string} newDefaultCardID - The ID of the new default card to be used for the subscription.
 * 
 * @returns {Promise<Object>} A promise that resolves to the updated Stripe subscription object.
 */
stripeService.updateSubscriptionCard = async (subscriptionId, newDefaultCardID) => await stripe.subscriptions.update(subscriptionId, {
    default_payment_method: newDefaultCardID,
});

/**
 * This function cancels an existing subscription in Stripe.
 * 
 * @param {string} subscriptionId - The ID of the subscription to be cancelled.
 * 
 * @returns {Promise<Object>} A promise that resolves to the cancelled Stripe subscription object.
 */
stripeService.cancelSubscription = async (subscriptionId) => await stripe.subscriptions.cancel(
    subscriptionId,
);

/**
 * This function deleted an existing subscription in Stripe.
 * 
 * @param {string} subscriptionId - The ID of the subscription to be deleted.
 * 
 * @returns {Promise<Object>} A promise that resolves to the cancelled Stripe subscription object.
 */
stripeService.deleteSubscription = async (subscriptionId) => await stripe.subscriptions.del(
    subscriptionId,
);

/**
 * This function creates a new transfer in Stripe. A transfer is used to transfer funds from Stripe to a connected account.
 * 
 * @param {number} amount - The amount to be transferred. This is multiplied by 100 to convert to the smallest currency unit.
 * @param {string} currency - The currency in which the amount is to be transferred.
 * @param {string} connectAccountId - The ID of the connected account to which the transfer is to be made.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe transfer object.
 */
stripeService.createTransfer = async (amount, currency, connectAccountId) => await stripe.transfers.create({
    amount: parseInt(amount * 100),
    currency,
    destination: connectAccountId,
});

/**
 * This function creates a new payout in Stripe. A payout is used to payout funds from a connected account to a bank account.
 * 
 * @param {number} amount - The amount to be paid out. This is multiplied by 100 to convert to the smallest currency unit.
 * @param {string} currency - The currency in which the amount is to be paid out.
 * @param {string} connectedAccountId - The ID of the connected account to which the payout is to be made.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe payout object.
 */
stripeService.createPayout = async (amount, currency, connectedAccountId) => await stripe.payouts.create({ amount: (amount * 100).toFixed(0), currency }, {
    stripeAccount: connectedAccountId,
});

/**
 * This function creates a new custom connect account in Stripe.
 * 
 * @param {Object} user - The user object containing user details.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe connect account object.
 */
stripeService.createConnectAccount = async (user) => await stripe.accounts.create({
    type: 'custom',
    country: user.countryCode.alphaTwo,
    email: user.email,
    default_currency: user.currency,
    business_type: 'individual',
    business_profile: {
        url: 'minihearts.org',
        mcc: 5969,
    },
    individual: {
        address: {
            city: user.city,
            country: user.countryCode.alphaTwo,
            postal_code: user.postCode,
            state: user.state,
            line1: user.country,
        },
        dob: {
            day: user.dob?.day,
            month: user.dob?.month,
            year: user.dob?.year,
        },
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.mobile,
    },
    capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
    },
    tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: user.ip || '0.0.0.0',
    },
    settings: {
        payouts: {
            schedule: {
                interval: 'manual',
            },
        },
    },
});

/**
 * This function updated a custom connect account in Stripe.
 * 
 * @param {Object} user - The user object containing user details.
 * 
 * @returns {Promise<Object>} A promise that resolves to the updated Stripe connect account object.
 */
stripeService.updateConnectAccount = async (connectAccountId, user) => await stripe.accounts.update(connectAccountId, {
    email: user.email,
    individual: {
        address: {
            city: user.city,
            country: user.countryCode.alphaTwo,
            postal_code: user.postCode,
            state: user.state,
            line1: user.address,
        },
        dob: {
            day: user.dob?.day,
            month: user.dob?.month,
            year: user.dob?.year,
        },
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.mobile,
    },
    settings: {
        payouts: {
            schedule: {
                interval: 'manual',
            },
        },
    },
});

/**
 * This function deletes a customer's card (payment method) in Stripe.
 * 
 * @param {string} paymentMethodId - The ID of the payment method (card) to be deleted.
 * 
 * @returns {Promise<Object>} A promise that resolves to the detached (deleted) Stripe payment method object.
 */
stripeService.deleteCustomerCard = async (paymentMethodId) => await stripe.paymentMethods.detach(paymentMethodId);

/**
 * This function lists a customer's cards (payment methods) in Stripe.
 * 
 * @param {string} customerId - The ID of the customer.
 * 
 * @returns {Promise<Object>} A promise that resolves to the customer cards listing.
 */
stripeService.listCustomerCards = async (customerId) => await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
});

/**
 * This function creates a new account link for a Stripe Connect account. The account link is used to redirect the user to Stripe to complete the account setup.
 * 
 * @param {string} connectAccountId - The ID of the connected account for which the account link is to be created.
 * @param {string} refreshUrl - The URL to redirect the user to if they need to complete additional account setup.
 * @param {string} returnUrl - The URL to redirect the user to after they have completed the account setup.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe account link object.
 */
stripeService.createAccountLink = async (connectAccountId, refreshUrl, returnUrl) => await stripe.accountLinks.create({
    account: connectAccountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
});

/**
 * This function retrieves the details of a Stripe Connect account.
 * 
 * @param {string} connectAccountId - The ID of the connected account for which the details are to be retrieved.
 * 
 * @returns {Promise<Object>} A promise that resolves to the Stripe Connect account object.
 */
stripeService.fetchConnectAccountInfo = async (connectAccountId) => await stripe.accounts.retrieve(
    connectAccountId,
);

/**
 * This function updates a customer's card (payment method) in Stripe.
 * 
 * @param {string} paymentMethodId - The ID of the payment method (card) to be updated.
 * @param {Object} dataToUpdate - The object containing the card details to be updated.
 * 
 * @returns {Promise<Object>} A promise that resolves to the updated Stripe payment method object.
 */
stripeService.updateCustomerCard = async (paymentMethodId, dataToUpdate) => await stripe.paymentMethods.update(
    paymentMethodId,
    { card: dataToUpdate },
);

/**
 * This function lists the bank accounts of a Stripe Connect account.
 * 
 * @param {string} connectAccountId - The ID of the connected account for which the bank accounts are to be listed.
 * 
 * @returns {Promise<Object>} A promise that resolves to a list of bank account objects associated with the Stripe Connect account.
 * The maximum number of bank accounts returned is 10.
 */
stripeService.listBankAccounts = async (connectAccountId) => await stripe.accounts.listExternalAccounts(
    connectAccountId,
    { object: 'bank_account', limit: 10 },
);

/**
 * This function deletes a customer in Stripe.
 * 
 * @param {string} customerId - The ID of the customer to be deleted.
 * 
 * @returns {Promise<Object>} A promise that resolves to the deleted Stripe customer object.
 */
stripeService.deleteCustomer = async (customerId) => await stripe.customers.del(
    customerId,
);

/**
 * This function retrieves the details of a charge in Stripe.
 * 
 * @param {string} charge - The ID of the charge for which the details are to be retrieved.
 * 
 * @returns {Promise<Object>} A promise that resolves to the Stripe charge object.
 */
stripeService.retrieveCharge = async (charge) => await stripe.charges.retrieve(
    charge,
);

/**
 * This function retrieves the details of a balance transaction in Stripe.
 * 
 * @param {string} txn - The ID of the balance transaction for which the details are to be retrieved.
 * 
 * @returns {Promise<Object>} A promise that resolves to the Stripe balance transaction object.
 */
stripeService.getBalanceTransaction = async (txn) => await stripe.balanceTransactions.retrieve(
    txn,
);

/**
 * This function creates a reversal for a transfer in Stripe, effectively rolling back the amount from the connected account.
 * 
 * @param {string} transferId - The ID of the transfer for which the reversal is to be created.
 * @param {number} amount - The amount to be rolled back. This is multiplied by 100 to convert to the smallest currency unit.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe transfer reversal object.
 */
stripeService.rollbackAmoutFromConnectAccount = async (transferId, amount) => await stripe.transfers.createReversal(
    transferId,
    {
        amount: parseInt(amount * 100),
    },
);

/**
 * This function creates a new payment method in Stripe.
 * 
 * @param {string} token - The token representing the card details.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe payment method object.
 */
stripeService.createPaymentMethod = async (token) => await stripe.paymentMethods.create({
    type: 'card',
    card: {
        token,
    },
});

/**
 * This function deletes a Stripe Connect account.
 * 
 * @param {string} connectAccountId - The ID of the connected account to be deleted.
 * 
 * @returns {Promise<Object>} A promise that resolves to the deleted Stripe Connect account object.
 */
stripeService.deleteConnectAccount = async (connectAccountId) => await stripe.accounts.del(connectAccountId);

/**
 * This function creates a new payment intent in Stripe.
 * 
 * @param {number} amount - The amount intended to be collected by this PaymentIntent. A positive integer representing how much to charge in the smallest currency unit.
 * @param {string} currency - Three-letter ISO currency code, in lowercase.
 * @param {string} source - The ID of the payment method (card) to be charged.
 * 
 * @returns {Promise<Object>} A promise that resolves to the newly created Stripe payment intent object.
 * The payment intent is not confirmed and will require a confirmation step.
 */
stripeService.createPaymentIntent = async (amount, currency, source) => await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
    payment_method_types: ['card'],
    payment_method: source,
    description: 'Donation',
    confirm: false,
});

/**
 * This function retrieves the details of a payment intent in Stripe.
 * 
 * @param {string} paymentIntentId - The ID of the payment intent for which the details are to be retrieved.
 * 
 * @returns {Promise<Object>} A promise that resolves to the Stripe payment intent object.
 * The invoice property of the payment intent is expanded to include all its details.
 */
stripeService.retrievePaymentIntent = async (paymentIntentId) => await stripe
    .paymentIntents.retrieve(paymentIntentId, {
        expand: ['invoice'],
    });

/**
 * This function retrieves the details of an invoice in Stripe.
 * 
 * @param {string} invoiceId - The ID of the invoice for which the details are to be retrieved.
 * 
 * @returns {Promise<Object>} A promise that resolves to the Stripe invoice object.
 */
stripeService.retrieveInvoice = async (invoiceId) => await stripe.invoices.retrieve(invoiceId);

/**
 * This function retrieves the details of a customer in Stripe.
 * 
 * @param {string} customerId - The ID of the customer for which the details are to be retrieved.
 * 
 * @returns {Promise<Object>} A promise that resolves to the Stripe customer object.
 */
stripeService.retrieveCustomer = async (customerId) => await stripe.customers.retrieve(customerId);

/**
 * Function to attach a card to stripe customer
 * @param {*} paymentMethodId
 * @param {*} stripeCustomerId
 * @returns
 */
stripeService.attachCard = async (paymentMethodId, stripeCustomerId) => await stripe.paymentMethods.attach(
    paymentMethodId,
    { customer: stripeCustomerId },
);

module.exports = stripeService;
