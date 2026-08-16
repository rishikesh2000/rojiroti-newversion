export type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  experience: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  mode: "Remote" | "Hybrid" | "Onsite";
  skills: string[];
  postedDays: number;
  applicants: number;
  description: string;
  featured?: boolean;
};

const logoColors = ["#2d2bc7", "#12cbf5", "#3f4ce2", "#1a1b8f", "#7c3aed", "#0ea5e9"];
const make = (i: number, j: Partial<Job>): Job => ({
  id: String(i),
  title: "Senior Product Designer",
  company: "Linear",
  logo: logoColors[i % logoColors.length],
  location: "Bengaluru, IN",
  salary: "₹18L – ₹32L",
  experience: "4–7 yrs",
  type: "Full-time",
  mode: "Hybrid",
  skills: ["Figma", "Design Systems", "Prototyping"],
  postedDays: 2,
  applicants: 124,
  description:
    "Join our team to craft delightful product experiences. You'll partner closely with engineering and PMs to ship beautiful, performant interfaces used by millions.",
  ...j,
});

export const JOBS: Job[] = [
  make(1, { title: "Senior Frontend Engineer", company: "Stripe", location: "Remote", salary: "₹40L – ₹70L", skills: ["React", "TypeScript", "Next.js"], featured: true, applicants: 312 }),
  make(2, { title: "Product Designer", company: "Notion", location: "Bengaluru, IN", salary: "₹22L – ₹38L", skills: ["Figma", "UX", "Prototyping"], mode: "Hybrid" }),
  make(3, { title: "Data Scientist", company: "Razorpay", location: "Mumbai, IN", salary: "₹28L – ₹48L", skills: ["Python", "ML", "SQL"], mode: "Onsite", featured: true }),
  make(4, { title: "Mobile Engineer (iOS)", company: "Swiggy", location: "Bengaluru, IN", salary: "₹24L – ₹42L", skills: ["Swift", "SwiftUI"], experience: "3–6 yrs" }),
  make(5, { title: "Engineering Manager", company: "Zerodha", location: "Bengaluru, IN", salary: "₹50L – ₹85L", skills: ["Leadership", "Systems"], experience: "8+ yrs", mode: "Onsite" }),
  make(6, { title: "Growth Marketer", company: "CRED", location: "Remote", salary: "₹16L – ₹28L", skills: ["SEO", "Lifecycle", "Analytics"], type: "Remote", mode: "Remote" }),
  make(7, { title: "Backend Engineer", company: "Postman", location: "Bengaluru, IN", salary: "₹26L – ₹46L", skills: ["Go", "Postgres", "Kafka"] }),
  make(8, { title: "DevOps Engineer", company: "Freshworks", location: "Chennai, IN", salary: "₹20L – ₹36L", skills: ["AWS", "K8s", "Terraform"], mode: "Hybrid" }),
];

export const COMPANIES = [
  { name: "Stripe", roles: 24, color: "#635bff" },
  { name: "Notion", roles: 12, color: "#000000" },
  { name: "Razorpay", roles: 31, color: "#0c4ade" },
  { name: "Swiggy", roles: 18, color: "#fc8019" },
  { name: "Zerodha", roles: 9, color: "#387ed1" },
  { name: "CRED", roles: 14, color: "#0f0f0f" },
];

export const STATS = [
  { label: "Active Jobs", value: "120K+" },
  { label: "Hired Monthly", value: "8,400" },
  { label: "Verified Employers", value: "12,500" },
  { label: "Job Seekers", value: "3.2M" },
];

export const TESTIMONIALS = [
  { name: "Ananya Sharma", role: "Product Designer @ Notion", quote: "Got 3 interviews in my first week. The recommendations felt eerily accurate.", avatar: "AS" },
  { name: "Rohit Verma", role: "Engineering Lead @ Razorpay", quote: "We cut our hiring cycle by 40%. The applicant quality is unmatched.", avatar: "RV" },
  { name: "Priya Iyer", role: "Frontend Engineer @ Stripe", quote: "The cleanest hiring experience I've used. Felt premium end-to-end.", avatar: "PI" },
];
