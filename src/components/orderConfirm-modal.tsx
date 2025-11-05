import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, Mail, Package, Share2, ArrowLeft } from "lucide-react";
import SocialShare from "./social-share";
import { useState } from "react";
import type { Product } from "../schema/entity";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface PurchaseConfirmationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderData: any;
  product: Product;
  onClose: () => void;
  onBack?: () => void;
  onShare: () => void;
}

export default function OrderConfirmModal({ 
  orderData, 
  product, 
  onClose, 
  onBack,
  onShare
}: PurchaseConfirmationProps) {
  const [step, setStep] = useState<"confirmation" | "share">("confirmation");
  const goBack = () => {
    if (step === "share") {
      setStep("confirmation");
    } else if (onBack) {
      onBack();
    }
  };

  const goToShare = () => {
    setStep("share");
    if (onShare) onShare();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"> 
            <div className="flex items-center gap-2 mb-4">
              {step !== "confirmation" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="p-1 h-6 w-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-semibold">
                {step === "confirmation" ? "Purchase Confirmed!" : "Share Your Nothing"}
              </h2>
            </div>
          </DialogTitle>
        </DialogHeader>
      <AnimatePresence mode="wait">
      {step === "confirmation" && (
        <motion.div
          key="confirmation"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Check className="text-white text-xl" />
          </motion.div>

          <h3 className="text-2xl font-semibold mb-4 text-foreground">Purchase Confirmed!</h3>
          <p className="text-muted-foreground mb-6">
            Congratulations! You have successfully purchased{" "}
            <span className="font-semibold text-foreground">{product.name}</span> for{" "}
            <span className="font-semibold text-foreground">${orderData?.data.amount}</span>.
          </p>

          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2 font-medium">
                What happens next:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center space-x-2">
                  <Mail size={14} className="text-green-500" />
                  <span>You will receive a confirmation email</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Package size={14} className="text-green-500" />
                  <span>Nothing will be shipped to you</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-green-500" />
                  <span>You now own premium nothing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-green-500" />
                  <span>Enjoy your purchase!</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              onClick={goToShare}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share on Social
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      )}

      {step === "share" && (
        <motion.div
          key="share"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <SocialShare
            orderNumber={orderData?.data.orderNumber || ""}
            productName={product.name}
            amount={orderData?.data.amount || ""}
            onClose={onClose}
          />
        </motion.div>
      )}
      </AnimatePresence>
    </DialogContent>
    </Dialog>
  );
}