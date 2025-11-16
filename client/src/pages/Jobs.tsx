import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Briefcase, MapPin, Clock, DollarSign, Search, Waves, Bookmark } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Jobs() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string>("");

  const { data: jobs, isLoading } = trpc.job.getActive.useQuery({
    search: searchQuery || undefined,
    location: location || undefined,
    jobType: jobType || undefined,
  });

  const { data: companies } = trpc.company.getAll.useQuery();

  const getCompanyName = (companyId: number) => {
    return companies?.find(c => c.id === companyId)?.name || "Company";
  };

  const formatSalary = (min?: number | null, max?: number | null, currency?: string | null) => {
    if (!min && !max) return "Competitive";
    const curr = currency || "USD";
    if (min && max) return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `From ${curr} ${min.toLocaleString()}`;
    if (max) return `Up to ${curr} ${max.toLocaleString()}`;
    return "Competitive";
  };

  const formatJobType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Waves className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">{APP_TITLE}</span>
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
                <a href={getLoginUrl()}>
                  <Button>Sign In</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Browse Watersports Jobs</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover exciting opportunities in the watersports industry
          </p>

          {/* Search and Filters */}
          <Card className="p-6 shadow-lg">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search jobs or skills..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading jobs...</p>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">{jobs.length} jobs found</p>
              </div>

              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="h-6 w-6 text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <Link href={`/jobs/${job.id}`}>
                              <h3 className="text-xl font-bold hover:text-primary cursor-pointer mb-1">
                                {job.title}
                              </h3>
                            </Link>
                            
                            <p className="text-muted-foreground mb-3">{getCompanyName(job.companyId)}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                              {job.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatJobType(job.jobType)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {job.description}
                            </p>
                            
                            {job.isFeatured && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent/20 text-accent-foreground text-xs font-medium mt-2">
                                ⭐ Featured
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Link href={`/jobs/${job.id}`}>
                          <Button>View Details</Button>
                        </Link>
                        {isAuthenticated && user?.role === "job_seeker" && (
                          <Button variant="outline" size="icon">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters or check back later for new opportunities
              </p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
