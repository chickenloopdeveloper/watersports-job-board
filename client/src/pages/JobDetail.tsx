import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Briefcase, MapPin, Clock, DollarSign, Waves, Share2, Building2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function JobDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const jobId = parseInt(id || "0");
  const { data: job, isLoading } = trpc.job.getById.useQuery({ id: jobId });
  const { data: company } = trpc.company.getById.useQuery(
    { id: job?.companyId || 0 },
    { enabled: !!job?.companyId }
  );

  const applyMutation = trpc.application.create.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      setShowApplyDialog(false);
      setCoverLetter("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit application");
    },
  });

  const handleApply = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    
    if (user?.role !== "job_seeker") {
      toast.error("Only job seekers can apply to jobs");
      return;
    }
    
    setShowApplyDialog(true);
  };

  const handleSubmitApplication = () => {
    applyMutation.mutate({
      jobId,
      coverLetter: coverLetter || undefined,
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <Link href="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    {company && (
                      <p className="text-xl text-muted-foreground mb-4">{company.name}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      {job.location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatJobType(job.jobType)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button size="lg" onClick={handleApply}>
                    Apply Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              {job.isFeatured && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
                  ⭐ Featured Job
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
              
              {job.experienceLevel && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Experience Level</h3>
                  <p className="text-muted-foreground capitalize">
                    {job.experienceLevel}
                  </p>
                </div>
              )}
              
              {job.skills && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(job.skills).map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {company && (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-secondary" />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">About {company.name}</h2>
                    {company.description && (
                      <p className="text-muted-foreground mb-4">{company.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {company.industry && (
                        <div>
                          <span className="font-semibold">Industry:</span>{" "}
                          <span className="text-muted-foreground">{company.industry}</span>
                        </div>
                      )}
                      {company.companySize && (
                        <div>
                          <span className="font-semibold">Company Size:</span>{" "}
                          <span className="text-muted-foreground">{company.companySize}</span>
                        </div>
                      )}
                      {company.location && (
                        <div>
                          <span className="font-semibold">Location:</span>{" "}
                          <span className="text-muted-foreground">{company.location}</span>
                        </div>
                      )}
                      {company.website && (
                        <div>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Visit Website →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Your profile will be submitted with this application. Add a cover letter to stand out.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Cover Letter (Optional)</label>
              <Textarea
                placeholder="Tell the employer why you're a great fit for this role..."
                rows={6}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={applyMutation.isPending}>
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
