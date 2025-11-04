import { useState } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, Building2, Filter, Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full Time' | 'Part Time' | 'Contract';
  badges: string[];
  badgeColors: string[];
  shortDescription: string;
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  workplaceType: 'Hybrid' | 'Remote' | 'On-site';
  postedDate: string;
  applicationDeadline: string;
}

const JobMatching = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showCVAnalyzer, setShowCVAnalyzer] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  
  // Filter states
  const [activeWorkplaceFilter, setActiveWorkplaceFilter] = useState<string | null>('Hybrid');
  const [activeTimeFilter, setActiveTimeFilter] = useState<string | null>(null);
  const [activeAccessibilityFilters, setActiveAccessibilityFilters] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('Relevance');

  const allJobs: Job[] = [
    {
      id: 'job-1',
      title: 'Customer Support Representative',
      company: 'Tech Solutions Ltd',
      location: 'Dhaka',
      salary: '25,000 - 30,000 BDT/month',
      type: 'Full Time',
      badges: ['Screen Reader Friendly'],
      badgeColors: ['bg-emerald-500'],
      shortDescription: 'Join our inclusive team supporting customers with accessibility needs.',
      fullDescription: 'We are seeking a dedicated Customer Support Representative to join our accessibility-focused support team. You will be the first point of contact for customers with diverse accessibility needs, providing compassionate and effective technical support.',
      responsibilities: [
        'Respond to customer inquiries via phone, email, and chat with empathy and professionalism',
        'Troubleshoot accessibility-related technical issues using screen readers and assistive technologies',
        'Document customer interactions and maintain accurate records in our CRM system',
        'Collaborate with product team to report accessibility bugs and improvement suggestions',
        'Provide product demonstrations and training for customers with disabilities',
        'Meet performance metrics including response time, resolution rate, and customer satisfaction'
      ],
      requirements: [
        'Proficiency in using screen readers (JAWS, NVDA, or VoiceOver)',
        'Excellent written and verbal English communication skills',
        'Strong problem-solving abilities and technical aptitude',
        'Patience and empathy when working with diverse customer needs',
        '1+ years of customer service experience (preferred)',
        'Basic understanding of web accessibility standards (WCAG)',
        'Ability to work flexible hours including some weekends'
      ],
      benefits: [
        'Competitive salary with performance bonuses',
        'Health insurance coverage',
        'Annual paid leave (20 days)',
        'Professional development and training opportunities',
        'Accessible workplace with assistive technology provided',
        'Flexible work arrangements',
        'Career advancement opportunities'
      ],
      skills: ['Customer Service', 'Screen Reader Proficiency', 'English Communication', 'Technical Support', 'Accessibility Awareness'],
      workplaceType: 'Hybrid',
      postedDate: '2025-10-15',
      applicationDeadline: '2025-11-15'
    },
    {
      id: 'job-2',
      title: 'Customer Support Representative',
      company: 'Digital Corp',
      location: 'Remote',
      salary: '25,000 - 30,000 BDT/month',
      type: 'Part Time',
      badges: ['Screen Reader Friendly', 'Flexible Hours'],
      badgeColors: ['bg-blue-500', 'bg-purple-500'],
      shortDescription: 'Work remotely with flexible hours and accessibility-first tools.',
      fullDescription: 'Digital Corp is looking for part-time Customer Support Representatives who are passionate about accessibility. This remote position offers the flexibility to work on your own schedule while making a meaningful impact.',
      responsibilities: [
        'Provide remote customer support via digital channels (email, chat, video calls)',
        'Assist customers with accessibility feature setup and configuration',
        'Create and maintain support documentation and knowledge base articles',
        'Test and validate accessibility features across different assistive technologies',
        'Participate in weekly team meetings and training sessions',
        'Contribute to continuous improvement of customer experience'
      ],
      requirements: [
        'Experience using assistive technologies (screen readers, screen magnifiers, etc.)',
        'Strong written English communication skills',
        'Self-motivated with ability to work independently',
        'Reliable internet connection and quiet workspace',
        'Basic computer troubleshooting skills',
        'Availability for at least 20 hours per week',
        'Previous remote work experience is a plus'
      ],
      benefits: [
        'Fully remote position - work from anywhere',
        'Flexible scheduling to accommodate your needs',
        'Hourly rate with bonus incentives',
        'Training and onboarding provided',
        'Access to latest assistive technology tools',
        'Supportive and inclusive team culture',
        'Opportunity to transition to full-time'
      ],
      skills: ['Remote Work', 'Assistive Technology', 'Written Communication', 'Self-Management', 'Customer Support'],
      workplaceType: 'Remote',
      postedDate: '2025-10-18',
      applicationDeadline: '2025-11-20'
    },
    {
      id: 'job-3',
      title: 'Accessibility Testing Specialist',
      company: 'Quality Assurance Inc',
      location: 'Dhaka/Remote',
      salary: '30,000 - 40,000 BDT/month',
      type: 'Full Time',
      badges: ['Screen Reader Friendly', 'Sign Language Support'],
      badgeColors: ['bg-purple-500', 'bg-blue-500'],
      shortDescription: 'Help ensure digital products are accessible to everyone.',
      fullDescription: 'Join our Quality Assurance team as an Accessibility Testing Specialist. You will play a crucial role in ensuring that digital products and services are accessible to people with disabilities, contributing to a more inclusive digital world.',
      responsibilities: [
        'Conduct comprehensive accessibility audits of websites, mobile apps, and software',
        'Test digital products using various assistive technologies and accessibility tools',
        'Document accessibility issues and create detailed bug reports',
        'Collaborate with developers and designers to implement accessibility solutions',
        'Perform manual and automated accessibility testing (WCAG 2.1 compliance)',
        'Create accessibility test plans and test cases',
        'Provide recommendations for accessibility improvements',
        'Stay updated on accessibility standards and best practices'
      ],
      requirements: [
        'Expert knowledge of screen readers (JAWS, NVDA, VoiceOver, TalkBack)',
        'Understanding of WCAG 2.1 guidelines and Section 508 standards',
        'Experience with accessibility testing tools (WAVE, axe DevTools, Lighthouse)',
        'Strong analytical and problem-solving skills',
        'Excellent written and verbal communication in English',
        'Attention to detail and quality-focused mindset',
        'Ability to work with cross-functional teams',
        'Knowledge of HTML, CSS, and basic web technologies is preferred'
      ],
      benefits: [
        'Higher salary range with annual increments',
        'Hybrid work model (3 days office, 2 days remote)',
        'Comprehensive health and life insurance',
        'Professional certification support (IAAP, CPACC)',
        'Latest assistive technology equipment provided',
        '25 days annual leave plus public holidays',
        'Learning and development budget',
        'Inclusive and accessible workplace environment'
      ],
      skills: ['Accessibility Testing', 'WCAG Compliance', 'Screen Readers', 'QA Testing', 'Technical Documentation', 'Sign Language'],
      workplaceType: 'Hybrid',
      postedDate: '2025-10-10',
      applicationDeadline: '2025-11-10'
    },
    {
      id: 'job-4',
      title: 'Digital Content Writer (Accessibility Focus)',
      company: 'Content Creators Hub',
      location: 'Remote',
      salary: '28,000 - 35,000 BDT/month',
      type: 'Full Time',
      badges: ['Screen Reader Friendly', 'Flexible Hours'],
      badgeColors: ['bg-green-500', 'bg-yellow-500'],
      shortDescription: 'Create accessible content that reaches and engages all audiences.',
      fullDescription: 'We are seeking a talented Digital Content Writer with a focus on accessibility. You will create engaging, inclusive content that is accessible to people with disabilities, ensuring our messaging reaches the widest possible audience.',
      responsibilities: [
        'Write clear, concise, and accessible content for web, social media, and marketing materials',
        'Create alt text descriptions for images and multimedia content',
        'Develop content that follows plain language principles',
        'Collaborate with design team to ensure visual content accessibility',
        'Edit and proofread content for accessibility and readability',
        'Research and stay updated on accessibility content best practices',
        'Create content style guides focused on inclusive language',
        'Test content with screen readers and other assistive technologies'
      ],
      requirements: [
        'Excellent English writing and editing skills',
        'Understanding of accessibility content guidelines',
        'Experience writing alt text and image descriptions',
        'Knowledge of plain language principles',
        'Familiarity with screen readers and how they interpret content',
        'Strong research and SEO skills',
        'Ability to adapt writing style for different audiences',
        'Portfolio of writing samples demonstrating accessibility awareness'
      ],
      benefits: [
        '100% remote position',
        'Flexible working hours',
        'Professional writing tools and software licenses',
        'Content marketing training and certifications',
        'Collaborative and creative team environment',
        'Health insurance',
        'Annual performance bonuses',
        'Career growth opportunities'
      ],
      skills: ['Content Writing', 'Accessibility', 'SEO', 'Plain Language', 'Screen Reader Awareness', 'Creative Writing'],
      workplaceType: 'Remote',
      postedDate: '2025-10-20',
      applicationDeadline: '2025-11-25'
    },
    {
      id: 'job-5',
      title: 'Junior Web Developer (Accessibility)',
      company: 'WebTech Solutions',
      location: 'Dhaka',
      salary: '35,000 - 45,000 BDT/month',
      type: 'Full Time',
      badges: ['Screen Reader Friendly', 'Career Growth'],
      badgeColors: ['bg-indigo-500', 'bg-pink-500'],
      shortDescription: 'Build accessible web applications and grow your development career.',
      fullDescription: 'WebTech Solutions is seeking a Junior Web Developer passionate about web accessibility. This role offers hands-on experience building accessible web applications while working alongside experienced developers in an inclusive environment.',
      responsibilities: [
        'Develop accessible web applications using HTML, CSS, and JavaScript',
        'Implement ARIA attributes and semantic HTML for better accessibility',
        'Test websites for accessibility compliance using automated and manual methods',
        'Fix accessibility issues in existing web applications',
        'Collaborate with UX designers to create accessible user interfaces',
        'Participate in code reviews focusing on accessibility best practices',
        'Document code and maintain technical documentation',
        'Learn and apply modern web development frameworks'
      ],
      requirements: [
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Understanding of web accessibility principles and WCAG guidelines',
        'Experience using screen readers for testing',
        'Familiarity with Git version control',
        'Problem-solving mindset and eagerness to learn',
        'Good communication skills in English',
        'Computer Science degree or relevant certification (or equivalent experience)',
        'Portfolio of web projects demonstrating accessibility awareness'
      ],
      benefits: [
        'Competitive starting salary with growth potential',
        'Mentorship from senior developers',
        'Training on modern web technologies and accessibility',
        'Accessible development tools and equipment',
        'Health and life insurance',
        'Annual leave and sick leave',
        'Team building activities',
        'Clear career progression path'
      ],
      skills: ['HTML/CSS', 'JavaScript', 'Web Accessibility', 'ARIA', 'Git', 'Problem Solving'],
      workplaceType: 'On-site',
      postedDate: '2025-10-12',
      applicationDeadline: '2025-11-12'
    }
  ];

  // Filter jobs based on search and filters
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesWorkplace = !activeWorkplaceFilter || job.workplaceType === activeWorkplaceFilter;
    
    const matchesTime = !activeTimeFilter || 
      (activeTimeFilter === 'Flexible Hours' && job.badges.includes('Flexible Hours'));
    
    const matchesAccessibility = activeAccessibilityFilters.size === 0 ||
      Array.from(activeAccessibilityFilters).every(filter => job.badges.includes(filter));
    
    return matchesSearch && matchesWorkplace && matchesTime && matchesAccessibility;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'Salary (High to Low)':
        return parseInt(b.salary.split('-')[1]) - parseInt(a.salary.split('-')[1]);
      case 'Salary (Low to High)':
        return parseInt(a.salary.split('-')[1]) - parseInt(b.salary.split('-')[1]);
      case 'Date Posted':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      default:
        return 0;
    }
  });

  const requirements = [
    { name: 'English Communication', match: '85%', icon: '💬' },
    { name: 'Screen Reader Proficiency', match: '92%', icon: '🖥️' },
    { name: 'Customer Service Skills', match: '78%', icon: '🤝' },
  ];

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleApplyNow = (job: Job) => {
    setAppliedJobs(prev => new Set(prev).add(job.id));
    toast.success(`Successfully applied to ${job.title} at ${job.company}!`, {
      description: 'We will notify you about the application status.',
      duration: 4000,
    });
  };

  const handleUpdateProfile = () => {
    toast.info('Redirecting to profile settings...', {
      description: 'Update your skills and experience to get better job matches.',
    });
  };

  const toggleAccessibilityFilter = (filter: string) => {
    setActiveAccessibilityFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filter)) {
        newSet.delete(filter);
      } else {
        newSet.add(filter);
      }
      return newSet;
    });
  };

  const handleCVFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setCvFile(file);
        toast.success('CV uploaded successfully!', {
          description: 'Click "Analyze CV" to find matching jobs.',
        });
      } else {
        toast.error('Invalid file type', {
          description: 'Please upload a PDF or Word document.',
        });
      }
    }
  };

  const handleAnalyzeCV = async () => {
    if (!cvFile && !cvText.trim()) {
      toast.error('Please upload a CV or paste your CV text');
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Mock analysis results
      const skills = ['Customer Service', 'Screen Reader Proficiency', 'English Communication', 
                      'Technical Support', 'Accessibility Testing', 'Problem Solving'];
      const experience = '2 years in customer support with focus on accessibility';
      const matchedJobs = allJobs
        .map(job => ({
          ...job,
          matchScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

      setAnalysisResults({
        skills,
        experience,
        matchedJobs,
      });

      setAnalyzing(false);
      toast.success('CV Analysis Complete!', {
        description: 'Found top matching jobs based on your profile.',
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Job Search & Matching
            </h1>
            <p className="text-muted-foreground">
              Find accessible jobs that match your skills and requirements
            </p>
          </div>
          <Button 
            onClick={() => setShowCVAnalyzer(true)}
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
          >
            <Upload className="w-4 h-4" />
            CV Analyzer
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6 shadow-lg">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search by job title or company name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Search className="w-5 h-5" />
              Search
            </Button>
          </div>
        </Card>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={activeWorkplaceFilter === 'Hybrid' ? 'default' : 'outline'}
              className="gap-2"
              onClick={() => setActiveWorkplaceFilter(activeWorkplaceFilter === 'Hybrid' ? null : 'Hybrid')}
            >
              <Building2 className="w-4 h-4" />
              Workplace: Hybrid
            </Button>
            <Button 
              variant={activeWorkplaceFilter === 'Remote' ? 'default' : 'outline'}
              className="gap-2"
              onClick={() => setActiveWorkplaceFilter(activeWorkplaceFilter === 'Remote' ? null : 'Remote')}
            >
              <Building2 className="w-4 h-4" />
              Remote
            </Button>
            <Button 
              variant={activeTimeFilter === 'Flexible Hours' ? 'default' : 'outline'}
              className="gap-2"
              onClick={() => setActiveTimeFilter(activeTimeFilter === 'Flexible Hours' ? null : 'Flexible Hours')}
            >
              <Clock className="w-4 h-4" />
              Flexible Hours
            </Button>
            <Button 
              variant={activeAccessibilityFilters.has('Screen Reader Friendly') ? 'default' : 'outline'}
              onClick={() => toggleAccessibilityFilter('Screen Reader Friendly')}
            >
              Screen Reader Friendly
            </Button>
            <Button 
              variant={activeAccessibilityFilters.has('Sign Language Support') ? 'default' : 'outline'}
              onClick={() => toggleAccessibilityFilter('Sign Language Support')}
            >
              Sign Language Support
            </Button>
            <div className="ml-auto">
              <select 
                className="px-4 py-2 rounded-lg border bg-card hover:bg-muted cursor-pointer transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Sort By: Relevance</option>
                <option>Sort By: Salary (High to Low)</option>
                <option>Sort By: Salary (Low to High)</option>
                <option>Sort By: Date Posted</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Top Matching Jobs</h2>
              <Badge variant="secondary" className="text-sm">
                {sortedJobs.length} Jobs Found
              </Badge>
            </div>
            
            {sortedJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveWorkplaceFilter(null);
                    setActiveTimeFilter(null);
                    setActiveAccessibilityFilters(new Set());
                  }}
                >
                  Clear all filters
                </Button>
              </Card>
            ) : (
              sortedJobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {job.badges.map((badge, i) => (
                        <Badge key={i} className={`${job.badgeColors[i]} text-white`}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {job.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-muted"
                      onClick={() => handleViewDetails(job)}
                    >
                      View Details
                    </Button>
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => handleApplyNow(job)}
                      disabled={appliedJobs.has(job.id)}
                    >
                      {appliedJobs.has(job.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Applied
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Requirements Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Skills Match</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Overall Match</p>
                  <p className="text-2xl font-bold text-primary">85%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold mb-1">Requirements Matching</p>
                <p className="text-xs text-muted-foreground mb-4">Based on your profile</p>
              </div>
              
              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{req.icon}</span>
                        <span className="text-sm font-medium">{req.name}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{req.match}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all" 
                        style={{width: req.match}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-6 bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            </Card>

            {/* Quick Tips Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Quick Tips
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Complete your profile to improve matches</li>
                <li>• Set up job alerts for new opportunities</li>
                <li>• Highlight your accessibility skills</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Job Details Dialog */}
        <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob?.title}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  {selectedJob?.company}
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4" />
                  {selectedJob?.location}
                </div>
              </DialogDescription>
            </DialogHeader>

            {selectedJob && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className="bg-primary">{selectedJob.type}</Badge>
                  <Badge className="bg-green-500">{selectedJob.workplaceType}</Badge>
                  {selectedJob.badges.map((badge, i) => (
                    <Badge key={i} className={selectedJob.badgeColors[i]}>{badge}</Badge>
                  ))}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">{selectedJob.fullDescription}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Responsibilities</h4>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Salary:</span> {selectedJob.salary}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Application Deadline:</span> {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      handleApplyNow(selectedJob);
                      setShowJobDetails(false);
                    }}
                    disabled={appliedJobs.has(selectedJob.id)}
                  >
                    {appliedJobs.has(selectedJob.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowJobDetails(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CV Analyzer Dialog */}
        <Dialog open={showCVAnalyzer} onOpenChange={setShowCVAnalyzer}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                CV Analyzer
              </DialogTitle>
              <DialogDescription>
                Upload your CV or paste its content to find the best matching jobs powered by AI
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {!analysisResults ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload CV File</label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVFileUpload}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label htmlFor="cv-upload" className="cursor-pointer">
                          {cvFile ? (
                            <div className="flex items-center justify-center gap-2 text-primary">
                              <FileText className="w-8 h-8" />
                              <div className="text-left">
                                <p className="font-medium">{cvFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(cvFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-1">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PDF, DOC, or DOCX (Max 5MB)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-muted"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Paste CV Text</label>
                      <Textarea
                        placeholder="Paste your CV content here..."
                        value={cvText}
                        onChange={(e) => setCvText(e.target.value)}
                        rows={8}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyzeCV}
                    disabled={analyzing || (!cvFile && !cvText.trim())}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze CV'
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Analysis Complete!
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Found {analysisResults.matchedJobs.length} jobs matching your profile
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Extracted Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Experience Summary</h4>
                    <p className="text-sm text-muted-foreground">{analysisResults.experience}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Top Matching Jobs</h4>
                    <div className="space-y-3">
                      {analysisResults.matchedJobs.map((job: any) => (
                        <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h5 className="font-semibold">{job.title}</h5>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {job.matchScore}%
                              </div>
                              <p className="text-xs text-muted-foreground">Match</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowCVAnalyzer(false);
                                setShowJobDetails(true);
                              }}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                handleApplyNow(job);
                              }}
                              disabled={appliedJobs.has(job.id)}
                            >
                              {appliedJobs.has(job.id) ? 'Applied' : 'Apply'}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAnalysisResults(null);
                        setCvFile(null);
                        setCvText('');
                      }}
                      className="flex-1"
                    >
                      Analyze Another CV
                    </Button>
                    <Button
                      onClick={() => setShowCVAnalyzer(false)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default JobMatching;
