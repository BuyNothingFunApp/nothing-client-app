import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import PurchaseModal from "./purchase-modal";
import { useState } from "react";
import type { Product } from "../schema/entity";
import ProductList from "./products";
import { motion } from "framer-motion";



export default function Featured() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/products?featured=true"],

  });

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground">Featured Nothing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A premium collection of pure nothingness. Ethically sourced. Digitally delivered.
          </p>
        </motion.div>
        <ProductList
          products={products ?? []}
          onPurchase={handlePurchase}
        />

        {/* <PurchaseModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        /> */}
      </div>
    </section>

  );
}
