
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock data types
interface User {
  name: string;
  cropType: string;
  location: string;
  farmSize: string;
}

interface LoanApplication {
  id: string;
  loanType: string;
  amount: string;
  purpose: string;
  repaymentTerm: string;
  status: string;
  appliedAt: string;
  txHash?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [loanEligibility, setLoanEligibility] = useState<"Low" | "Medium" | "High">("Low");
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("agrifin_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load loan applications
    const loanData = localStorage.getItem("agrifin_loans");
    if (loanData) {
      setApplications(JSON.parse(loanData));
    }

    // Simulate API call for risk assessment
    setTimeout(() => {
      // Random risk score between 30 and 80
      const score = Math.floor(Math.random() * 51) + 30;
      setRiskScore(score);
      
      // Determine loan eligibility based on risk score
      if (score < 40) {
        setLoanEligibility("High");
      } else if (score < 60) {
        setLoanEligibility("Medium");
      } else {
        setLoanEligibility("Low");
      }
      
      setLoading(false);
    }, 1200);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-4">Loading your dashboard...</h2>
            <Progress value={45} className="w-60" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || "Farmer"}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your farming and financial status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Farm Profile</CardTitle>
            <CardDescription>Your registered farm details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{user?.location || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Main Crop:</span>
                <span className="font-medium capitalize">{user?.cropType || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Farm Size:</span>
                <span className="font-medium">{user?.farmSize || "0"} acres</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="card-gradient p-6 text-white">
            <h3 className="text-lg font-semibold">Risk Assessment</h3>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span>Risk Score</span>
                <span className="font-bold">{riskScore}/100</span>
              </div>
              <Progress value={riskScore} className="h-2 bg-white/30" />
              <p className="mt-4 text-sm opacity-90">
                Higher score indicates lower risk. Your farm is considered {riskScore < 50 ? "higher" : "lower"} risk.
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="insurance-card-gradient p-6 text-white">
            <h3 className="text-lg font-semibold">Loan Eligibility</h3>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span>Status</span>
                <span className="font-bold">
                  {loanEligibility === "Low" ? "Highly Eligible" : 
                   loanEligibility === "Medium" ? "Eligible" : "Limited Eligibility"}
                </span>
              </div>
              <div className="mt-4 text-sm opacity-90">
                <p>Based on your risk assessment, you qualify for loans with {loanEligibility.toLowerCase()} interest rates.</p>
              </div>
              <div className="mt-6">
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/loan">Apply for Loan</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Loan Applications</CardTitle>
            <CardDescription>Status of your microloan applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't applied for any loans yet</p>
                <Button asChild className="mt-4">
                  <Link to="/loan">Apply Now</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div 
                    key={app.id} 
                    className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                  >
                    <div>
                      <h4 className="font-medium">{app.loanType}</h4>
                      <p className="text-sm text-muted-foreground">{app.purpose}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-semibold">₹{app.amount}</div>
                      <Badge 
                        variant={
                          app.status === "approved" 
                            ? "success" 
                            : app.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {app.status === "approved" ? "Approved" : 
                         app.status === "rejected" ? "Rejected" : 
                         "Pending"}
                      </Badge>
                      {app.txHash && (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${app.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary mt-1 hover:underline"
                        >
                          View Transaction
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
