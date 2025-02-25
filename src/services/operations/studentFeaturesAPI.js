import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from '../../assets/Logo/rzp_logo.png'
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        //finally adding script to body
        document.body.appendChild(script);
    });
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        // Load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        // Initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, { courses }, {
            Authorization: `Bearer ${token}`,
        });

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse", orderResponse);

        // Options for Razorpay
        const options = {
            key: "rzp_test_YrPBkdj6DVc7tK",
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "EduGanga",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function (response) {
                console.log("Razorpay response:", response);
                // Send successful email
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
                // Verify payment
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Oops, payment failed");
            console.log(response.error);
        });

    } catch (error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment"); 
    }
    toast.dismiss(toastId);
}

// Verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("Payment Successful, You are added to the course");
        navigate("/dashboard/enrolled-courses");
        //everything is done so resetting the cart
        dispatch(resetCart());

    } catch (error) {
        console.log("PAYMENT VERIFY ERROR...", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}

// Send payment success email
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        console.log("Sending payment success email with response:", response);
        await apiConnector('POST', SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        }, {
            Authorization: `Bearer ${token}`
        });

    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR", error);
    }
}