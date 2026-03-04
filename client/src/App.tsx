import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import InvestorReadiness from "./pages/InvestorReadiness";
import InvestmentAnalysis from "./pages/InvestmentAnalysis";
import Coaching from "./pages/Coaching";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import Admin from "./pages/Admin";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminJobEditor from "./pages/AdminJobEditor";
import About from "./pages/About";

function Router() {
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services/investor-readiness" component={InvestorReadiness} />
          <Route path="/services/investment-analysis" component={InvestmentAnalysis} />
          <Route path="/services/coaching" component={Coaching} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/careers" component={Careers} />
          <Route path="/careers/:slug" component={JobDetail} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/blog/new" component={AdminBlogEditor} />
          <Route path="/admin/blog/:slug" component={AdminBlogEditor} />
          <Route path="/admin/jobs/new" component={AdminJobEditor} />
          <Route path="/admin/jobs/:slug" component={AdminJobEditor} />
          <Route path="/about" component={About} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
