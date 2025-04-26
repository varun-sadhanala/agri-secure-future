
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { connectToMetaMask, sendTransaction, MetaMaskState } from "@/utils/metamask";

interface LoanApplication {
  id: string;
  loanType: string;
  amount: string;
  purpose: string;
  repaymentTerm: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  farmerName: string;
  farmerId: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [metamask, setMetamask] = useState<MetaMaskState | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Check admin authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem("agrifin_admin");
    if (!adminAuth) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }
    
    setIsAdmin(true);
    
    // Load loan applications from localStorage
    const storedLoans = localStorage.getItem("agrifin_loans");
    if (storedLoans) {
      const loanData = JSON.parse(storedLoans);
      
      // Get farmer info to include in the loan data
      const userData = JSON.parse(localStorage.getItem("agrifin_user") || "{}");
      
      const loansWithFarmerInfo = loanData.map((loan: any) => ({
        ...loan,
        farmerName: userData.name || "Unknown Farmer",
        farmerId: userData.id || "Unknown ID"
      }));
      
      setApplications(loansWithFarmerInfo);
    }
  }, [navigate]);
  
  const handleConnectMetaMask = async () => {
    const result = await connectToMetaMask();
    if (result) {
      setMetamask(result);
    }
  };
  
  const handleApproveLoan = async (loanId: string, amount: string) => {
    if (!metamask?.isConnected) {
      toast.error("Please connect to MetaMask first");
      return;
    }
    
    setIsProcessing(loanId);
    
    try {
      // In a real app, this would be the farmer's wallet address
      // For demo purposes, we'll send it to a sample address
      const receiverAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      
      // Send transaction through MetaMask
      const txHash = await sendTransaction(receiverAddress, amount);
      
      if (txHash) {
        // Update loan status in localStorage
        const updatedApplications = applications.map(app => {
          if (app.id === loanId) {
            return {
              ...app,
              status: "approved" as const,
              txHash
            };
          }
          return app;
        });
        
        setApplications(updatedApplications);
        localStorage.setItem("agrifin_loans", JSON.stringify(updatedApplications));
        
        toast.success("Loan approved and funds transferred!");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };
  
  const handleRejectLoan = (loanId: string) => {
    const updatedApplications = applications.map(app => {
      if (app.id === loanId) {
        return {
          ...app,
          status: "rejected" as const
        };
      }
      return app;
    });
    
    setApplications(updatedApplications);
    localStorage.setItem("agrifin_loans", JSON.stringify(updatedApplications));
    toast.success("Loan application rejected");
  };
  
  if (!isAdmin) {
    return <div>Checking authentication...</div>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage microloan applications
        </p>
      </div>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>MetaMask Connection</CardTitle>
            <Button 
              onClick={handleConnectMetaMask}
              variant={metamask?.isConnected ? "outline" : "default"}
            >
              {metamask?.isConnected ? "Connected" : "Connect Wallet"}
            </Button>
          </CardHeader>
          <CardContent>
            {metamask?.isConnected ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="font-mono text-sm truncate max-w-[300px]">
                    {metamask.accounts[0]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance:</span>
                  <span>{metamask.balance} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network ID:</span>
                  <span>{metamask.chainId}</span>
                </div>
              </div>
            ) : (
              <p>Connect to MetaMask to process loan applications</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No loan applications yet</p>
          ) : (
            <Table>
              <TableCaption>List of microloan applications from farmers</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer Name</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Amount (₹)</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.farmerName}</TableCell>
                    <TableCell>{application.loanType}</TableCell>
                    <TableCell>{application.amount}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {application.purpose}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.status === "approved" 
                            ? "success" 
                            : application.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {application.status === "approved" ? "Approved" : 
                         application.status === "rejected" ? "Rejected" : 
                         "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {application.status === "pending" && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveLoan(application.id, application.amount)}
                            disabled={!metamask?.isConnected || isProcessing === application.id}
                          >
                            {isProcessing === application.id ? "Processing..." : "Approve"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRejectLoan(application.id)}
                            disabled={isProcessing === application.id}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {application.status !== "pending" && (
                        <span className="text-sm text-muted-foreground">
                          {application.status === "approved" ? "Approved on " : "Rejected on "}
                          {new Date().toLocaleDateString()}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
