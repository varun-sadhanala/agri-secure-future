
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary to-secondary/50 pt-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              <span className="block text-primary">AgriFin</span>
              <span className="block mt-2">Financial Solutions for Farmers</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Access microloans and crop insurance through our blockchain-powered platform, designed specifically for smallholder farmers.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">Demo Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">How AgriFin Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register Your Farm</h3>
              <p className="text-muted-foreground">Enter details about your location, crops, and farming practices to create your profile.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Risk Assessment</h3>
              <p className="text-muted-foreground">Our AI analyzes weather patterns, soil conditions, and historical data to evaluate your farm's risk profile.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Financial Services</h3>
              <p className="text-muted-foreground">Apply for microloans or purchase crop insurance with transparent terms through our blockchain platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Benefits of Using AgriFin</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-primary">Fair Rates</h3>
              <p className="text-muted-foreground">AI-powered risk assessment ensures you get fair interest rates based on actual farm data.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-primary">Quick Approval</h3>
              <p className="text-muted-foreground">Fast loan processing with minimal paperwork through our automated system.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-primary">Auto Insurance Claims</h3>
              <p className="text-muted-foreground">Our smart contracts automatically trigger payouts when adverse weather conditions are detected.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-primary">Transparent</h3>
              <p className="text-muted-foreground">All transactions are recorded on the blockchain, ensuring complete transparency and trust.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Farming Future?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">Join thousands of smallholder farmers already benefiting from AgriFin's innovative financial solutions.</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
