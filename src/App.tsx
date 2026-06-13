import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Download, FileText, Home, LayoutDashboard, LogOut, Menu, MessageCircle, Moon, MoonStar, PlusCircle, Shield, Sparkles, Sun, User, Award, Briefcase, Eye, FileEdit, GraduationCap, Languages, Users, Wrench, PenTool, Copy, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import logo from './Logo/Logo1.png';

type SectionKey = 'education' | 'experience' | 'projects' | 'skills' | 'certificates' | 'references' | 'languages';

type Profile = {
  fullName: string;
  address: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolio: string;
};

type ResumeItem = {
  id: number;
  title: string;
  subtitle: string;
  details: string;
  year?: string;
  location?: string;
};

type ResumeData = {
  education: ResumeItem[];
  experience: ResumeItem[];
  skills: ResumeItem[];
  certificates: ResumeItem[];
  projects: ResumeItem[];
  languages: ResumeItem[];
  references: ResumeItem[];
};

const demoProfile: Profile = {
  fullName: '',
  address: '',
  email: '',
  phone: '',
  github: '',
  linkedin: '',
  portfolio: '',
};

const starterResume: ResumeData = {
  education: [],
  experience: [],
  skills: [],
  certificates: [],
  projects: [],
  languages: [],
  references: [],
};

const demoResumeMarkers = ['Demo', 'Example', 'Alex Morgan', 'alex@hirely.app'];

