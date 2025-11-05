import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, ShoppingBag, Star, Shield, Truck, AlertCircle } from "lucide-react";
import { apiRequest, getQueryFn } from "../lib/queryClient";
import type { Product } from "../schema/entity";
import PurchaseModal from "../components/purchase-modal";
import OrderConfirmModal from "../components/orderConfirm-modal";
import { useToast } from "../hooks/use-toast";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderData, setOrderData] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async (data: {
      customerName: string;
      customerEmail: string;
      productId: string;
      amount: number;
      paymentDetails: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      };
    }) => {
      const response = await apiRequest("POST", "/checkout/confirm", data);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderData(data);
      setShowConfirmation(true);
      toast({
        title: "Payment Successful!",
        description: "Your payment has been processed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = (paymentData: any) => {
    checkoutMutation.mutate({
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      productId: paymentData.productId,
      paymentDetails: paymentData.paymentDetails,
      amount: paymentData.amount,
    });
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setOrderData(null);
    //onClose();
    setIsPurchaseModalOpen(false);
  };

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/products', id],
    queryFn: getQueryFn<Product>({ on401: "throw" }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
            <div className="text-2xl font-bold text-foreground">buyNothing</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">∅</div>
                <p className="text-sm text-muted-foreground">Visual representation of nothing</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded border-2 border-dashed border-border flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">∅</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(247 reviews)</span>
              </div>
              <div className="text-4xl font-bold text-foreground mb-4">${product.price}</div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </motion.div>

            <Separator />

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm">100% Nothing Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-sm">Premium Quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <span className="text-sm">Eco-Friendly</span>
                </div>
              </div>
            </motion.div>

            <Separator />

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Important Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        This product is literally nothing. You will receive absolutely nothing in return for your purchase.
                        This is not a joke, mistake, or error. You are paying for the concept and experience of owning nothing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Purchase Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-3"
            >
              <Button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Buy Nothing for ${product.price}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By purchasing, you acknowledge that you will receive nothing and are satisfied with this transaction.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-16 space-y-8"
        >
          <Separator />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="text-foreground">0 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="text-foreground">0 × 0 × 0 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material:</span>
                  <span className="text-foreground">Pure Nothing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="text-foreground">Transparent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warranty:</span>
                  <span className="text-foreground">Lifetime</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Shipping & Returns</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Instant delivery - nothing to ship</p>
                <p>• No returns necessary - you got exactly what you paid for</p>
                <p>• Carbon neutral shipping</p>
                <p>• No packaging waste</p>
                <p>• 100% satisfaction guarantee</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {!showConfirmation ? (
        <PurchaseModal
          product={product}
          isOpen={isPurchaseModalOpen}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setIsPurchaseModalOpen(!isPurchaseModalOpen)}
        />
      ) : (<OrderConfirmModal
        orderData={orderData}
        product={product}
        onClose={handleClose}
        onShare={() => { }}
      />
      )}
    </div>
  );
}