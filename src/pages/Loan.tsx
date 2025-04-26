
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock loan data
const LOAN_TYPES = [
  { id: 1, name: "Crop Production Loan", minAmount: 10000, maxAmount: 50000, interestRate: 4.5 },
  { id: 2, name: "Equipment Purchase Loan", minAmount: 20000, maxAmount: 100000, interestRate: 5.5 },
  { id: 3, name: "Seed & Fertilizer Loan", minAmount: 5000, maxAmount: 30000, interestRate: 3.5 },
];

const formSchema = z.object({
  loanType: z.string().min(1, { message: "Please select a loan type" }),
  amount: z.string()
    .min(1, { message: "Please enter an amount" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  purpose: z.string().min(10, { message: "Please provide a detailed purpose (min 10 characters)" }),
  repaymentTerm: z.string().min(1, { message: "Please select a repayment term" }),
});

const Loan = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [riskScore, setRiskScore] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanType: "",
      amount: "",
      purpose: "",
      repaymentTerm: "",
    },
  });
  
  useEffect(() => {
    // Simulate loading user eligibility data
    setTimeout(() => {
      // Random risk score between 30 and 85
      const score = Math.floor(Math.random() * 56) + 30;
      setRiskScore(score);
      setIsEligible(score >= 45);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Update selected loan type when the form value changes
  const onLoanTypeChange = (value: string) => {
    const loanId = parseInt(value, 10);
    setSelectedLoanType(loanId);
    form.setValue("loanType", value);
  };
  
  // Get the currently selected loan
  const selectedLoan = selectedLoanType
    ? LOAN_TYPES.find((loan) => loan.id === selectedLoanType)
    : null;
    
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Loan application values:", values);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store loan application in localStorage for demo purposes
      const loanApplications = JSON.parse(localStorage.getItem("agrifin_loans") || "[]");
      loanApplications.push({
        id: Math.random().toString(36).substring(2, 9),
        ...values,
        status: "pending",
        appliedAt: new Date().toISOString(),
      });
      localStorage.setItem("agrifin_loans", JSON.stringify(loanApplications));
      
      toast.success("Loan application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to submit loan application. Please try again.");
      console.error("Loan application error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">Checking loan eligibility...</h2>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Apply for a Microloan</h1>
        <p className="text-muted-foreground">
          Access affordable financing for your farming needs
        </p>
      </div>
      
      {!isEligible && (
        <Card className="mb-8 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Limited Loan Eligibility</CardTitle>
            <CardDescription>
              Based on your risk score of {riskScore}, you currently have limited loan eligibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              To improve your eligibility, consider:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Adding more details to your farm profile</li>
              <li>Enrolling in crop insurance for risk protection</li>
              <li>Building a positive repayment history with smaller loans</li>
            </ul>
          </CardContent>
        </Card>
      )}
      
      {isEligible && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Application Form</CardTitle>
                <CardDescription>
                  Fill out the details below to apply for your loan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="loanType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Type</FormLabel>
                          <Select onValueChange={onLoanTypeChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select loan type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LOAN_TYPES.map((loan) => (
                                <SelectItem key={loan.id} value={loan.id.toString()}>
                                  {loan.name} ({loan.interestRate}% interest)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Amount (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter loan amount" 
                              {...field} 
                              disabled={!selectedLoan}
                            />
                          </FormControl>
                          {selectedLoan && (
                            <FormDescription>
                              Available range: ₹{selectedLoan.minAmount} to ₹{selectedLoan.maxAmount}
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Purpose</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Describe how you will use the loan" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Explain how this loan will help your farming business
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="repaymentTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Repayment Term</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select repayment term" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="3months">3 months</SelectItem>
                              <SelectItem value="6months">6 months</SelectItem>
                              <SelectItem value="12months">12 months</SelectItem>
                              <SelectItem value="24months">24 months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="mt-4" disabled={isSubmitting || !isEligible}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle>Loan Eligibility</CardTitle>
                <CardDescription>Your current loan status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Risk Score</Label>
                    <div className="text-2xl font-bold">{riskScore}/100</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Eligibility Status</Label>
                    <div className="font-medium">
                      {isEligible ? (
                        <span className="text-primary">Eligible for loans</span>
                      ) : (
                        <span className="text-destructive">Limited eligibility</span>
                      )}
                    </div>
                  </div>
                  
                  {isEligible && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Maximum Amount</Label>
                      <div className="font-medium">₹{riskScore * 1000}</div>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Interest Rate Range</Label>
                    <div className="font-medium">
                      {isEligible ? `${4 + (100 - riskScore) / 20}% - ${7 + (100 - riskScore) / 10}%` : "Not applicable"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-primary/10 text-xs text-muted-foreground">
                <p>Blockchain-powered smart contracts ensure loan transparency and security</p>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Why Choose AgriFin?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p>No hidden fees or charges</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p>Fast approval process</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p>Flexible repayment options</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p>Transparent blockchain contracts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Loan;
