import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "../lib/queryClient";
import { toast } from "../hooks/use-toast";

const contactSchema = z.object({
    customerName: z.string().min(1, "Name is required"),
    customerEmail: z.string().email("Valid email is required"),
    message: z.string().min(1, 'Message is required')
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            customerName: "",
            customerEmail: "",
        },
    });

    const handleSubmit = async (data: ContactFormData) => {
        try {
            const response = await apiRequest("POST", "/contact", {
                message: data.message,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
            });

            // If apiRequest returns a Response object, parse it as JSON
            const result = await response.json();

            if (result.success) {
                toast({
                    title: "Message Sent!",
                });
            } else {
                toast({
                    title: "Message Failed",
                    variant: "destructive",
                });
            }

            form.reset();
        } catch {
            // Handle any errors that might occur during the API request
            toast({
                    title: "Message Failed",
                    variant: "destructive",
                });
            //console.error("Submission error:", error);
        }
    }

    return (
        <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                <Input
                    id="customerName"
                    {...form.register("customerName", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                    })}
                    placeholder="Enter your full name"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                {form.formState.errors.customerName && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.customerName.message}
                    </p>
                )}
                <Input
                    id="customerEmail"
                    type="email"
                    {...form.register("customerEmail", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address"
                        }
                    })}
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                {form.formState.errors.customerEmail && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.customerEmail.message}
                    </p>
                )}
                <textarea
                    id="message"
                    {...form.register("message", {
                        required: "Message is required",
                        minLength: { value: 10, message: "Message must be at least 10 characters" }
                    })}
                    placeholder="Tell us how Nothing changed your life."
                    className="w-full p-2 border border-gray-300 rounded h-32"
                />
                {form.formState.errors.message && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.message.message}
                    </p>
                )}
                <Button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
                >
                    Send Message
                </Button>
            </form>
            <p className="mt-4 text-sm text-gray-500">
                We may respond. Or not. Because… well, it’s Nothing.
            </p>
        </div>
    );
}
