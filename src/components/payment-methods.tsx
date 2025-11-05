// components/payment-methods.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

interface PaymentMethodsProps {
    amount: number;
    customerData: {
        name: string;
        email: string;
    };
    productId: string;
    onPaymentSuccess: (paymentData: {
        customerName: string;
        customerEmail: string;
        amount: number;
        productId: string;
        paymentDetails: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
        };
    }) => void;
    onPaymentError: (error: string) => void;
}

export default function PaymentMethods({
    amount,
    customerData,
    productId,
    onPaymentSuccess,
    onPaymentError,
}: PaymentMethodsProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleRazorpayPayment = async () => {
        setIsProcessing(true);
        try {
            // 1. Load Razorpay script dynamically
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
            const razKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

            script.onload = async () => {
                try {
                    // 2. Create order via your API
                    const orderResponse = await apiRequest("POST", "/checkout", {
                        productId,
                        customerName: customerData.name,
                        customerEmail: customerData.email,
                        amount: amount
                    });

                    if (!orderResponse.ok) {
                        throw new Error('Failed to create payment order');
                    }

                    const order = await orderResponse.json();

                    // 3. Initialize Razorpay checkout
                    const options = {
                        key: razKey,
                        amount: order.data.amount * 100,
                        currency: 'INR',
                        name: "Buy Nothing",
                        description: `Order Payment`,
                        image: "/logo.png",
                        order_id: order.data.id,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        handler: async function (response: any) {
                            const {
                                razorpay_payment_id,
                                razorpay_order_id,
                                razorpay_signature,
                            } = response;

                            if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                                onPaymentError("Incomplete payment response from Razorpay");
                                return;
                            }
                            
                            // Send data to backend to validate
                            const verificationResponse = await apiRequest("POST", "/checkout/validate", {
                                razorpay_order_id,
                                razorpay_signature,
                                razorpay_payment_id
                            });
                            const paymentDataResponse   = {
                                customerName: customerData.name,
                                customerEmail: customerData.email,
                                amount: amount,
                                productId: productId,
                                paymentDetails: response,
                            };
                            const verification = await verificationResponse.json();
                            if (verification.success) {
                                onPaymentSuccess(paymentDataResponse);
                            } else {
                                onPaymentError("Payment verification failed");
                            }
                        },
                        prefill: {
                            name: customerData.name,
                            email: customerData.email,
                        },
                        theme: {
                            color: "#2563eb",
                        },
                        modal: {
                            ondismiss: () => {
                                // Handle when user closes Razorpay modal without payment
                                setIsProcessing(false);
                                onPaymentError("Payment was cancelled");
                            },
                            escape: false, // Prevent closing with ESC key
                            backdropclose: false // Prevent closing by clicking outside
                        }
                    };

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    rzp.on('payment.failed', (response: any) => {
                        onPaymentError(response.error.description || 'Payment failed');
                        setIsProcessing(false);
                    });

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    onPaymentError(error.message || 'Payment processing failed');
                    setIsProcessing(false);
                }
            };

            script.onerror = () => {
                onPaymentError('Failed to load Razorpay SDK');
                setIsProcessing(false);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast({
                title: "Payment Error",
                description: error.message || 'Payment processing failed',
                variant: "destructive",
            });
            onPaymentError(error.message || 'Payment failed');
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="text-lg font-medium text-foreground">
                                Secure Payment Gateway
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Complete your payment via Razorpay
                            </p>
                        </div>

                        <Button
                            onClick={handleRazorpayPayment}
                            disabled={isProcessing}
                            className="w-full"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Pay ₹{amount}
                                </>
                            )}
                        </Button>

                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground">
                                Your payment is secured with 256-bit SSL encryption
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}