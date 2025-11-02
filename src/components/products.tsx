import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Crown, Gem, Star, Sparkles, Eye, ShoppingBag } from "lucide-react";
import { PRODUCT_CATEGORIES } from "../lib/constants";
import type { Product } from "../schema/entity";

const categoryIcons = {
  Essential: Star,
  Premium: Sparkles,
  Artisan: Star,
  Luxury: Crown,
  Limited: Gem,
} as const;

interface ProductListProps {
  products: Product[];
  onPurchase: (product: Product) => void;
}

export default function ProductList({ products, onPurchase }: ProductListProps) {
  const [, navigate] = useLocation();

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products?.map((product: Product, index: number) => {
          const category = product.category as keyof typeof PRODUCT_CATEGORIES;
          const categoryConfig = PRODUCT_CATEGORIES[category];
          const IconComponent = categoryIcons[category];
          
          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border-border">
                <div className={`aspect-square bg-gradient-to-br ${categoryConfig.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-32 h-32 border-2 border-dashed border-muted-foreground/50 rounded-full flex items-center justify-center relative"
                    >
                      <span className="text-muted-foreground text-sm font-mono">∅</span>
                      {category === "Artisan" && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-amber-400 rounded-full"></div>
                      )}
                      {category === "Luxury" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <Crown className="text-white text-xs" />
                        </div>
                      )}
                      {category === "Limited" && (
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                          <Gem className="text-white text-xs" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <Badge className={`${categoryConfig.color} ${categoryConfig.textColor}`}>
                      {category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-bold text-foreground">
                      ${product.price}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => product._id && handleViewProduct(product._id)}
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                      disabled={!product._id}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {/* <Button
                      onClick={() => onPurchase(product)}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}