import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import useEmployeeStore from "@/store/employeeStore";
import { Clock, MapPin, CalendarDays, FileText, Briefcase, User, Bookmark, CheckCircle2, Upload, ArrowRight, Edit3, CircleX, BookOpen, Settings2, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    getEmployee,
    getDashboard,
    getSavedJobs,
    getApplyedJobs,
    savedJobs: savedJobsFromStore,
    appliedJobs,
    uploadResume,
    downloadResume,
    completeProfile,
    uploadProfilePhoto,
    deleteProfilePhoto,
    sendPhoneNoUpdateOtp,
    verifyPhoneNoUpdate,
    // email update endpoints
    sendEmailUpdateOtp,
    verifyAndUpdateEmail,
    updateAvailability,
    user,
    dashboard,
    isLoading,
    error,
    unsaveJob,
  } = useEmployeeStore();

  const skillGroups = [
    {
      label: "Teacher / Tutor",
      items: [
        "Assessment Development",
        "Child Care",
        "Computer Knowledge",
        "Content Development",
        "Lesson Planning",
        "None of these",
      ],
    },
    {
      label: "Graphic / Web Designer",
      items: [
        "3D Modelling/Designing",
        "Adobe DreamWeaver",
        "Adobe Flash",
        "Adobe Illustrator",
        "Adobe InDesign",
        "Adobe Photoshop",
        "Adobe Premier Pro",
        "CorelDraw",
        "DTP Operator",
        "HTML/CSS Graphic Design",
      ],
    },
    {
      label: "Languages",
      items: [
        "English",
        "Hindi",
        "Marathi",
        "Bengali",
        "Punjabi",
        "Gujarati",
        "Malayalam",
        "Tamil",
        "Telugu",
        "Kannada",
        "Other",
      ],
    },
  ];

  const presetSkillSet = useMemo(() => new Set(skillGroups.flatMap((group) => group.items)), [skillGroups]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState<
    | "profile"
    | "salary"
    | "availability"
    | "preferences"
    | "about"
    | "skills"
    | "experience"
    | "education"
    | null
  >(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocationCities, setSelectedLocationCities] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [jobTypeQuery, setJobTypeQuery] = useState("");
  const [showJobTypeSuggestions, setShowJobTypeSuggestions] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [experienceDraft, setExperienceDraft] = useState({
    job_title: "",
    job_role: "",
    company_name: "",
    start_date: null as string | null,
    end_date: null as string | null,
    currently_working_here: false,
  });
  const educationYearOptions = Array.from({ length: 2040 - 1990 + 1 }, (_, index) => 1990 + index);

  const [educationDraft, setEducationDraft] = useState({
    degree: "",
    institute: "",
    field_of_study: "",
    start_year: null as number | null,
    end_year: null as number | null,
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileDialogMessage, setProfileDialogMessage] = useState<string | null>(null);
  const [profileDialogTone, setProfileDialogTone] = useState<"success" | "error" | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    gender: "",
    summary: "",
    salaryExpectation: "",
    isAvailable: false,
    noticePeriod: "",
    jobTypes: "",
    locations: "",
    remoteOk: false,
    skills: "",
    languages: "",
  });
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ label: string; value: string }>>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [resumeMessage, setResumeMessage] = useState<string | null>(null);
  const [resumeMessageTone, setResumeMessageTone] = useState<"success" | "error" | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [resumeDownloadError, setResumeDownloadError] = useState<string | null>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [showPhoneChangeModal, setShowPhoneChangeModal] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"request" | "verify">("request");
  const [newPhone, setNewPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [phoneChangeLoading, setPhoneChangeLoading] = useState(false);
  const [phoneChangeMessage, setPhoneChangeMessage] = useState<string | null>(null);
  const [phoneChangeTone, setPhoneChangeTone] = useState<"success" | "error" | null>(null);

  // Email update modal state (mirrors phone flow)
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
  const [emailStep, setEmailStep] = useState<"request" | "verify">("request");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeMessage, setEmailChangeMessage] = useState<string | null>(null);
  const [emailChangeTone, setEmailChangeTone] = useState<"success" | "error" | null>(null);

  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);

  const employeeId = user?.id ?? user?._id ?? user?.employee_id ?? user?.employeeId ?? null;

  useEffect(() => {
    void getEmployee();
    void getDashboard();
    void getSavedJobs();
    void getApplyedJobs();
  }, [getEmployee, getDashboard, getSavedJobs, getApplyedJobs]);

  const jobs = Array.isArray(savedJobsFromStore) ? savedJobsFromStore : [];

  const profileName = useMemo(
    () => (user?.name ?? (`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim())) || "Candidate",
    [user],
  );

  // Prefer profile_picture_url (backend field) for avatar; fallback to legacy avatar
  const profileAvatar = user?.profile_picture_url ?? user?.avatar ?? null;
  const profileEmail = user?.email ?? "Not available";
  const profilePhone = user?.phone ?? user?.mobile ?? "Not available";
  const profileGender = user?.gender ?? "Not specified";
  const emailVerified = user?.email_verified ?? user?.emailVerified ?? false;
  const phoneVerified = user?.phone_verified ?? user?.phoneVerified ?? false;
  const profileLocation = user?.location_name ?? user?.location ?? "Not specified";
  const normalizeSkill = (skill: any) => {
    if (!skill) return "";
    if (typeof skill === "string") return skill;
    if (typeof skill === "object") return skill.name ?? skill.level ?? skill.years ?? "";
    return String(skill);
  };

  const profileEducation = Array.isArray(user?.education) && user.education.length > 0 ? user.education.map((item: any) => item.degree ?? item.qualification ?? item.course ?? item.name ?? item.level ?? String(item)).join(", ") : "Not specified";
  const profileExperience = user?.total_experience ?? "Not specified";
  const profileSkills = Array.isArray(user?.skills) ? user.skills.map(normalizeSkill).filter(Boolean) : [];

  const formatEducationTitle = (item: any) => {
    if (!item) return "Education";
    if (typeof item === "string") return item;
    return item.degree ?? item.qualification ?? item.course ?? item.name ?? item.level ?? String(item);
  };

  const formatEducationInstitute = (item: any) => {
    if (!item) return "Institute not listed";
    if (typeof item === "string") return item;
    return item.institute ?? item.school ?? item.college ?? item.organization ?? item.name ?? "Institute not listed";
  };

  const formatEducationYear = (item: any) => {
    if (!item) return "Year not specified";
    if (typeof item === "string") return item;
    return item.year ?? item.period ?? item.years ?? "Year not specified";
  };
  const profileTitle = user?.title ?? user?.job_category ?? "Candidate";
  const profileSummary = user?.summary ?? "Add a summary to highlight your strengths and job preferences.";
  const profileCompletion = user?.metadata?.profile_completion ?? dashboard?.profile_completion ?? dashboard?.profile_completion_percent ?? 0;
  const workExperience = Array.isArray(user?.work_experience) ? user.work_experience : [];
  const educationItems = Array.isArray(user?.education) ? user.education : [];
  const documents = Array.isArray(user?.documents) ? user.documents : [];
  const salaryExpectation = user?.expected_salary ?? "Not specified";
  const availability = user?.availability?.is_available ? "Available" : "Not available";
  const noticePeriod = user?.availability?.notice_period_days != null ? `${user.availability.notice_period_days} days` : "Not specified";
  const preferences = user?.preferences ?? { job_types: [], locations: [], remote_ok: false };
  const profileJobTypes = Array.isArray(preferences.job_types) && preferences.job_types.length > 0 ? preferences.job_types.join(", ") : "Not specified";
  const profileLocations = Array.isArray(preferences.locations) && preferences.locations.length > 0 ? preferences.locations.join(", ") : "Not specified";
  const profileRemoteOk = preferences.remote_ok ? "Yes" : "No";
  const applications = Array.isArray(appliedJobs) && appliedJobs.length > 0
    ? appliedJobs
    : Array.isArray(dashboard?.applications)
    ? dashboard.applications
    : Array.isArray(dashboard?.applied_jobs)
    ? dashboard.applied_jobs
    : [];
  const interviews = Array.isArray(dashboard?.interviews)
    ? dashboard.interviews
    : Array.isArray(dashboard?.upcoming_interviews)
    ? dashboard.upcoming_interviews
    : [];
  const resumeUrl = user?.resume_url ?? dashboard?.resume_url ?? user?.resume ?? null;
  const hasResume = Boolean(resumeUrl || documents.length > 0);
  const missingProfileItems = [
    !profileSummary && "Add a profile summary",
    workExperience.length === 0 && "Add work experience",
    educationItems.length === 0 && "Add education history",
    profileSkills.length === 0 && "Add skills",
    salaryExpectation === "Not specified" && "Add salary expectations",
    user?.availability == null && "Update your availability",
    profileJobTypes === "Not specified" && "Set preferred job types",
    profileLocations === "Not specified" && "Set preferred locations",
    // check hasResume (resume URL or uploaded documents) instead of documents array only
    !hasResume && "Upload your resume or portfolio",
  ].filter(Boolean) as string[];

  const syncProfileForm = () => {
    setProfileForm({
      name: profileName,
      title: profileTitle,
      location: profileLocation,
      email: profileEmail === "Not available" ? "" : profileEmail,
      phone: profilePhone === "Not available" ? "" : profilePhone,
      gender: user?.gender ?? "",
      summary: user?.summary ?? "",
      salaryExpectation: user?.expected_salary ?? "",
      isAvailable: Boolean(user?.availability?.is_available),
      noticePeriod: user?.availability?.notice_period_days?.toString() ?? "",
      jobTypes: Array.isArray(preferences.job_types) ? preferences.job_types.join(", ") : "",
      locations: Array.isArray(preferences.locations) ? preferences.locations.join(", ") : "",
      remoteOk: Boolean(preferences.remote_ok),
      skills: profileSkills.filter((skill) => !presetSkillSet.has(skill)).join(", "),
      languages: Array.isArray(user?.languages) ? user.languages.join(", ") : user?.languages ?? "",
    });
    setSelectedJobTypes(Array.isArray(preferences.job_types) ? preferences.job_types : []);
    setSelectedLocationCities(Array.isArray(preferences.locations) ? preferences.locations.slice(0, 5) : []);
    setLocationQuery("");
    setJobTypeQuery("");
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setLocationError(null);
    setSelectedSkills(profileSkills);
    setEditingExperienceIndex(null);
    setEditingEducationIndex(null);
    setExperienceDraft({
      job_title: "",
      job_role: "",
      company_name: "",
      start_date: null,
      end_date: null,
      currently_working_here: false,
    });
    setEducationDraft({
      degree: "",
      institute: "",
      field_of_study: "",
      start_year: null,
      end_year: null,
    });
  };

  useEffect(() => {
    syncProfileForm();
  }, [user, dashboard]);

  const openProfileEditor = (
    section:
      | "profile"
      | "salary"
      | "availability"
      | "preferences"
      | "about"
      | "skills"
      | "experience"
      | "education",
    experienceIndex?: number,
    educationIndex?: number
  ) => {
    setActiveProfileSection(section);
    syncProfileForm();
    
    // If editing existing experience
    if (section === "experience" && experienceIndex !== undefined) {
      const exp = workExperience[experienceIndex];
      setEditingExperienceIndex(experienceIndex);
      setExperienceDraft({
        job_title: exp?.job_title ?? "",
        job_role: exp?.job_role ?? "",
        company_name: exp?.company_name ?? "",
        start_date: exp?.start_date ?? null,
        end_date: exp?.end_date ?? null,
        currently_working_here: exp?.currently_working_here ?? false,
      });
    } else if (section === "experience") {
      setEditingExperienceIndex(null);
      setExperienceDraft({
        job_title: "",
        job_role: "",
        company_name: "",
        start_date: null,
        end_date: null,
        currently_working_here: false,
      });
    }
    
    // If editing existing education
    if (section === "education" && educationIndex !== undefined) {
      const edu = educationItems[educationIndex];
      setEditingEducationIndex(educationIndex);
      setEducationDraft({
        degree: edu?.degree ?? edu?.education_level ?? "",
        institute: edu?.institute ?? edu?.institute_school ?? "",
        field_of_study: edu?.field_of_study ?? "",
        start_year: edu?.start_year ?? null,
        end_year: edu?.end_year ?? null,
      });
    } else if (section === "education") {
      setEditingEducationIndex(null);
      setEducationDraft({
        degree: "",
        institute: "",
        field_of_study: "",
        start_year: null,
        end_year: null,
      });
    }
    
    setProfileDialogMessage(null);
    setProfileDialogTone(null);
    setProfileDialogOpen(true);
  };

  const updateProfileForm = (field: string, value: string | boolean) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDisplayDate = (value: string | null | undefined) => {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const splitSkillsText = (value: string) =>
    Array.from(
      new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );

  const otherSkillItems = useMemo(
    () => splitSkillsText(profileForm.skills).filter((skill) => !presetSkillSet.has(skill)),
    [profileForm.skills, presetSkillSet],
  );

  const removeOtherSkill = (skill: string) => {
    const updatedSkills = splitSkillsText(profileForm.skills).filter((item) => item !== skill).join(", ");
    updateProfileForm("skills", updatedSkills);
    setSelectedSkills((prev) => prev.filter((item) => item !== skill));
  };

  const cityDisplayValue = (result: any) => {
    if (!result?.address) return null;
    const address = result.address;
    return (
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.suburb ||
      null
    );
  };

  const selectLocationSuggestion = (suggestion: { label: string; value: string }) => {
    setProfileForm((prev) => ({ ...prev, location: suggestion.value }));
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setLocationError(null);
  };

  const fetchLocationSuggestions = async (query: string) => {
    setLocationQuery(query);
    if (!query.trim()) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      setLocationError(null);
      return;
    }

    setIsLocationLoading(true);
    setLocationError(null);

    try {
      const encoded = encodeURIComponent(query + " India");
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&countrycodes=in&dedupe=1&q=${encoded}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Unable to fetch locations");
      }
      const results = await response.json();
      const suggestions = Array.isArray(results)
        ? results
            .map((item: any) => {
              const city = cityDisplayValue(item);
              return city ? { label: city, value: city } : null;
            })
            .filter((item): item is { label: string; value: string } => Boolean(item))
            .filter((item: { label: string; value: string }, index: number, arr: { label: string; value: string }[]) => arr.findIndex((match: { label: string; value: string }) => match.value === item.value) === index)
            .slice(0, 5)
        : [];
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(suggestions.length > 0);
    } catch (error) {
      setLocationError("Unable to fetch city suggestions. Please try again.");
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const addLocationCity = (city: string) => {
    if (!city) return;
    if (selectedLocationCities.includes(city)) {
      setLocationError(`${city} is already added.`);
      return;
    }
    if (selectedLocationCities.length >= 5) {
      setLocationError("Select up to 5 Indian cities.");
      return;
    }
    setSelectedLocationCities((prev) => [...prev, city]);
    setLocationQuery("");
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setLocationError(null);
  };

  const removeLocationCity = (city: string) => {
    setSelectedLocationCities((prev) => prev.filter((item) => item !== city));
    setLocationError(null);
  };

  const jobTypeSuggestionList = [
    "Customer Service",
    "Sales",
    "Teaching",
    "Graphic Design",
    "Marketing",
    "Data Entry",
    "Accounting",
    "Office Assistant",
    "Software",
    "HR",
    "Content Writing",
    "Social Media",
    "Web Development",
    "Field Sales",
    "Telecaller",
    "Receptionist",
    "Backend Developer",
    "Frontend Developer",
    "Business Development",
    "Digital Marketing",
    "Operations",
    "Logistics",
    "Quality Assurance",
    "Fashion Designer",
    "Event Coordinator",
    "Customer Success",
    "Banking",
    "Healthcare Assistant",
    "Administrative Assistant",
    "Project Coordinator",
    "Data Analyst",
    "SEO Specialist",
    "Store Manager",
  ];

  const addJobType = (jobType: string) => {
    const normalized = jobType.trim();
    if (!normalized) return;
    if (selectedJobTypes.includes(normalized)) {
      return;
    }
    setSelectedJobTypes((prev) => [...prev, normalized]);
    setJobTypeQuery("");
  };

  const removeJobType = (jobType: string) => {
    setSelectedJobTypes((prev) => prev.filter((item) => item !== jobType));
  };

  const setCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          if (!response.ok) {
            throw new Error("Location lookup failed");
          }
          const result = await response.json();
          const locationName = result?.display_name || "";
          setProfileForm((prev) => ({ ...prev, location: locationName }));
          setLocationSuggestions([]);
          setShowLocationSuggestions(false);
        } catch (error) {
          setLocationError("Unable to resolve current location.");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        setLocationError(error.message || "Unable to get current location.");
        setIsLocationLoading(false);
      },
    );
  };

  const handleProfileSave = async () => {
    setProfileDialogMessage(null);
    setProfileDialogTone(null);
    setIsSavingProfile(true);
    try {
      const typedSkills = profileForm.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const profilePayload: any = {
        full_name: profileForm.name,
        job_title: profileForm.title,
        location: profileForm.location,
        gender: profileForm.gender || null,
        about_you: profileForm.summary,
        expected_salary: profileForm.salaryExpectation || null,
        notice_period_days: profileForm.noticePeriod ? Number(profileForm.noticePeriod) : null,
        preferred_job_types: selectedJobTypes.length > 0
          ? selectedJobTypes
          : profileForm.jobTypes.split(",").map((item) => item.trim()).filter(Boolean),
        preferred_locations: selectedLocationCities.length > 0
          ? selectedLocationCities
          : profileForm.locations.split(",").map((item) => item.trim()).filter(Boolean),
        remote_work: profileForm.remoteOk,
        skills: Array.from(new Set([...selectedSkills, ...typedSkills])),
        languages: profileForm.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (activeProfileSection === "experience") {
        const hasExperienceDetails = experienceDraft.job_title || experienceDraft.company_name || experienceDraft.job_role;

        if (hasExperienceDetails) {
          if (!experienceDraft.job_title.trim() || !experienceDraft.job_role.trim() || !experienceDraft.company_name.trim()) {
            setProfileDialogTone("error");
            setProfileDialogMessage("Job title, job role, and company name are required.");
            return;
          }

          if (experienceDraft.end_date && experienceDraft.currently_working_here) {
            setProfileDialogTone("error");
            setProfileDialogMessage("End date and current employment cannot be selected together.");
            return;
          }

          const normalizedExperience = {
            job_title: experienceDraft.job_title.trim(),
            job_role: experienceDraft.job_role.trim(),
            company_name: experienceDraft.company_name.trim(),
            start_date: experienceDraft.start_date,
            end_date: experienceDraft.end_date,
            currently_working_here: experienceDraft.currently_working_here,
          };

          if (editingExperienceIndex !== null) {
            const updatedExperience = [...workExperience];
            updatedExperience[editingExperienceIndex] = normalizedExperience;
            profilePayload.work_experience = updatedExperience;
          } else {
            profilePayload.work_experience = [...workExperience, normalizedExperience];
          }
        }
      }

      if (activeProfileSection === "education") {
        if (educationDraft.degree || educationDraft.institute || educationDraft.field_of_study || educationDraft.start_year || educationDraft.end_year) {
          if (educationDraft.start_year && educationDraft.end_year && Number(educationDraft.start_year) > Number(educationDraft.end_year)) {
            setProfileDialogTone("error");
            setProfileDialogMessage("Start year cannot be greater than end year.");
            return;
          }

          const normalizedEducation = {
            degree: educationDraft.degree.trim() || null,
            institute: educationDraft.institute.trim() || null,
            field_of_study: educationDraft.field_of_study.trim() || null,
            start_year: educationDraft.start_year,
            end_year: educationDraft.end_year,
          };

          if (editingEducationIndex !== null) {
            const updatedEducation = [...educationItems];
            updatedEducation[editingEducationIndex] = normalizedEducation;
            profilePayload.education = updatedEducation;
          } else {
            profilePayload.education = [...educationItems, normalizedEducation];
          }
        }
      }

      await completeProfile(profilePayload);
      await getEmployee();
      await getDashboard();
      setProfileDialogTone("success");
      setProfileDialogMessage("Profile saved successfully.");
      setProfileDialogOpen(false);
    } catch (err) {
      console.error(err);
      setProfileDialogTone("error");
      setProfileDialogMessage("Unable to save profile details. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleView = (jobId: string) => navigate(`/jobs/${jobId}`);
  const handleRemove = async (jobId: string) => {
    try {
      await unsaveJob(jobId);
    } catch (err) {
      console.error("unsave failed", err);
    }
  };

  const deleteWorkExperience = async (index: number) => {
    try {
      const updatedExperience = workExperience.filter((_: any, i: number) => i !== index);
      const profilePayload = {
        work_experience: updatedExperience,
      };
      await completeProfile(profilePayload);
      await getEmployee();
      await getDashboard();
    } catch (err) {
      console.error("Failed to delete work experience", err);
    }
  };

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    try {
      await uploadProfilePhoto(file);
      await getEmployee();
      await getDashboard();
    } catch (err) {
      console.error("Failed to upload profile photo", err);
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleRemoveProfilePhoto = async () => {
    try {
      await deleteProfilePhoto();
      await getEmployee();
      await getDashboard();
    } catch (err) {
      console.error("Failed to remove profile photo", err);
    }
  };

  const isValidPhoneForOtp = (phone: string) => /^\d{10}$/.test(phone.trim());

  const handleSendPhoneOtp = async () => {
    const cleanedPhone = newPhone.trim();
    if (!isValidPhoneForOtp(cleanedPhone)) {
      setPhoneChangeMessage("Please enter a valid 10-digit mobile number.");
      setPhoneChangeTone("error");
      return;
    }

    setPhoneChangeLoading(true);
    setPhoneChangeMessage(null);
    setPhoneChangeTone(null);

    try {
      await sendPhoneNoUpdateOtp(cleanedPhone);
      setPhoneStep("verify");
      setPhoneChangeMessage("OTP sent to your new phone number.");
      setPhoneChangeTone("success");
    } catch (error: any) {
      setPhoneChangeMessage(error?.message || "Unable to send OTP. Please try again.");
      setPhoneChangeTone("error");
    } finally {
      setPhoneChangeLoading(false);
    }
  };

  const handleVerifyPhoneChange = async () => {
    const cleanedPhone = newPhone.trim();
    const cleanedOtp = otpCode.trim();

    if (!cleanedPhone || !cleanedOtp) {
      setPhoneChangeMessage("Please enter the phone number and OTP.");
      setPhoneChangeTone("error");
      return;
    }

    setPhoneChangeLoading(true);
    setPhoneChangeMessage(null);
    setPhoneChangeTone(null);

    try {
      await verifyPhoneNoUpdate(cleanedPhone, cleanedOtp);
      await getEmployee();
      await getDashboard();
      setPhoneChangeMessage("Phone number updated successfully.");
      setPhoneChangeTone("success");
      setTimeout(() => {
        setShowPhoneChangeModal(false);
        setPhoneStep("request");
        setNewPhone("");
        setOtpCode("");
        setPhoneChangeMessage(null);
        setPhoneChangeTone(null);
      }, 1200);
    } catch (error: any) {
      setPhoneChangeMessage(error?.message || "Invalid OTP. Please try again.");
      setPhoneChangeTone("error");
    } finally {
      setPhoneChangeLoading(false);
    }
  };

  // Email validation and handlers (mirrors phone flow)
  const isValidEmailForOtp = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSendEmailOtp = async () => {
    const cleanedEmail = newEmail.trim();
    if (!isValidEmailForOtp(cleanedEmail)) {
      setEmailChangeMessage("Please enter a valid email address.");
      setEmailChangeTone("error");
      return;
    }

    setEmailChangeLoading(true);
    setEmailChangeMessage(null);
    setEmailChangeTone(null);

    try {
      await sendEmailUpdateOtp(cleanedEmail);
      setEmailStep("verify");
      setEmailChangeMessage("OTP sent to your email.");
      setEmailChangeTone("success");
    } catch (error: any) {
      setEmailChangeMessage(error?.message || "Unable to send OTP. Please try again.");
      setEmailChangeTone("error");
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    const cleanedEmail = newEmail.trim();
    const cleanedOtp = emailOtpCode.trim();

    if (!cleanedEmail || !cleanedOtp) {
      setEmailChangeMessage("Please enter the email and OTP.");
      setEmailChangeTone("error");
      return;
    }

    setEmailChangeLoading(true);
    setEmailChangeMessage(null);
    setEmailChangeTone(null);

    try {
      await verifyAndUpdateEmail(cleanedEmail, cleanedOtp);
      await getEmployee();
      await getDashboard();
      setEmailChangeMessage("Email updated successfully.");
      setEmailChangeTone("success");
      setTimeout(() => {
        setShowEmailChangeModal(false);
        setEmailStep("request");
        setNewEmail("");
        setEmailOtpCode("");
        setEmailChangeMessage(null);
        setEmailChangeTone(null);
      }, 1200);
    } catch (error: any) {
      setEmailChangeMessage(error?.message || "Invalid OTP. Please try again.");
      setEmailChangeTone("error");
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setResumeMessage("Only PDF resume files are allowed.");
        setResumeMessageTone("error");
        setResumeFile(null);
        setSelectedFileName("");
        return;
      }
      setResumeFile(file);
      setSelectedFileName(file.name);
      setResumeMessage(null);
      setResumeMessageTone(null);
      setResumeDownloadError(null);
    } else {
      setResumeFile(null);
      setSelectedFileName("");
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setResumeMessage("Select a PDF file to upload.");
      setResumeMessageTone("error");
      return;
    }
    setUploadingResume(true);
    setResumeMessage(null);
    setResumeMessageTone(null);
    try {
      await uploadResume(resumeFile);
      setResumeMessage("Resume uploaded successfully.");
      setResumeMessageTone("success");
      setSelectedFileName("");
      setResumeFile(null);
      setShowResumePreview(true);
      await Promise.all([getEmployee(), getDashboard()]);
    } catch (err) {
      setResumeMessage("Failed to upload resume. Please try again.");
      setResumeMessageTone("error");
      console.error(err);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeDownload = async () => {
    if (!employeeId) {
      setResumeDownloadError("Unable to determine your user ID for resume download.");
      return;
    }
    setDownloadingResume(true);
    setResumeDownloadError(null);
    try {
      const response = await downloadResume(employeeId);
      const blob = new Blob([response.data], { type: response.headers["content-type"] || "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-${employeeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setResumeDownloadError("Unable to download resume. Please try again.");
      console.error(err);
    } finally {
      setDownloadingResume(false);
    }
  };

  const timeAgo = (iso: string | null) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      const diff = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return "—";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {showPhoneChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Phone update</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{phoneStep === "request" ? "Change mobile number" : "Verify OTP"}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPhoneChangeModal(false);
                  setPhoneStep("request");
                  setNewPhone("");
                  setOtpCode("");
                  setPhoneChangeMessage(null);
                  setPhoneChangeTone(null);
                }}
                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close phone update modal"
              >
                <CircleX className="h-4 w-4" />
              </button>
            </div>

            {phoneStep === "request" ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">New phone number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    maxLength={10}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setNewPhone(digitsOnly);
                      if (phoneChangeMessage) {
                        setPhoneChangeMessage(null);
                        setPhoneChangeTone(null);
                      }
                    }}
                    placeholder="Enter new mobile number"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500"
                  />
                </div>
                {phoneChangeMessage && phoneChangeTone ? (
                  <p className={`text-sm ${phoneChangeTone === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                    {phoneChangeMessage}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  disabled={phoneChangeLoading || !isValidPhoneForOtp(newPhone)}
                  className="w-full rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {phoneChangeLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">OTP sent to {newPhone}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="Enter 4-digit OTP"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500"
                  />
                </div>
                {phoneChangeMessage && phoneChangeTone ? (
                  <p className={`text-sm ${phoneChangeTone === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                    {phoneChangeMessage}
                  </p>
                ) : null}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStep("request");
                      setOtpCode("");
                      setPhoneChangeMessage(null);
                      setPhoneChangeTone(null);
                    }}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyPhoneChange}
                    disabled={phoneChangeLoading}
                    className="flex-1 rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {phoneChangeLoading ? "Updating..." : "Verify & Update"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showEmailChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Email update</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{emailStep === "request" ? (profileEmail === "Not available" ? "Add email" : "Change email") : "Verify OTP"}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEmailChangeModal(false);
                  setEmailStep("request");
                  setNewEmail("");
                  setEmailOtpCode("");
                  setEmailChangeMessage(null);
                  setEmailChangeTone(null);
                }}
                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close email update modal"
              >
                <CircleX className="h-4 w-4" />
              </button>
            </div>

            {emailStep === "request" ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">New email address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if (emailChangeMessage) {
                        setEmailChangeMessage(null);
                        setEmailChangeTone(null);
                      }
                    }}
                    placeholder="Enter email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500"
                  />
                </div>
                {emailChangeMessage && emailChangeTone ? (
                  <p className={`text-sm ${emailChangeTone === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                    {emailChangeMessage}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={emailChangeLoading || !isValidEmailForOtp(newEmail)}
                  className="w-full rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {emailChangeLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">OTP sent to {newEmail}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={emailOtpCode}
                    onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter OTP"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500"
                  />
                </div>
                {emailChangeMessage && emailChangeTone ? (
                  <p className={`text-sm ${emailChangeTone === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                    {emailChangeMessage}
                  </p>
                ) : null}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailStep("request");
                      setEmailOtpCode("");
                      setEmailChangeMessage(null);
                      setEmailChangeTone(null);
                    }}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyEmailChange}
                    disabled={emailChangeLoading}
                    className="flex-1 rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {emailChangeLoading ? "Updating..." : "Verify & Update"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Sheet open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <SheetContent side="bottom" className="h-[85vh] max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card shadow-soft pb-6">
          <SheetHeader className="mb-4 border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-soft">
                    {activeProfileSection === "skills" ? <Bookmark className="h-5 w-5" /> : activeProfileSection === "experience" ? <CalendarDays className="h-5 w-5" /> : activeProfileSection === "education" ? <BookOpen className="h-5 w-5" /> : activeProfileSection === "preferences" ? <Settings2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </span>
                  <span>
                    {activeProfileSection === "skills"
                      ? "Choose your skills"
                      : activeProfileSection === "experience"
                      ? "Add work experience"
                      : activeProfileSection === "education"
                      ? educationItems.length > 0 ? "Edit education" : "Add education"
                      : activeProfileSection === "preferences"
                      ? "Update preferences"
                      : "Update basic details"}
                  </span>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription>
              {activeProfileSection === "skills"
                ? "Select from predefined skills or add your own."
                : activeProfileSection === "experience"
                ? "Add your latest work experience details."
                : activeProfileSection === "education"
                ? educationItems.length > 0 ? "Edit your education details." : "Add your latest education details."
                : activeProfileSection === "preferences"
                ? "Update salary, availability, and job preferences."
                : "Update your profile basics for better matches."}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 px-0">
            {(activeProfileSection === "profile" || activeProfileSection === "about") && (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Full name</label>
                  <Input
                    value={profileForm.name}
                    onChange={(event) => updateProfileForm("name", event.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Job title</label>
                    <Input
                      value={profileForm.title}
                      onChange={(event) => updateProfileForm("title", event.target.value)}
                      placeholder="e.g. Product Designer"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Location</label>
                    <div className="relative">
                      <Input
                        value={profileForm.location}
                        onChange={(event) => {
                          const value = event.target.value;
                          updateProfileForm("location", value);
                          setLocationError(null);
                          fetchLocationSuggestions(value);
                        }}
                        onFocus={() => {
                          if (locationSuggestions.length > 0) {
                            setShowLocationSuggestions(true);
                          }
                        }}
                        placeholder="Type to search for a city"
                      />
                      <button
                        type="button"
                        onClick={setCurrentLocation}
                        className="absolute right-2 top-2 inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                      >
                        {isLocationLoading ? "Locating..." : "Current"}
                      </button>
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-auto rounded-3xl border border-slate-200 bg-white shadow-soft">
                          {locationSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.value}
                              type="button"
                              onClick={() => selectLocationSuggestion(suggestion)}
                              className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                            >
                              {suggestion.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {locationError ? <p className="text-sm text-red-600">{locationError}</p> : null}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <Input
                      value={profileForm.phone}
                      disabled
                      className="bg-slate-100"
                      placeholder="Phone is not editable"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <Input
                      value={profileForm.email}
                      disabled
                      className="bg-slate-100"
                      placeholder="Email is not editable"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Gender</label>
                  <div className="relative">
                    <select
                      value={profileForm.gender}
                      onChange={(event) => updateProfileForm("gender", event.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-sky-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">▾</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">About you</label>
                  <Textarea
                    value={profileForm.summary}
                    onChange={(event) => updateProfileForm("summary", event.target.value)}
                    placeholder="Write a short summary about your experience"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Languages</label>
                  <Input
                    value={profileForm.languages}
                    onChange={(event) => updateProfileForm("languages", event.target.value)}
                    placeholder="e.g. English, Hindi"
                  />
                </div>
              </>
            )}

            {activeProfileSection === "preferences" && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Salary expectation</label>
                    <Input
                      value={profileForm.salaryExpectation}
                      onChange={(event) => updateProfileForm("salaryExpectation", event.target.value)}
                      placeholder="e.g. ₹25,000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Notice period (days)</label>
                    <Input
                      type="number"
                      value={profileForm.noticePeriod}
                      onChange={(event) => updateProfileForm("noticePeriod", event.target.value)}
                      placeholder="e.g. 30"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Preferred job types</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobTypes.map((jobType) => (
                        <span key={jobType} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {jobType}
                          <button
                            type="button"
                            onClick={() => removeJobType(jobType)}
                            className="rounded-full bg-slate-200 px-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        value={jobTypeQuery}
                        onChange={(event) => {
                          const query = event.target.value;
                          setJobTypeQuery(query);
                          setShowJobTypeSuggestions(Boolean(query.trim()));
                        }}
                        onFocus={() => {
                          if (jobTypeQuery.trim()) {
                            setShowJobTypeSuggestions(true);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addJobType(jobTypeQuery);
                          }
                        }}
                        placeholder="Search or add a job type"
                      />
                      {showJobTypeSuggestions && (
                        <div className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-auto rounded-3xl border border-slate-200 bg-white shadow-soft">
                          {jobTypeSuggestionList
                            .filter((item) => item.toLowerCase().includes(jobTypeQuery.toLowerCase()) && !selectedJobTypes.includes(item))
                            .slice(0, 8)
                            .map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                  addJobType(suggestion);
                                  setShowJobTypeSuggestions(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                              >
                                {suggestion}
                              </button>
                            ))}
                          {jobTypeSuggestionList.filter((item) => item.toLowerCase().includes(jobTypeQuery.toLowerCase()) && !selectedJobTypes.includes(item)).length === 0 && (
                            <p className="px-4 py-3 text-sm text-slate-500">No matching job types</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Preferred locations</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocationCities.map((city) => (
                        <span key={city} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {city}
                          <button
                            type="button"
                            onClick={() => removeLocationCity(city)}
                            className="rounded-full bg-slate-200 px-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        value={locationQuery}
                        onChange={(event) => fetchLocationSuggestions(event.target.value)}
                        onFocus={() => {
                          if (locationSuggestions.length > 0) {
                            setShowLocationSuggestions(true);
                          }
                        }}
                        placeholder="Search Indian cities"
                      />
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-auto rounded-3xl border border-slate-200 bg-white shadow-soft">
                          {locationSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.value}
                              type="button"
                              onClick={() => addLocationCity(suggestion.value)}
                              className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                            >
                              {suggestion.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">Select between 1 and 5 Indian cities; only city names are shown.</p>
                    {locationError ? <p className="text-sm text-red-600">{locationError}</p> : null}
                  </div>
                </div>
                <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={profileForm.remoteOk}
                    onChange={(event) => updateProfileForm("remoteOk", event.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  Remote Work
                </label>
              </>
            )}

            {activeProfileSection === "skills" && (
              <>
                <div className="grid gap-2">
                  <p className="text-sm font-medium text-slate-700">Select your skills</p>
                  {skillGroups.map((group) => (
                    <div key={group.label} className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((skill) => {
                          const selected = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => {
                                setSelectedSkills((prev) => {
                                  if (skill === "None of these") {
                                    return prev.includes(skill) ? [] : [skill];
                                  }
                                  const filtered = prev.filter((item) => item !== "None of these");
                                  return filtered.includes(skill)
                                    ? filtered.filter((item) => item !== skill)
                                    : [...filtered, skill];
                                });
                              }}
                              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                                selected
                                  ? "border-sky-500 bg-sky-500 text-white"
                                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                              }`}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Other skills</label>
                  <Input
                    value={profileForm.skills}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      updateProfileForm("skills", nextValue);

                      const nextCustomSkills = splitSkillsText(nextValue).filter((skill) => !presetSkillSet.has(skill));
                      setSelectedSkills((prev) => {
                        const protectedSkills = prev.filter((skill) => presetSkillSet.has(skill) || skill === "None of these");
                        return Array.from(new Set([...protectedSkills, ...nextCustomSkills]));
                      });
                    }}
                    placeholder="e.g. communication, teamwork"
                  />
                  {otherSkillItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {otherSkillItems.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => removeOtherSkill(skill)}
                          className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                        >
                          {skill}
                          <span aria-hidden="true">×</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeProfileSection === "experience" && (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Job Title *</label>
                  <Input
                    value={experienceDraft.job_title}
                    onChange={(event) => setExperienceDraft((prev) => ({ ...prev, job_title: event.target.value }))}
                    placeholder="e.g. Backend Developer"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Job Role *</label>
                  <Input
                    value={experienceDraft.job_role}
                    onChange={(event) => setExperienceDraft((prev) => ({ ...prev, job_role: event.target.value }))}
                    placeholder="e.g. Full stack engineer"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Company Name *</label>
                  <Input
                    value={experienceDraft.company_name}
                    onChange={(event) => setExperienceDraft((prev) => ({ ...prev, company_name: event.target.value }))}
                    placeholder="e.g. Tech Corp"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Start date</label>
                  <Input
                    type="date"
                    value={experienceDraft.start_date ?? ""}
                    onChange={(event) => setExperienceDraft((prev) => ({ ...prev, start_date: event.target.value || null }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">End date</label>
                  <Input
                    type="date"
                    value={experienceDraft.end_date ?? ""}
                    onChange={(event) => {
                      const nextValue = event.target.value || null;
                      setExperienceDraft((prev) => ({
                        ...prev,
                        end_date: nextValue,
                        currently_working_here: nextValue ? false : prev.currently_working_here,
                      }));
                    }}
                  />
                </div>
                <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={experienceDraft.currently_working_here}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setExperienceDraft((prev) => ({
                        ...prev,
                        currently_working_here: checked,
                        end_date: checked ? null : prev.end_date,
                      }));
                    }}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  I am currently working here
                </label>
                {experienceDraft.end_date && experienceDraft.currently_working_here && (
                  <p className="text-sm text-red-600">End date and current employment cannot be selected together.</p>
                )}
              </>
            )}

            {activeProfileSection === "education" && (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Degree / Education Level</label>
                  <Input
                    value={educationDraft.degree}
                    onChange={(event) => setEducationDraft((prev) => ({ ...prev, degree: event.target.value }))}
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Institute / School</label>
                  <Input
                    value={educationDraft.institute}
                    onChange={(event) => setEducationDraft((prev) => ({ ...prev, institute: event.target.value }))}
                    placeholder="e.g. ABC University"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Field of study</label>
                  <Input
                    value={educationDraft.field_of_study}
                    onChange={(event) => setEducationDraft((prev) => ({ ...prev, field_of_study: event.target.value }))}
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Start year</label>
                  <select
                    value={educationDraft.start_year ?? ""}
                    onChange={(event) => setEducationDraft((prev) => ({ ...prev, start_year: event.target.value ? Number(event.target.value) : null }))}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select year</option>
                    {educationYearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">End year</label>
                  <select
                    value={educationDraft.end_year ?? ""}
                    onChange={(event) => setEducationDraft((prev) => ({ ...prev, end_year: event.target.value ? Number(event.target.value) : null }))}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select year</option>
                    {educationYearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {profileDialogMessage ? (
              <p className={`text-sm ${profileDialogTone === "success" ? "text-emerald-600" : "text-red-600"}`}>
                {profileDialogMessage}
              </p>
            ) : null}

            <SheetFooter className="mt-6 gap-2 sm:flex">
              <Button variant="secondary" type="button" onClick={() => setProfileDialogOpen(false)}>
                <CircleX className="h-4 w-4" /> Cancel
              </Button>
              <Button
                type="button"
                onClick={handleProfileSave}
                disabled={isSavingProfile}
                className="bg-gradient-primary text-white shadow-soft hover:shadow-glow"
              >
                <CheckCircle2 className="h-4 w-4" /> {isSavingProfile ? "Saving..." : "Save changes"}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your profile, resume, applications, saved jobs, and interviews in one place.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-3xl bg-slate-50 px-5 py-4 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
                  <Bookmark className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Saved jobs</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{jobs.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl bg-slate-50 px-5 py-4 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Applications</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{applications.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl bg-slate-50 px-5 py-4 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Interviews</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{interviews.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full mb-4 grid grid-cols-2 gap-2 sm:mb-0 sm:grid-cols-5">
              <TabsTrigger value="profile">
                <User className="h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="resume">
                <FileText className="h-4 w-4" /> Resume
              </TabsTrigger>
              <TabsTrigger value="applications">
                <Briefcase className="h-4 w-4" /> Applications
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Bookmark className="h-4 w-4" /> Saved
              </TabsTrigger>
              <TabsTrigger value="interviews">
                <Clock className="h-4 w-4" /> Interviews
              </TabsTrigger>
            </TabsList>
          <TabsContent value="profile" className="rounded-3xl bg-white p-0 shadow-sm mt-25 sm:mt-6">
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <div className="overflow-hidden rounded-[2rem] shadow-[0_25px_50px_-30px_rgba(15,23,42,0.35)]">
                <div className="bg-gradient-primary px-6 py-7 text-white">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-500 to-slate-700 text-3xl font-bold shadow-xl">
                        {profileAvatar ? (
                          <img src={profileAvatar} alt={profileName} className="h-full w-full rounded-[1.5rem] object-cover" />
                        ) : (
                          profileName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <input
                        ref={profilePhotoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoUpload}
                      />
                      <button
                        type="button"
                        onClick={() => profilePhotoInputRef.current?.click()}
                        className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-900 shadow-md"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {profileAvatar && (
                        <button
                          type="button"
                          onClick={handleRemoveProfilePhoto}
                          className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-rose-500 text-white shadow-md"
                          aria-label="Remove profile photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.28em] text-white-500">Job Hero</p>
                      <h2 className="mt-2 text-3xl font-semibold leading-tight">{profileName}</h2>
                      <p className="mt-3 text-sm text-slate-300">{profileTitle}</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4 text-sm text-slate-200">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4" />
                      <span>{profileLocation}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4" />
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{profilePhone}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewPhone("");
                            setOtpCode("");
                            setPhoneStep("request");
                            setPhoneChangeMessage(null);
                            setPhoneChangeTone(null);
                            setShowPhoneChangeModal(true);
                          }}
                          className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/35 transition hover:bg-white/20"
                        >
                          Change
                        </button>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${phoneVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {phoneVerified ? "Verified" : "Not verified"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{profileEmail}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewEmail("");
                            setEmailOtpCode("");
                            setEmailStep("request");
                            setEmailChangeMessage(null);
                            setEmailChangeTone(null);
                            setShowEmailChangeModal(true);
                          }}
                          className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/35 transition hover:bg-white/20"
                        >
                          {profileEmail === "Not available" ? "Add" : "Change"}
                        </button>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${emailVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {emailVerified ? "Verified" : "Not verified"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span>{profileGender === "Not specified" ? "Gender not added" : profileGender}</span>
                    </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={profileForm.isAvailable}
                            onCheckedChange={async (checked) => {
                              try {
                                await updateAvailability(checked);
                                updateProfileForm("isAvailable", checked);
                              } catch (error) {
                                console.error("Failed to update availability", error);
                                updateProfileForm("isAvailable", !checked);
                              }
                            }}
                            aria-label="Availability toggle"
                          />
                          <div>
                            <p className="text-sm text-white">
                              {profileForm.isAvailable ? "Available" : "Not available"}
                            </p>
                          </div>
                        </div>
                      
                    </div>
                  </div>
                </div>
                <div className="bg-white px-6 py-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Profile completion</p>
                      <p className="mt-1 text-3xl font-semibold text-slate-900">{profileCompletion}%</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openProfileEditor("profile")}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-300/40"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </button>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500" style={{ width: `${profileCompletion}%` }} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-amber-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Your hiring chances will improve</p>
                      <p className="mt-2 text-sm text-slate-700">Just add these missing details to stand out faster.</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm">
                      <CheckCircle2 className="h-4 w-4" /> Suggested
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {missingProfileItems.length > 0 ? (
                      missingProfileItems.slice(0, 4).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            // Map suggestion labels to profile editor sections
                            const lower = item.toLowerCase();
                            if (lower.includes("profile summary")) {
                              openProfileEditor("about");
                            } else if (lower.includes("work experience")) {
                              openProfileEditor("experience");
                            } else if (lower.includes("education")) {
                              openProfileEditor("education");
                            } else if (lower.includes("skills")) {
                              openProfileEditor("skills");
                            } else if (lower.includes("salary")) {
                              openProfileEditor("preferences");
                            } else if (lower.includes("availability")) {
                              openProfileEditor("availability");
                            } else if (lower.includes("job types") || lower.includes("preferred job types") || lower.includes("locations")) {
                              openProfileEditor("preferences");
                            } else if (lower.includes("resume") || lower.includes("portfolio")) {
                              // resume upload sits in the Resume tab — navigate user to resume tab
                              // open profile sheet as a fallback
                              // prefer navigating to the resume tab if desired
                              openProfileEditor("profile");
                            } else {
                              openProfileEditor("profile");
                            }
                          }}
                          className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white transition hover:shadow-sm"
                        >
                          + {item.replace(/^Add /, "")}
                        </button>
                      ))
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">Profile complete</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">Salary expectation</p>
                      <button
                        type="button"
                        onClick={() => openProfileEditor("preferences")}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-300/40"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                    </div>
                    <p className="mt-3 font-semibold text-slate-900">{salaryExpectation}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">Preferred job types</p>
                      <button
                        type="button"
                        onClick={() => openProfileEditor("preferences")}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-300/40"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.isArray(preferences.job_types) && preferences.job_types.length > 0 ? (
                        preferences.job_types.map((jobType: string) => (
                          <span key={jobType} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                            {jobType}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Not specified</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">Preferred locations</p>
                      <button
                        type="button"
                        onClick={() => openProfileEditor("preferences")}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-300/40"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.isArray(preferences.locations) && preferences.locations.length > 0 ? (
                        preferences.locations.map((location: string) => (
                          <span key={location} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                            {location}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Not specified</p>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Remote Work: {profileRemoteOk}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">About you</p>
                    <button
                      type="button"
                      onClick={() => openProfileEditor("about")}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-300/40"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{profileSummary}</p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">Skills</p>
                    <button
                      type="button"
                      onClick={() => openProfileEditor("skills")}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-300/40"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profileSkills.length > 0 ? (
                      profileSkills.map((skill: string, index: number) => (
                        <span key={`${skill}-${index}`} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">Work experience</p>
                    <button
                      type="button"
                      onClick={() => openProfileEditor("experience")}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-300/40 hover:opacity-95"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                  {workExperience.length > 0 ? (
                    <div className="mt-3 space-y-4">
                      {workExperience.map((item: any, index: number) => (
                        <div key={index} className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              {item.job_title && (
                                <p className="font-semibold text-slate-900">{item.job_title}</p>
                              )}
                              {item.job_role && (
                                <p className="text-sm text-slate-600 mt-1">{item.job_role}</p>
                              )}
                              {item.company_name && (
                                <p className="mt-2 text-sm text-slate-600">{item.company_name}</p>
                              )}
                              {(item.start_date || item.end_date || item.currently_working_here) && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {item.start_date ? formatDisplayDate(item.start_date) : "Unknown start"}
                                  {item.end_date
                                    ? ` - ${formatDisplayDate(item.end_date)}`
                                    : item.currently_working_here
                                      ? " - Present"
                                      : ""}
                                  {item.currently_working_here && !item.end_date ? " • Currently working here" : ""}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openProfileEditor("experience", index)}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                              >
                                <Edit3 className="h-3 w-3" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteWorkExperience(index)}
                                className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                              >
                                <CircleX className="h-3 w-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">No work experience added yet.</p>
                  )}
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">Education</p>
                    <button
                      type="button"
                      onClick={() => openProfileEditor("education", undefined, educationItems.length > 0 ? 0 : undefined)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-300/40"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> {educationItems.length > 0 ? "Edit" : "Add"}
                    </button>
                  </div>
                  {educationItems.length > 0 ? (
                    <div className="mt-3">
                      {/* Show only the first education record as single data */}
                      {educationItems[0] && (
                        <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                          {educationItems[0].degree && (
                            <p className="font-semibold text-slate-900">{educationItems[0].degree}</p>
                          )}
                          {educationItems[0].institute && (
                            <p className="mt-2 text-sm text-slate-600">{educationItems[0].institute}</p>
                          )}
                          {educationItems[0].field_of_study && (
                            <p className="mt-2 text-sm text-slate-600">{educationItems[0].field_of_study}</p>
                          )}
                          {(educationItems[0].start_year || educationItems[0].end_year) && (
                            <p className="mt-1 text-xs text-slate-500">
                              {educationItems[0].start_year ?? ""}
                              {educationItems[0].start_year && educationItems[0].end_year ? " - " : ""}
                              {educationItems[0].end_year ?? ""}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">No education details added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resume" className="rounded-[2rem] bg-white p-0 shadow-sm mt-25 sm:mt-6">
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 shadow-[0_18px_40px_-30px_rgba(14,116,144,0.45)]">
                <div className="flex items-center gap-3 text-slate-900">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-white shadow-soft">
                    <Upload className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-semibold">Resume</h2>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-600">
                  Upload your latest resume so employers can review your full profile, experience, and skills with confidence.
                </p>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">
                    {resumeUrl ? "Resume uploaded" : "No resume yet"}
                  </p>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{resumeUrl ? "Current resume" : "Resume preview"}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {resumeUrl
                          ? "Your resume is uploaded and ready for employers to review or download."
                          : "No resume uploaded yet. Use the generate option or upload a PDF to get started."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeUrl ? (
                        <button
                          type="button"
                          onClick={() => setShowResumePreview((prev) => !prev)}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
                        >
                          <FileText className="h-4 w-4" /> {showResumePreview ? "Hide preview" : "Preview resume"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResumeDownload}
                          disabled={downloadingResume}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FileText className="h-4 w-4" /> {downloadingResume ? "Preparing..." : "Generate"}
                        </button>
                      )}
                    </div>
                  </div>

                  {showResumePreview && resumeUrl ? (
                    <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                        <span className="text-sm font-medium text-slate-700">Resume preview</span>
                        <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                          Open in new tab
                        </a>
                      </div>
                      <iframe
                        src={resumeUrl}
                        title="Resume preview"
                        className="h-[620px] w-full bg-white"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  {!resumeUrl ? (
                    <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <p className="text-base font-semibold text-slate-800">No resume found</p>
                      <p className="mt-2 text-sm text-slate-600">Upload a PDF or generate one from the server to make your profile stand out.</p>
                    </div>
                  ) : null}

                  {resumeDownloadError ? <p className="mt-4 text-sm text-rose-600">{resumeDownloadError}</p> : null}
                </div>

                {documents.length > 0 ? (
                  <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">Additional documents</p>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        {documents.length}
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {documents.map((doc: any, index: number) => {
                        const documentName = doc.name ?? doc.file_name ?? doc.title ?? `Document ${index + 1}`;
                        const documentUrl = doc.url ?? doc.file_url ?? doc.link ?? null;
                        return (
                          <div key={`${documentName}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">{documentName}</p>
                            </div>
                            {documentUrl ? (
                              <a href={documentUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                                View
                              </a>
                            ) : (
                              <span className="text-xs text-slate-500">No link</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Upload new resume</p>
                      <p className="text-sm text-slate-600">Choose a PDF file to attach to your candidate profile.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label
                        htmlFor="resume-file-input"
                        className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                      >
                        Choose PDF
                      </label>
                      <span className="text-sm text-slate-600">{selectedFileName || "No file selected"}</span>
                      <input
                        id="resume-file-input"
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeChange}
                        className="sr-only"
                      />
                    </div>
                  </div>

                  {resumeMessage ? (
                    <p className={`mt-4 text-sm ${resumeMessageTone === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                      {resumeMessage}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleResumeUpload}
                    disabled={uploadingResume}
                    className={`mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 ${uploadingResume ? "animate-pulse" : ""}`}
                  >
                    <ArrowRight className={`h-4 w-4 ${uploadingResume ? "animate-spin" : ""}`} />
                    {uploadingResume ? "Uploading..." : "Upload resume"}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="rounded-3xl bg-white p-6 shadow-sm mt-25 sm:mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Applications</h2>
                <p className="mt-1 text-sm text-muted-foreground">Track sent applications and their current status.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Briefcase className="h-4 w-4" /> {applications.length} Applications
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-600 shadow-sm">
                <p className="text-base font-semibold">No applications yet</p>
                <p className="mt-2 text-sm">Apply to jobs from the Jobs page to see them listed here.</p>
                <Link to="/jobs" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-soft hover:shadow-glow">
                  <ArrowRight className="h-4 w-4" /> Browse jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application: any, index: number) => {
                  const title = application.job_title ?? application.title ?? application.position ?? "Untitled role";
                  const company = application.company_name ?? application.company ?? application.employer_name ?? "Company";
                  const rawStatus = application.status ?? application.application_status ?? "Pending";
                  const status = rawStatus ? `${String(rawStatus).charAt(0).toUpperCase()}${String(rawStatus).slice(1)}` : "Pending";
                  const appliedAt = application.applied_at ?? application.created_at ?? application.date ?? null;
                  const interviewDate = application.interview_date ?? application.scheduled_at ?? null;
                  const statusTheme = status?.toLowerCase().includes("accepted") || status?.toLowerCase().includes("offer")
                    ? "bg-emerald-100 text-emerald-700"
                    : status?.toLowerCase().includes("rejected")
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-700";

                  return (
                    <div key={`${application.id ?? application._id ?? application.job_id ?? index}`} className="rounded-3xl bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-primary text-white shadow-soft">
                            {application.logo ? (
                              <img src={application.logo} alt={company} className="h-14 w-14 rounded-2xl object-cover shadow-soft" />
                            ) : (
                              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-white text-lg font-bold shadow-soft">{(company?.[0] ?? "C").toUpperCase()}</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-lg font-semibold text-slate-900 truncate">{title}</p>
                            <p className="mt-1 text-sm text-muted-foreground truncate">{company}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                                <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                                {application.location ?? application.job_city ?? "Remote"}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                                <Clock className="h-3.5 w-3.5 text-sky-500" />
                                {application.total_experience_required ?? application.experience ?? "Any"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTheme}`}>{status}</span>
                          {interviewDate ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Interview scheduled</span> : null}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Applied {timeAgo(appliedAt)}</span>
                        {interviewDate ? <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Interview {new Date(interviewDate).toLocaleDateString()}</span> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="rounded-3xl bg-white p-6 shadow-sm mt-25 sm:mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Saved jobs</h2>
                <p className="mt-1 text-sm text-muted-foreground">All the roles you bookmarked for later review.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{jobs.length} saved</div>
            </div>

            <div className="space-y-3">
              {jobs.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-600 shadow-sm">
                  <p className="text-base font-semibold">No saved jobs yet</p>
                  <p className="mt-2 text-sm">Save roles from the Jobs page to see them here.</p>
                  <Link to="/jobs" className="mt-4 inline-flex rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white">Browse jobs</Link>
                </div>
              ) : (
                jobs.map((job: any) => {
                  const jobId = String(job.id ?? job.job_id ?? job._id ?? "");
                  const logo = job.company_logo ?? job.logo_url ?? job.logo ?? job.company?.logo ?? null;
                  const company = job.company_name ?? job.company ?? job.employer_name ?? "Company";
                  const title = job.job_title ?? job.title ?? "Untitled Role";
                  const location = job.location ?? job.city ?? job.job_city ?? "Location";
                  const salary = job.expected_salary ?? job.salary ?? job.salary_range ?? (job.min_fixed_salary && job.max_fixed_salary ? `₹${Number(job.min_fixed_salary).toLocaleString()} - ₹${Number(job.max_fixed_salary).toLocaleString()}` : "Salary on request");
                  const jobType = job.job_type ?? "Full-time";
                  const experience = job.total_experience_required ?? job.experience ?? "Any";
                  const applicants = job.applicants_count ?? job.applicants?.length ?? 0;
                  const createdAt = job.created_at ?? null;

                  return (
                    <div key={jobId} className="group relative rounded-3xl bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 sm:px-6 sm:py-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          {logo ? (
                            <img src={logo} alt={company} className="h-14 w-14 rounded-2xl object-cover shadow-soft" />
                          ) : (
                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-white text-lg font-bold shadow-soft">{(company?.[0] ?? "C").toUpperCase()}</div>
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-lg font-semibold text-slate-900 truncate">{title}</p>
                              <span className="rounded-full bg-gradient-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">{jobType}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground truncate">{company} · {location}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">{salary}</span>
                              <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">{experience}</span>
                              <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">{applicants} applicants</span>
                            </div>
                            {createdAt ? (
                              <p className="mt-3 text-xs text-slate-500">Posted {timeAgo(createdAt)}</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <button onClick={() => handleView(jobId)} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow">
                            <ArrowRight className="h-4 w-4" /> View
                          </button>
                          <button onClick={() => handleRemove(jobId)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                            <CircleX className="h-4 w-4" /> Remove
                            
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="rounded-3xl bg-white p-6 shadow-sm mt-25 sm:mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Interviews</h2>
                <p className="mt-1 text-sm text-muted-foreground">View any scheduled or upcoming interview details.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{interviews.length} upcoming</div>
            </div>

            {interviews.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-600 shadow-sm">
                {/* <p className="text-base font-semibold">No upcoming interviews</p> */}
                                <p className="text-base font-bold text-lg">Coming Soon</p>

                {/* <p className="mt-2 text-sm">Once you apply, interview schedules will appear here.</p> */}
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview: any, index: number) => {
                  const company = interview.company_name ?? interview.company ?? interview.employer_name ?? "Company";
                  const title = interview.job_title ?? interview.title ?? interview.position ?? "Interview";
                  const date = interview.interview_date ?? interview.scheduled_at ?? interview.date ?? null;
                  const mode = interview.mode ?? interview.interview_mode ?? "Online";
                  const location = interview.location ?? interview.city ?? "To be confirmed";
                  const meetingLink = interview.meeting_link ?? interview.conference_link ?? interview.link ?? null;
                  const status = interview.status ?? interview.stage ?? "Scheduled";

                  return (
                    <div key={`${interview.id ?? interview._id ?? index}`} className="rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:-translate-y-0.5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{company}</p>
                        </div>
                        <div className="space-y-1 text-right text-sm text-slate-600">
                          <p>{status}</p>
                          <p>{date ? new Date(date).toLocaleString() : "Date not set"}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                        <span>{mode}</span>
                        <span>{location}</span>
                        {meetingLink ? (
                          <a href={meetingLink} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                            Join meeting
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
