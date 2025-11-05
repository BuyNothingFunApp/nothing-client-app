import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { AlertCircle } from "lucide-react";
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Instagram,
  ExternalLink 
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

interface SocialShareProps {
  orderNumber: string;
  productName: string;
  amount: string;
  onClose?: () => void;
}

interface SocialPlatform {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: "twitter",
    name: "Twitter",
    icon: Twitter,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    description: "Share your nothing achievement"
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    description: "Let friends know about your purchase"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    description: "Professional nothing networking"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    description: "Share with close contacts"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    description: "Story-worthy nothing content"
  }
];

export default function SocialShare({ orderNumber, amount, onClose }: SocialShareProps) {
  //const [sharedPlatforms, setSharedPlatforms] = useState<Set<string>>(new Set());
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkInitialPopupState = () => {
      const isBlocked = checkPopupBlocker();
      setIsPopupBlocked(isBlocked);
      
      if (isPopupBlocked) {
        toast({
          title: "Popup Blocker Detected",
          description: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <p>Please enable popups for a better sharing experience.</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Look for the popup blocker icon in your browser's address bar.
              </p>
            </div>
          ),
          duration: 8000,
        });
      }
    };

    // Small delay to ensure browser is ready
    setTimeout(checkInitialPopupState, 1000);
  }, [toast]);
  
  const fallbackCopyToClipboard = (text: string) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position: fixed; left: -9999px; top: 0';
      document.body.appendChild(textarea);
      
      try {
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (err) {
        document.body.removeChild(textarea);
        return false;
      }
    };

  const copyToClipboard = async (text: string) => { 
    try {
      let copySuccessful = false;

      // First try the Clipboard API
      if (navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          copySuccessful = true;
        } catch (err) {
          //console.error('Clipboard API copy failed:', err); // Debug log
        }
      }

      // If Clipboard API failed, try the fallback
      if (!copySuccessful) {
        copySuccessful = fallbackCopyToClipboard(text);
      }

      if (copySuccessful) {
        toast({
          title: "URL Copied!",
          description: "Share URL has been copied to your clipboard",
        });
      } else {
        throw new Error('Both copy methods failed');
      }
    } catch (err) {
      // Show the URL in a toast with clear instructions
      toast({
        title: "Manual Copy Required",
        description: (
          <div className="space-y-2">
            <p>Please copy this URL:</p>
            <div 
              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md overflow-x-auto"
              onClick={(e) => {
                const target = e.currentTarget;
                target.querySelector('input')?.select();
              }}
            >
              <input 
                type="text"
                readOnly
                value={text}
                className="w-full bg-transparent border-none text-xs p-1 focus:outline-none"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
            <p className="text-xs text-muted-foreground">Click the URL to select it, then press Ctrl/Cmd + C to copy</p>
          </div>
        ),
        duration: 15000,
      });
    }
  };

  const checkPopupBlocker = (): boolean => {
    const popup = window.open('about:blank', '_blank');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      return true; // Popups are blocked
    }
    popup.close();
    return false; // Popups are allowed
  };



  const handleShare = async (platform: string) => {
    try {
      
      const response = await apiRequest("POST", "/share", {
        orderNumber,
        platform
      });
      const data = await response.json();
      
      if (!data.data) {
        throw new Error("No share URL received");
      }

      const shareUrl = data.data;
      
      const popup = window.open(shareUrl, "_blank");
     
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked, copy URL instead
        await copyToClipboard(shareUrl);
        setIsPopupBlocked(true);
      } else {
        //setSharedPlatforms(prev => new Set([...prev, platform]));
        toast({
          title: "Shared Successfully!",
          description: `Your nothing purchase has been shared on ${platform}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: error instanceof Error ? error.message : "Failed to share",
        variant: "destructive",
      });
    }
  };

  const shareMutation = useMutation({
    mutationFn: (args: { platform: string }) => handleShare(args.platform),
    onError: (error) => {
      toast({
        title: "Share Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const generatePreviewText = () => {
    return `I just bought ${amount} worth of absolutely nothing from buyNothing.com! 🎯 Order #${orderNumber} - achieving peak minimalism! 💫`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-border">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Your Nothing
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Let the world know about your minimalist achievement!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <p className="text-sm text-foreground leading-relaxed">
              {generatePreviewText()}
            </p>
          </div>

          {/* Social Platform Buttons */}
          <div className="grid grid-cols-1 gap-3">
            {socialPlatforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleShare(platform.id)}
                  disabled={shareMutation.isPending}
                  variant="outline"
                  className={`w-full justify-start gap-3 h-auto p-4 ${platform.bgColor} border-border hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center`}>
                      <platform.icon className={`w-4 h-4 ${platform.color}`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-foreground">{platform.name}</div>
                      <div className="text-xs text-muted-foreground">{platform.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* {sharedPlatforms.has(platform.id) ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          <Check className="w-3 h-3 mr-1" />
                          Shared
                        </Badge>
                      ) : ( */}
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      {/* )} */}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          {/* {sharedPlatforms.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center"
            >
              <div className="text-green-600 dark:text-green-400 font-semibold">
                Shared on {sharedPlatforms.size} platform{sharedPlatforms.size !== 1 ? 's' : ''}!
              </div>
              <div className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                You're spreading the word about nothing! 🎉
              </div>
            </motion.div>
          )} */}

          {/* Close Button */}
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Done Sharing
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}