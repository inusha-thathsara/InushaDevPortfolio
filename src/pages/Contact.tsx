import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Github, Linkedin, Mail, Phone, Download } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";
import { useState } from "react";
import emailjs from 'emailjs-com';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", values);
      
      // Initialize EmailJS with your user ID
      emailjs.init("Al0GUwE8amaPsGuQD");
      
      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        message: values.message,
        to_name: "Inusha Gunasekara",
        reply_to: values.email,
      };

      // Send the email
      const response = await emailjs.send(
        "service_7vd4zn9",
        "template_lov8s4n",
        templateParams
      );
      
      if (response.status === 200) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out. I'll get back to you within 24 hours!",
        });
        form.reset();
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again or contact directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Let's build something awesome together. I usually reply within 24 hours!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <p className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      <a href="mailto:inusha.thathsara@gmail.com" className="hover:text-purple-500 transition-colors">
                        inusha.thathsara@gmail.com
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      <a href="mailto:inusha.gunasekara@gmail.com" className="hover:text-purple-500 transition-colors">
                        inusha.gunasekara@gmail.com
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      <a href="tel:+94786962450" className="hover:text-purple-500 transition-colors">
                        +94 78 696 2450
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Social Platforms</h2>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://www.linkedin.com/in/inusha-gunasekara-9996632a5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href="https://github.com/inusha-thathsara"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="GitHub Profile"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Availability</h2>
                  <div className="space-y-3 mb-4">
                    <a
                      href="https://www.freelancer.com/u/InushaThathsara?frm=InushaThathsara&sb=t"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <span className="font-medium">Freelancer</span>
                    </a>
                    <a
                      href="https://www.fiverr.com/s/Eg9y8Gd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-500 hover:text-green-700 transition-colors"
                    >
                      <span className="font-medium">Fiverr</span>
                    </a>
                    <a
                      href="https://www.upwork.com/freelancers/~01fa4853c31d224ce6?mp_source=share"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-500 hover:text-teal-700 transition-colors"
                    >
                      <span className="font-medium">Upwork</span>
                    </a>
                  </div>
                  <p className="text-green-500 font-medium">
                    ✓ Open for freelance work
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => window.open('/resume.pdf', '_blank')}>
                    <Download className="mr-2 h-4 w-4" /> Download Resume
                  </Button>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What would you like to discuss?" 
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default Contact;