function App() {
  const [auth, setAuth] = useState<{ user: string; loggedIn: boolean }>({ user: '', loggedIn: false });
  const [profile, setProfile] = useState<Profile>(demoProfile);
  const [resume, setResume] = useState<ResumeData>(starterResume);
  const [summary, setSummary] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hirely-auth');
    if (stored) setAuth(JSON.parse(stored));
    const savedProfile = localStorage.getItem('hirely-profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    const savedResume = localStorage.getItem('hirely-resume');
    if (savedResume) setResume(JSON.parse(savedResume));
  }, []);

  useEffect(() => {
    localStorage.setItem('hirely-auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('hirely-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('hirely-resume', JSON.stringify(resume));
  }, [resume]);

  useEffect(() => {
    const savedResume = localStorage.getItem('hirely-resume');
    if (!savedResume) return;

    try {
      const parsed = JSON.parse(savedResume) as typeof starterResume;
      const hasDemoText = Object.values(parsed).some((items: any[]) =>
        items.some((item) =>
          demoResumeMarkers.some((marker) =>
            [item.title, item.subtitle, item.details].some((value) => value?.includes(marker))
          )
        )
      );

      if (hasDemoText) {
        setResume(starterResume);
        localStorage.setItem('hirely-resume', JSON.stringify(starterResume));
      }
    } catch {
      // Ignore invalid saved data and keep the current session.
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing setAuth={setAuth} />} />
        <Route path="/dashboard/*" element={auth.loggedIn ? <DashboardShell profile={profile} setProfile={setProfile} resume={resume} setResume={setResume} summary={summary} setSummary={setSummary} coverLetter={coverLetter} setCoverLetter={setCoverLetter} jobTitle={jobTitle} setJobTitle={setJobTitle} company={company} setCompany={setCompany} mode={mode} setMode={setMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setAuth={setAuth} /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

async function generateWithOpenRouter(prompt: string) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("OpenRouter API key is missing. Set VITE_OPENROUTER_API_KEY in .env");
    return null;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://hirely.app',
        'X-Title': 'Hirely Resume Builder',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS-focused resume writer. Write concise, professional text for job applications.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter Error:", errorData);
      throw new Error(errorData?.error?.message || 'OpenRouter request failed');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
}

function Landing({ setAuth }: { setAuth: (val: { user: string; loggedIn: boolean }) => void }) {
  const navigate = useNavigate();
  const handleStart = () => {
    setAuth({ user: 'Guest User', loggedIn: true });
    navigate('/dashboard');
  };
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 lg:px-10">
        <div className="grid flex-1 items-center gap-10 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-100 mx-auto lg:mx-0">RESUME BUILDER PLATFORM</p>
            <h2 className="max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl mx-auto lg:mx-0">Build professional resumes and generate AI-powered cover letters in minutes.</h2>
            <p className="mt-6 max-w-xl text-lg text-slate-300 mx-auto lg:mx-0">Create your profile, build your resume, generate AI summary and cover letter, then download instantly.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <button onClick={handleStart} className="rounded-2xl bg-cyan-400 px-8 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">Start</button>
            </div>
          </div>
          <div className="rounded-4xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-cyan-100"><Sparkles size={18}/> AI features</div>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">AI-powered ATS resume summary</li>
              <li className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">Smart cover letter generator for any job</li>
              <li className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">Instant preview + downloadable PDF resume</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

interface DashboardShellProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<typeof starterResume>>;
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  coverLetter: string;
  setCoverLetter: React.Dispatch<React.SetStateAction<string>>;
  jobTitle: string;
  setJobTitle: React.Dispatch<React.SetStateAction<string>>;
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  mode: 'light' | 'dark';
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: React.Dispatch<React.SetStateAction<{ user: string; loggedIn: boolean }>>;
}

function DashboardShell({ profile, setProfile, resume, setResume, summary, setSummary, coverLetter, setCoverLetter, jobTitle, setJobTitle, company, setCompany, mode, setMode, sidebarOpen, setSidebarOpen, setAuth }: DashboardShellProps) {
  const navigate = useNavigate();
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [photo, setPhoto] = useState<string | null>(() => localStorage.getItem('hirely-photo'));
  const themeClass = mode === 'dark'
    ? 'min-h-screen bg-[#020617] text-slate-100'
    : 'min-h-screen bg-[#f8fafc] text-slate-900';
  const [activeSection, setActiveSection] = useState<'profile' | 'education' | 'experience' | 'projects' | 'skills' | 'certificates' | 'references' | 'languages' | 'summary' | 'cover-letter' | 'preview'>('profile');

  const sectionMeta: Record<'profile' | 'education' | 'experience' | 'projects' | 'skills' | 'certificates' | 'references' | 'languages' | 'summary' | 'cover-letter' | 'preview', { title: string; caption: string; badge: string }> = {
    profile: { title: 'Profile', caption: 'Update your contact details and profile image.', badge: 'Start here' },
    education: { title: 'Education', caption: 'Add your academic background and qualifications.', badge: 'Build section' },
    experience: { title: 'Experience', caption: 'Add your work history and achievements.', badge: 'Build section' },
    projects: { title: 'Projects', caption: 'Showcase your personal or professional projects.', badge: 'Build section' },
    skills: { title: 'Skills', caption: 'List your technical, soft, and language skills.', badge: 'Build section' },
    certificates: { title: 'Certificates', caption: 'Add certifications and major achievements.', badge: 'Build section' },
    languages: { title: 'Languages', caption: 'List languages you speak and your proficiency.', badge: 'Build section' },
    references: { title: 'References', caption: 'Add professional or academic references.', badge: 'Build section' },
    summary: { title: 'Summary', caption: 'Write a professional introduction or profile summary about yourself.', badge: 'Start here' },
    'cover-letter': { title: '', caption: '', badge: '' },
    preview: { title: 'Resume Preview', caption: 'Review your resume layout and content before exporting.', badge: 'Preview' },
  };

  const updateItem = (section: SectionKey, id: number, patch: Partial<ResumeItem>) => {
    setResume((prev) => ({ ...prev, [section]: prev[section].map((item: ResumeItem) => item.id === id ? { ...item, ...patch } : item) }));
  };
  const addItem = (section: SectionKey) => {
    const templateMap: Record<SectionKey, ResumeItem> = {
      education: { id: Date.now(), title: '', subtitle: '', year: 'Year', details: 'Add your qualifications.' },
      experience: { id: Date.now() + 1, title: '', subtitle: '', year: 'Year Started - Year Ended', location: '', details: 'Describe your impact.' },
      skills: { id: Date.now() + 2, title: '', subtitle: '', details: 'Mention the tool or competency.' },
      certificates: { id: Date.now() + 3, title: '', subtitle: '', details: 'Any notable achievement.' },
      projects: { id: Date.now() + 5, title: '', subtitle: '', details: 'Project details and tech stack.' },
      languages: { id: Date.now() + 6, title: '', subtitle: '', details: '' },
      references: { id: Date.now() + 4, title: '', subtitle: '', location: '', details: '' },
    };
    setResume((prev) => ({ ...prev, [section]: [...prev[section], templateMap[section]] }));
  };
  const removeItem = (section: SectionKey, id: number) => {
    setResume((prev) => ({ ...prev, [section]: prev[section].filter((item: ResumeItem) => item.id !== id) }));
  };

  const generateSummary = async () => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      alert("AI Summary generation requires an API key. Please add VITE_OPENROUTER_API_KEY to your .env file and restart.");
      return;
    }
    setIsGenerating(true);
    const prompt = `Create a polished ATS-friendly professional summary for this resume candidate (MAX 100 WORDS). Name: ${profile.fullName}. Skills: ${resume.skills.map((item: ResumeItem) => item.details).join(', ')}. Education: ${resume.education.map((item: ResumeItem) => `${item.title} at ${item.subtitle}`).join('; ')}. Experience: ${resume.experience.map((item: ResumeItem) => `${item.title} at ${item.subtitle} - ${item.details}`).join('; ')}. Write 3-4 sentences in a human, professional tone.`;

    const aiText = await generateWithOpenRouter(prompt);

    setSummary(
      aiText || `Professional ATS-friendly summary for ${profile.fullName}: A results-driven professional with expertise across ${resume.skills.map((item: ResumeItem) => item.title).join(', ')}. Strong communication, problem-solving, and delivery skills with a clear focus on impact and value.`,
    );
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    if (!coverLetter) {
      alert("Please generate or write a cover letter first!");
      return;
    }
    const textToCopy = `
${profile.fullName}
${profile.email} | ${profile.phone}
${profile.address}

Company: ${company}
Position: ${jobTitle}

${coverLetter}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Copy Text');
    });
  };

  const generateCoverLetter = async () => {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      alert("AI Cover Letter generation requires an API key");
      return;
    }
    if (!jobTitle || !company) {
      alert("Please input the Job Title and Company Name first so the AI can generate the cover letter.");
      return;
    }

    setIsGenerating(true);
   const prompt = `
    You are a professional career writer.

      Write ONLY the body of a cover letter for the job: ${jobTitle} at ${company}.

    Candidate:
      Name: ${profile.fullName}
      Experience: ${resume.experience.map(i => `${i.title} at ${i.subtitle}: ${i.details}`).join('; ')}
      Projects: ${resume.projects.map(i => `${i.title}: ${i.details}`).join('; ')}
      Skills: ${resume.skills.map(i => i.details).join(', ')}

    Requirements:
      - 4 paragraphs only
      - Professional, confident tone
      - Connect technical background to administrative efficiency
      - Do NOT include headers, labels, or explanations
      - Do NOT repeat these instructions
      - Start immediately with the first paragraph
`;

    const aiText = await generateWithOpenRouter(prompt);
    if (aiText) setCoverLetter(aiText);
    else {
      alert("AI failed to generate. Check your API key or internet connection.");
    }
    setIsGenerating(false);
  };

  const createResumePdf = async () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    renderResume(doc, margin, contentWidth);
    return doc;
  };

  const exportPdf = async () => {
    const doc = await createResumePdf();
    doc.save('Resume.pdf');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      localStorage.setItem('hirely-photo', result);
      setPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    let isCancelled = false;
    let currentUrl: string | null = null;

    const updatePreview = async () => {
      // Only generate the PDF if the user is actually looking at the preview section.
      // This prevents background downloads if the browser is set to "Download PDFs".
      if (activeSection !== 'preview') return;

      const doc = await createResumePdf();
      if (!isCancelled) {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        const blob = doc.output('blob');
        // Append hash params to hint to the browser that this is an embedded view
        currentUrl = URL.createObjectURL(blob) + '#toolbar=0&navpanes=0&scrollbar=0';
        setPdfPreviewUrl(currentUrl);
      }
    };

    const timer = setTimeout(updatePreview, 600);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [profile, resume, summary, jobTitle, company, coverLetter, activeSection, photo]);

  const renderResume = (doc: jsPDF, margin: number, contentWidth: number) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const accent = [0, 54, 109];
    const softGray = [148, 163, 184];

    const addSectionTitle = (label: string, y: number) => {
      if (y + 20 > pageHeight - 15) {
        doc.addPage();
        y = margin;
      }
      doc.setTextColor(accent[0], accent[1], accent[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(label.toUpperCase(), margin, y + 4.2);
      doc.setDrawColor(accent[0], accent[1], accent[2]);
      doc.setLineWidth(0.4);
      doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);
      return y + 11.5;
    };

    const addBulletLine = (text: string, y: number, indent = 4) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      const lines = doc.splitTextToSize(text, contentWidth - indent - 6);
      doc.setTextColor(31, 41, 55);
      const bullet = "• ";
      const bulletWidth = doc.getTextWidth(bullet);
      doc.text(bullet, margin + indent, y);
      doc.text(lines, margin + indent + bulletWidth, y, { align: 'justify', maxWidth: contentWidth - indent - 6 });
      return y + lines.length * 5.0;
    };

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    drawContent();

    function drawContent() {
      if (photo) {
        doc.addImage(photo, 'PNG', margin, 8, 30, 30);
      }

      doc.setTextColor(accent[0], accent[1], accent[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(profile.fullName || '', margin + 40, 16); // Renders the full name

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      
      let contactY = 22;
      if (profile.address) {
        doc.text(`Address: ${profile.address}`, margin + 40, contactY);
        contactY += 4.5;
      }
      if (profile.phone) {
        doc.text(`Phone: ${profile.phone}`, margin + 40, contactY);
        contactY += 4.5;
      }
      if (profile.email) {
        doc.text(`Email: ${profile.email}`, margin + 40, contactY);
        contactY += 4.5;
      }
      if (profile.linkedin) {
        doc.text(`LinkedIn: ${profile.linkedin}`, margin + 40, contactY);
        contactY += 4.5;
      }
      if (profile.portfolio) {
        doc.text(`Portfolio: ${profile.portfolio}`, margin + 40, contactY);
        contactY += 4.5;
      }

      let y = Math.max(contactY + 8, 44);
      y = addSectionTitle('Profile', y);
      doc.setFontSize(10.5);
      const profileText = doc.splitTextToSize(summary || '', contentWidth - 2);
      if (y + (profileText.length * 5) > pageHeight - 15) {
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(31, 41, 55);
      doc.text(profileText, margin, y, { align: 'justify', maxWidth: contentWidth });
      y += profileText.length * 5.0 + 4;

      y = addSectionTitle('Work Experience', y);
      const experienceItems: ResumeItem[] = resume.experience;
      experienceItems.forEach((item: ResumeItem) => {
        if (y + 20 > pageHeight - 15) { // Ensure enough space for title, location/year, and details
          doc.addPage();
          y = margin;
        }
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text([item.title, item.subtitle].filter(Boolean).join(' - '), margin, y); // e.g., "Google - Software Engineer"

        doc.text(item.year || '', pageWidth - margin, y, { align: 'right' }); // Year on the right, bold

        y += 5.5;
        doc.setFont('helvetica', 'normal');

        if (item.location) {
          doc.setFontSize(9.5); // Slightly smaller font for secondary info
          doc.setTextColor(51, 65, 85); // Lighter color for better hierarchy
          doc.text(item.location, margin, y);
          y += 4.5;
        }
        doc.setTextColor(31, 41, 55); // Reset color for details

        const details = item.details || '';
        const detailBlocks = details.split('\n').filter(line => line.trim() !== '');
        
        detailBlocks.forEach(block => {
          const cleanLine = block.trim().replace(/^[•\-\*]\s*/, "");
          const bullet = "• ";
          doc.setFontSize(10.5);
          const bulletWidth = doc.getTextWidth(bullet);
          const wrappedLines = doc.splitTextToSize(cleanLine, contentWidth - 10 - bulletWidth);
          
          if (y + (wrappedLines.length * 5) > pageHeight - 15) {
            doc.addPage();
            y = margin;
          }
          
          doc.text(bullet, margin + 4, y);
          doc.text(wrappedLines, margin + 4 + bulletWidth, y, { align: 'justify', maxWidth: contentWidth - 10 - bulletWidth });
          y += (wrappedLines.length * 5.0) + 1.2;
        });
        y += 3;
      });

      y = addSectionTitle('Education', y);
      const educationItems: ResumeItem[] = resume.education;
      educationItems.forEach((item: ResumeItem) => {
        if (y + 15 > pageHeight - 15) { // Ensure enough space for course, university/location/year
          doc.addPage();
          y = margin;
        }
        // Line 1: Course (Left) and Year (Right)
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(item.subtitle || '', margin, y); // Course on the left, bold

        doc.setFont('helvetica', 'bold');
        doc.text(item.year || '', pageWidth - margin, y, { align: 'right' }); // Year on the right, bold

        y += 4.8;
        // Line 2: University / School
        doc.setTextColor(51, 65, 85); // Lighter color for secondary info
        doc.setFontSize(9.5); // Slightly smaller font
        doc.text(item.title || '', margin, y); // Only show University/School
        y += 4.5;
      });
      y = addSectionTitle('Projects', y);
      resume.projects.forEach((item: ResumeItem) => {
        if (y + 20 > pageHeight - 15) {
          doc.addPage();
          y = margin;
        }
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(item.title || '', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        y += 4.8;
        doc.text(item.subtitle || '', margin, y);
        y += 4.8;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(31, 41, 55);

        const details = item.details || '';
        const detailBlocks = details.split('\n').filter(line => line.trim() !== '');
        
        detailBlocks.forEach(block => {
          const cleanLine = block.trim().replace(/^[•\-\*]\s*/, "");
          const bullet = "• ";
          doc.setFontSize(10.5);
          const bulletWidth = doc.getTextWidth(bullet);
          const wrappedLines = doc.splitTextToSize(cleanLine, contentWidth - 10 - bulletWidth);

          if (y + (wrappedLines.length * 5) > pageHeight - 15) {
            doc.addPage();
            y = margin;
          }

          doc.text(bullet, margin + 4, y);
          doc.text(wrappedLines, margin + 4 + bulletWidth, y, { align: 'justify', maxWidth: contentWidth - 10 - bulletWidth });
          y += (wrappedLines.length * 5.0) + 1.2;
        });
        y += 3;
      });

      y = addSectionTitle('Additional Information', y);

      const renderLabelValue = (label: string, value: string, startY: number) => {
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        const fullLabel = label + ': ';
        doc.text(fullLabel, margin, startY);
        const labelWidth = doc.getTextWidth(fullLabel);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(31, 41, 55);
        
        // Calculate first line based on label width
        const firstLine = doc.splitTextToSize(value, contentWidth - labelWidth)[0];
        doc.text(firstLine || '', margin + labelWidth, startY);
        
        const remainingValue = value.substring((firstLine || '').length).trim();
        if (remainingValue) {
          const otherLines = doc.splitTextToSize(remainingValue, contentWidth);
          doc.text(otherLines, margin, startY + 5);
          return startY + (otherLines.length * 5) + 7;
        }
        return startY + 7;
      };

      doc.setFontSize(10.5);
      const skillsFormatted = resume.skills.map((item: ResumeItem) => item.details).filter(Boolean).join(', ') || 'None specified';
      if (y + 15 > pageHeight - 15) { doc.addPage(); y = margin; }
      y = renderLabelValue('Skills', skillsFormatted, y);

      doc.setFontSize(10.5);
      const languagesText = resume.languages.map((l: ResumeItem) => l.title).join(', ') || 'Available upon request';
      if (y + 15 > pageHeight - 15) { doc.addPage(); y = margin; }
      y = renderLabelValue('Languages', languagesText, y);

      doc.setFontSize(10.5);
      const certText = resume.certificates.map((item: ResumeItem) => item.title).join(', ') || 'None specified';
      if (y + 15 > pageHeight - 15) { doc.addPage(); y = margin; }
      y = renderLabelValue('Certifications & Training', certText, y);

      if (resume.references && resume.references.length > 0) {
        y = addSectionTitle('References', y);
        const colWidth = (contentWidth - 10) / 2;
        let maxHeightInRow = 0;
        let rowY = y;

        resume.references.forEach((item: ResumeItem, index: number) => {
          const isRightColumn = index % 2 !== 0;
          const x = isRightColumn ? margin + colWidth + 10 : margin;
          
          if (isRightColumn) {
            y = rowY;
          }

          // Split all text blocks to handle wrapping within its own column
          doc.setFontSize(10.5);
          doc.setFont('helvetica', 'bold');
          const titleLines = doc.splitTextToSize(item.title || 'Reference', colWidth);
          doc.setFont('helvetica', 'normal');
          const contact = [item.subtitle, item.location].filter(Boolean).join('  •  ');
          const contactLines = doc.splitTextToSize(contact, colWidth);
          const detailLines = doc.splitTextToSize(item.details || '', colWidth);

          const entryHeight = (titleLines.length * 5.5) + (contactLines.length * 5.0) + (detailLines.length * 5.0);

          if (y + entryHeight + 5 > pageHeight - 15) {
            doc.addPage();
            y = margin;
            rowY = margin;
          }

          let drawY = y;

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(titleLines, x, drawY);
          drawY += titleLines.length * 5.5;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          doc.text(contactLines, x, drawY);
          drawY += contactLines.length * 5.0;
          
          doc.setTextColor(31, 41, 55);
          doc.text(detailLines, x, drawY);
          drawY += detailLines.length * 5.0;
          
          maxHeightInRow = Math.max(maxHeightInRow, drawY - y);
          
          if (isRightColumn || index === resume.references.length - 1) {
            y = rowY + maxHeightInRow + 5;
            maxHeightInRow = 0;
            rowY = y;
          }
        });
      }

      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
     
    }
  };

  const downloadDocx = () => {
    const link = document.createElement('a');
    // Move this file to your /public folder and reference it from the root
    link.href = '/Letter.docx'; 
    link.download = 'Letter.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportBoth = () => { exportPdf(); downloadDocx(); };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <section className="mt-5">
            <article className={`rounded-[24px] border ${mode === 'dark' ? 'border-white/10 bg-[linear-gradient(145deg,#08111f_0%,#020617_100%)]' : 'border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]'} p-6`}>
              <div className="grid gap-4 md:grid-cols-2">
                {(['fullName', 'address', 'email', 'phone', 'github', 'linkedin', 'portfolio'] as (keyof Profile)[]).map((field) => (
                  <label key={field} className={`grid gap-1 text-sm ${mode === 'dark' ? 'text-slate-200' : 'text-slate-600 font-medium'}`}>
                    <span className="capitalize">{field === 'fullName' ? 'Full Name' : field}</span>
                    <input value={profile[field]} onChange={(e) => setProfile({ ...profile, [field]: e.target.value })} className={`rounded-2xl border ${mode === 'dark' ? 'border-white/10 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'} px-4 py-3 outline-none focus:border-cyan-400`} />
                  </label>
                ))}
                <label className={`grid gap-1 text-sm ${mode === 'dark' ? 'text-slate-200' : 'text-slate-700'} md:col-span-2`}>
                  <span>Profile Picture</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className={`rounded-2xl border ${mode === 'dark' ? 'border-white/10 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'} px-4 py-3 file:mr-3 file:rounded-full file:border-0 ${mode === 'dark' ? 'file:bg-cyan-400/10 file:text-cyan-100' : 'file:bg-cyan-400/20 file:text-cyan-700 font-semibold'} file:px-3 file:py-1 cursor-pointer`} 
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => { 
                  setProfile(demoProfile); 
                  setPhoto(null); 
                  localStorage.removeItem('hirely-photo'); 
                }} className={`rounded-2xl border px-4 py-3 text-sm transition ${mode === 'dark' ? 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10' : 'border-slate-200 bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900'}`}>Reset</button>
                <button onClick={() => alert('Profile saved locally in this session.')} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Save profile</button>
              </div>
            </article>
          </section>
        );

      case 'education':
      case 'experience':
      case 'projects':
      case 'skills':
      case 'languages':
      case 'references':
      case 'certificates':
        return (
          <section className="mt-5">
            <div className="space-y-4">
              <CardSection mode={mode} label={activeSection as SectionKey} items={resume[activeSection as SectionKey]} onAdd={() => addItem(activeSection as SectionKey)} onDelete={(id) => removeItem(activeSection as SectionKey, id)} onChange={(id, patch) => updateItem(activeSection as SectionKey, id, patch)} />
            </div>
          </section>
        );

      case 'summary':
        return (
          <section className="mt-5">
            <article className={`rounded-[24px] border ${mode === 'dark' ? 'border-white/10 bg-[linear-gradient(145deg,#08111f_0%,#020617_100%)]' : 'border-slate-200 bg-white'} p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Professional Summary</h4>
                  <p className={`mt-1 text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>Generate or edit your professional bio.</p>
                </div>
                <button 
                  onClick={generateSummary} 
                  disabled={isGenerating}
                  className={`rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? 'Generating' : 'Generate'}
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={summary}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= 100) {
                      setSummary(e.target.value);
                    } else {
                      alert('You have reached the maximum limit of 100 words for the summary.');
                    }
                  }}
                  rows={8}
                  placeholder="Enter your profile summary here..."
                  className={`mt-4 w-full rounded-3xl border ${mode === 'dark' ? 'border-white/10 bg-slate-900/90 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'} p-4 outline-none focus:border-cyan-400`}
                />
                <div className={`mt-2 text-right text-xs font-medium ${summary.trim().split(/\s+/).filter(Boolean).length >= 100 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {summary.trim().split(/\s+/).filter(Boolean).length} / 100 words
                </div>
              </div>
              <div className="mt-4">
                <button onClick={() => alert('Summary updated! Check the Live Preview.')} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Save Summary</button>
              </div>
            </article>
          </section>
        );

      case 'cover-letter':
        return (
          <section className="mt-5">
            <article className={`rounded-[24px] border ${mode === 'dark' ? 'border-white/10 bg-[linear-gradient(145deg,#08111f_0%,#020617_100%)]' : 'border-slate-200 bg-white'} p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Cover Letter</h4>
                  <p className={`mt-1 text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>Tailor a letter for the role you are applying for.</p>
                </div>
                <button 
                  onClick={generateCoverLetter} 
                  disabled={isGenerating}
                  className={`rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? 'Generating' : 'Generate'}
                </button>
              </div>
              <div className={`mt-4 grid gap-3 text-sm ${mode === 'dark' ? 'text-slate-200' : 'text-slate-700'} md:grid-cols-2`}>
                <label>Job Title<input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={`mt-1 w-full rounded-2xl border ${mode === 'dark' ? 'border-white/10 bg-slate-900/90 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'} px-4 py-3 outline-none`} /></label>
                <label>Company Name<input value={company} onChange={(e) => setCompany(e.target.value)} className={`mt-1 w-full rounded-2xl border ${mode === 'dark' ? 'border-white/10 bg-slate-900/90 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'} px-4 py-3 outline-none`} /></label>
              </div>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={10} className={`mt-4 w-full rounded-3xl border ${mode === 'dark' ? 'border-white/10 bg-slate-900/90 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'} p-4 outline-none focus:border-cyan-400`} />
              {coverLetter && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={copyToClipboard} className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    <Copy size={16} /> Copy Text
                  </button>
                  <button onClick={downloadDocx} className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 shadow-lg shadow-cyan-500/20">
                    <Download size={16} /> Download DOCX
                  </button>
                </div>
              )}
            </article>
          </section>
        );

      case 'preview':
        return (
          <section className="mt-5">
            <article className={`rounded-[24px] border ${mode === 'dark' ? 'border-white/10 bg-[linear-gradient(145deg,#08111f_0%,#020617_100%)]' : 'border-slate-200 bg-white'} p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}>
              <div className="w-full">
                <div className={`rounded-[24px] border ${mode === 'dark' ? 'border-white/10 bg-slate-950/95' : 'border-slate-200 bg-slate-50'} p-5 shadow-inner overflow-x-auto`}>
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h4 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Live PDF Preview</h4>
                      <p className={`mt-1 text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>This preview reflects the same A4 PDF layout you will download.</p>
                    </div>
                    <button onClick={exportPdf} className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Download PDF</button>
                  </div>

                  {pdfPreviewUrl ? (
                    <iframe
                      title="Resume PDF preview"
                      src={pdfPreviewUrl} // The iframe itself
                      className="mt-4 h-[640px] w-full max-w-full rounded-3xl border border-white/10 bg-white" // Added max-w-full
                    />
                  ) : (
                    <div className={`mt-4 rounded-3xl border border-dashed p-6 text-sm ${mode === 'dark' ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-white text-slate-500'}`}>
                      Generating your live PDF preview...
                    </div>
                  )}
                </div>
              </div>
            </article>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={themeClass}>
      <div className="mx-auto flex max-w-7xl p-4 lg:p-6">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 border-r ${mode === 'dark' ? 'border-white/10 bg-slate-950/95' : 'border-slate-200/60 bg-white shadow-2xl shadow-slate-200/40'} p-5 transition lg:static lg:translate-x-0 lg:rounded-3xl lg:border ${mode === 'dark' ? 'lg:bg-slate-900/90' : 'lg:bg-white'}`}>
          <div className="flex items-center justify-between lg:block">
            <div className="flex items-center justify-center py-2 flex-1">
              <img src={logo} alt="Logo" className="h-24 w-auto object-contain" />
            </div>
            <button onClick={() => setSidebarOpen(false)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white lg:hidden"><X size={24} /></button>
          </div>
          <nav className="mt-8 space-y-1 text-sm">
            {[
              { key: 'profile', label: 'Profile', icon: <User size={16} /> },
              { key: 'summary', label: 'Summary', icon: <PenTool size={16} /> },
              { key: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
              { key: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
              { key: 'projects', label: 'Projects', icon: <PlusCircle size={16} /> },
              { key: 'skills', label: 'Skills', icon: <Wrench size={16} /> },
              { key: 'certificates', label: 'Certificates', icon: <Award size={16} /> },
              { key: 'languages', label: 'Languages', icon: <Languages size={16} /> },
              { key: 'references', label: 'References', icon: <Users size={16} /> },
              { key: 'cover-letter', label: 'Cover Letter', icon: <FileEdit size={16} /> },
              { key: 'preview', label: 'Resume Preview', icon: <Eye size={16} /> },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => { setActiveSection(item.key as any); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${activeSection === item.key
                  ? (mode === 'dark' ? 'bg-cyan-400/12 text-cyan-100' : 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200/50')
                  : (mode === 'dark' ? 'text-slate-200 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950')}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <button onClick={() => { setAuth({ user: '', loggedIn: false }); navigate('/'); }} className={`mt-8 flex h-12 w-12 mx-auto items-center justify-center rounded-2xl border ${mode === 'dark' ? 'border-white/10 bg-white/5 text-slate-100' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`} title="Logout"><LogOut size={20} /></button>
        </aside>
        <main className="flex-1 lg:ml-6">
          <div className="flex items-center justify-start pt-1 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className={`rounded-xl border p-2 ${mode === 'dark' ? 'border-white/10 bg-white/5 text-slate-100' : 'border-slate-200 bg-slate-100 text-slate-700'}`}><Menu size={18} /></button>
          </div>

          <div className={`mt-3 rounded-[28px] border ${mode === 'dark' ? 'border-white/10 bg-slate-950/85 shadow-[0_24px_60px_rgba(2,6,23,0.45)]' : 'border-slate-200/70 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)]'} p-5 backdrop-blur-xl lg:h-[820px] overflow-y-auto`}>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className={`text-2xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{sectionMeta[activeSection as keyof typeof sectionMeta].title}</h3>
                <p className={`mt-1 text-sm ${mode === 'dark' ? 'text-slate-300' : 'text-slate-600 font-medium'}`}>{sectionMeta[activeSection as keyof typeof sectionMeta].caption}</p>
              </div>
            </div>

            {renderActiveSection()}
          </div>
        </main>
        <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} className={`fixed bottom-4 right-4 z-50 h-11 w-11 flex items-center justify-center rounded-2xl rounded-br-sm border transition-all active:scale-95 ${mode === 'dark' ? 'border-white/10 bg-white/5 text-cyan-400' : 'border-slate-200 bg-white text-cyan-600 shadow-sm'}`}>
          {mode === 'dark' ? (
            <Moon size={20} fill="currentColor" fillOpacity={0.1} />
          ) : (
            <Sun size={20} fill="currentColor" fillOpacity={0.1} />
          )}
        </button>
      </div>
    </div>
  );
}


function CardSection({ label, items, onAdd, onDelete, onChange, mode }: { label: SectionKey; items: ResumeItem[]; onAdd: () => void; onDelete: (id: number) => void; onChange: (id: number, patch: Partial<ResumeItem>) => void; mode: 'light' | 'dark' }) {
  const showYearLocation = label === 'education' || label === 'experience';
  const showSingleDate = label === 'certificates';
  const isDark = mode === 'dark';

  const addLabelMap: Record<SectionKey, string> = {
    education: 'Add education',
    experience: 'Add experience',
    projects: 'Add project',
    skills: 'Add skills',
    certificates: 'Add certificates',
    languages: 'Add language',
    references: 'Add reference',
  };

  const emptyLabelMap: Record<SectionKey, string> = {
    education: 'No education added yet.',
    experience: 'No experience added yet.',
    projects: 'No projects added yet.',
    skills: 'No skills added yet.',
    certificates: 'No certificates added yet.',
    languages: 'No languages added yet.',
    references: 'No references added yet.',
  };

  const fieldLabels: Record<SectionKey, { subtitle: string; title?: string; year?: string; location?: string; details: string }> = {
    education: { title: 'University / School', subtitle: 'Course', year: 'Dates', location: 'Location', details: 'Highlights' },
    experience: { title: 'Company Name', subtitle: 'Job Position', year: 'Dates', details: 'Description' },
    projects: { title: 'Project Name', subtitle: 'Role / Tech Stack', details: 'Project Description' },
    skills: { title: '', subtitle: '', details: 'Skills / Competencies' },
    languages: { title: 'Language', subtitle: "", details: '' },
    certificates: { title: 'Name', subtitle: 'Issuing Organization', year: 'Issue Date', details: 'Details' },
    references: { title: 'Name', subtitle: 'Position', location: 'Organization/Company', details: 'Contact Details' },
  };

  const labels = fieldLabels[label] ?? fieldLabels.education;
  const fieldClass = `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${isDark
    ? 'border-white/10 bg-slate-900/95 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'}`;

  return (
    <div className={`rounded-[24px] border ${isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50'} p-4`}>
      {items.length === 0 ? (
        <div className={`rounded-[24px] border border-dashed p-5 text-center ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{emptyLabelMap[label]}</p>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Start by adding your first {label.toLowerCase()} entry.</p>
          <button onClick={onAdd} className="mt-4 rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-300">{addLabelMap[label]}</button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className={`rounded-[24px] border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} p-4 shadow-sm transition hover:border-cyan-400/30 hover:bg-cyan-400/5`}>
            <div className="space-y-4 text-sm">
              {labels.title && (
                <label className="block">
                  <span className={`mb-1.5 block text-[11px] uppercase tracking-[0.25em] ${isDark ? 'text-cyan-100/90' : 'text-cyan-700'}`}>{labels.title}</span>
                  <input value={item.title} onChange={(e) => onChange(item.id, { title: e.target.value })} placeholder={labels.title} className={fieldClass} />
                </label>
              )}

              {labels.subtitle && (
                <label className="block">
                  <span className={`mb-1.5 block text-[11px] uppercase tracking-[0.25em] ${isDark ? 'text-cyan-100/90' : 'text-cyan-700'}`}>{labels.subtitle}</span>
                  <input value={item.subtitle} onChange={(e) => onChange(item.id, { subtitle: e.target.value })} placeholder={labels.subtitle} className={fieldClass} />
                </label>
              )}

              {showYearLocation && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className={`block ${label === 'experience' || label === 'education' ? 'md:col-span-2' : ''}`}>
                    <span className={`mb-1.5 block text-[11px] uppercase tracking-[0.25em] ${isDark ? 'text-cyan-100/90' : 'text-cyan-700'}`}>{labels.year}</span>
                    <input value={item.year || ''} onChange={(e) => onChange(item.id, { year: e.target.value })} placeholder={labels.year} className={fieldClass} />
                  </label>
                </div>
              )}

              {showSingleDate && labels.year && (
                <label className="block">
                  <span className={`mb-1.5 block text-[11px] uppercase tracking-[0.25em] ${isDark ? 'text-cyan-100/90' : 'text-cyan-700'}`}>{labels.year}</span>
                  <input value={item.year || ''} onChange={(e) => onChange(item.id, { year: e.target.value })} placeholder={labels.year} className={fieldClass} />
                </label>
              )}

              {labels.details && (
                <label className="block">
                  <span className={`mb-1.5 block text-[11px] uppercase tracking-[0.25em] ${isDark ? 'text-cyan-100/90' : 'text-cyan-700'}`}>{labels.details}</span>
                  <textarea value={item.details} onChange={(e) => onChange(item.id, { details: e.target.value })} rows={4} placeholder={labels.details} className={`${fieldClass} resize-none`} />
                </label>
              )}

              <div className="pt-1">
                <button
                  onClick={() => onDelete(item.id)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition hover:bg-rose-500/20 ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-100' : 'border-rose-500/30 bg-rose-500/10 text-rose-700'}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <button onClick={onAdd} className="rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-300">Add</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
