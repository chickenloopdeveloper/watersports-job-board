import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Briefcase, Search, Users, Waves, Wind, Anchor } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation("/jobs");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Waves className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">{APP_TITLE}</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/jobs">
                <Button variant="ghost">Browse Jobs</Button>
              </Link>
              <Link href="/candidates">
                <Button variant="ghost">Find Talent</Button>
              </Link>
              
              {isAuthenticated ? (
                <Link href={user?.role === "admin" ? "/admin" : user?.role === "recruiter" ? "/recruiter/dashboard" : "/seeker/dashboard"}>
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button variant="outline">Sign In</Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button>Get Started</Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%230ea5e9' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Wind className="h-4 w-4" />
              <span className="text-sm font-medium">The #1 Watersports Job Board</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Find Your Dream Job in{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Watersports
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 text-balance">
              Connect with leading watersports companies worldwide. Whether you're a kitesurfer, 
              windsurfer, sailor, or surf instructor - your next adventure starts here.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <Card className="p-2 shadow-lg">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search jobs, skills, or locations..."
                      className="pl-10 border-0 focus-visible:ring-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="px-8">
                    Search Jobs
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-muted-foreground">Professionals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose {APP_TITLE}?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The only job board dedicated exclusively to the watersports industry
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Job Seekers</h3>
                <p className="text-muted-foreground mb-4">
                  Create your profile, showcase your skills, and apply to exciting opportunities 
                  with top watersports brands worldwide.
                </p>
                <Link href="/jobs">
                  <Button variant="link" className="px-0">
                    Browse Jobs →
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Recruiters</h3>
                <p className="text-muted-foreground mb-4">
                  Post jobs, manage applications, and find passionate watersports professionals 
                  who live and breathe the lifestyle.
                </p>
                <Link href="/candidates">
                  <Button variant="link" className="px-0">
                    Find Talent →
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Anchor className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Industry Focused</h3>
                <p className="text-muted-foreground mb-4">
                  From kiteboarding instructors to yacht crew, surf shop managers to equipment 
                  designers - we cover all watersports roles.
                </p>
                <Link href="/jobs">
                  <Button variant="link" className="px-0">
                    Explore Roles →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make Waves?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of watersports professionals and companies already using {APP_TITLE}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <Link href={user?.role === "recruiter" ? "/recruiter/dashboard" : "/seeker/dashboard"}>
                <Button size="lg" variant="secondary">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button size="lg" variant="secondary">
                    Post a Job
                  </Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Create Profile
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Waves className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">{APP_TITLE}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The premier job board for watersports professionals worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs"><a className="hover:text-foreground">Browse Jobs</a></Link></li>
                <li><Link href="/seeker/dashboard"><a className="hover:text-foreground">Create Profile</a></Link></li>
                <li><Link href="/jobs"><a className="hover:text-foreground">Career Advice</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">For Recruiters</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/recruiter/dashboard"><a className="hover:text-foreground">Post a Job</a></Link></li>
                <li><Link href="/candidates"><a className="hover:text-foreground">Find Candidates</a></Link></li>
                <li><Link href="/recruiter/dashboard"><a className="hover:text-foreground">Pricing</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
