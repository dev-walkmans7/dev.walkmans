const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class StripePayment {
    async chargeAmount(param){
        try{
            ///CREATE STRIPE TOKEN\\\

            let stripeTokens = null;
            stripeTokens = await stripe.tokens.create({
                card: {
                    number: param.cardNumber,
                    exp_month: param.expMonth,
                    exp_year: param.expYear,
                    cvc: param.cvc
                },
            });

            //SAVE CARD FOR FUTURE USE > CREATE PAYMENT METHOD > ON STRIPE\\\

            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: param.cardNumber,
                    exp_month: param.expMonth,
                    exp_year: param.expYear,
                    cvc: param.cvc
                },
            });

            ///CREATING STRIPE CUSTOMER ID\\\

            let stripeCustomer = await stripe.customers.create({
                email: param.email,
                name: param.name,
                description: 'Customer Created for Brainflix',
                // payment_method: paymentMethod.id,
                source: stripeTokens.id
            });
                        
            //Stripe Charge
            var stripeCharge = await stripe.charges.create({
                amount: param.stripeAmount,
                currency: param.customerCurrencyCode,
                customer: stripeCustomer.id,
            });
    
    
            if(!_.isEmpty(stripeCharge) && _.has(stripeCharge,'captured') && stripeCharge.captured==true && stripeCharge.paid==true){
                return { "success": true, 'stripeChargeId': stripeCharge.id, 'last4Digit':stripeTokens.card.last4, 'expMonth': param.expMonth, 'exp_year': param.expYear, "stripeCustomerId": stripeCustomer.id }
            }
            else{
                console.log("failed response: ",stripeCharge);
                return { "success": false, "message": "Unable to process the payment at this moment" }
            }
        }
        catch(e){
            console.log("stripe charge error: ",e.message);
            return { "success": false, "message":e.message }
        }
    }
}

module.exports = new StripePayment();