import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  Facebook,
  Globe,
  ImageUp,
  Instagram,
  Linkedin,
  MapPin,
  Pencil,
  Save,
  Send,
  Users,
  X,
} from "lucide-react";
import useEmployerStore from "@/store/employerStore";

const SOCIAL_KEYS = ["facebook", "instagram", "linkedin", "telegram"] as const;

type SocialMap = Record<(typeof SOCIAL_KEYS)[number], string>;

const emptySocials = (): SocialMap => ({
  facebook: "",
  instagram: "",
  linkedin: "",
  telegram: "",
});

const normalizeSocialProfiles = (socialProfiles: Record<string, any> | null | undefined): SocialMap => {
  const result = emptySocials();
  if (!socialProfiles || typeof socialProfiles !== "object") return result;

  const keyedEntries = Object.entries(socialProfiles)
    .map(([key, value]) => [key.trim().toLowerCase(), value])
    .filter((entry): entry is [string, any] => Boolean(entry[0]));

  const keyIndexMap: Record<string, keyof SocialMap> = {
    facebook: "facebook",
    instagram: "instagram",
    linkedin: "linkedin",
    telegram: "telegram",
    key_0: "facebook",
    key_1: "instagram",
    key_2: "linkedin",
    key_3: "telegram",
  };

  keyedEntries.forEach(([key, value]) => {
    const mappedKey = keyIndexMap[key];
    if (!mappedKey) return;

    const safeValue = value == null ? "" : String(value).trim();
    if (safeValue) {
      result[mappedKey] = safeValue;
    }
  });

  return result;
};

const socialLinkLabel: Record<keyof SocialMap, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  telegram: "Telegram",
};

const socialIconMap: Record<keyof SocialMap, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  telegram: Send,
};

export default function EmployerCompanyProfile() {
  const {
    employer,
    companyProfile,
    getEmployer,
    getDashboard,
    getEmployerCompanyProfile,
    updateEmployerProfile,
    isLoading,
  } = useEmployerStore();

  const [editing, setEditing] = useState(false);
  const [logoFileName, setLogoFileName] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    logo_url: "",
    founded_year: "",
    website: "",
    company_size: "",
    company_type: "",
    industry: "",
    address: "",
    description: "",
    ...emptySocials(),
  });

  useEffect(() => {
    getEmployer().catch(() => {});
    getDashboard().catch(() => {});
    getEmployerCompanyProfile().catch(() => {});
  }, [getEmployer, getDashboard, getEmployerCompanyProfile]);

  useEffect(() => {
    if (companyProfile || employer) {
      const profile = companyProfile ?? {};
      const socials = normalizeSocialProfiles(profile.social_profiles ?? {});
      setFormData({
        company_name: profile.company_name ?? employer?.company_name ?? "",
        logo_url: profile.logo_url ?? "",
        founded_year: profile.founded_year ?? "",
        website: profile.website ?? "",
        company_size: profile.company_size ?? "",
        company_type: profile.company_type ?? "",
        industry: profile.industry ?? "",
        address: profile.address ?? "",
        description: profile.description ?? "",
        facebook: socials.facebook,
        instagram: socials.instagram,
        linkedin: socials.linkedin,
        telegram: socials.telegram,
      });
    }
  }, [companyProfile, employer]);

  const companyName = companyProfile?.company_name ?? employer?.company_name ?? "Not available";
  const companyLogo = companyProfile?.logo_url ?? "";
  const foundedYear = companyProfile?.founded_year ?? "Not available";
  const website = companyProfile?.website ?? "Not available";
  const companySize = companyProfile?.company_size ?? "Not available";
  const companyType = companyProfile?.company_type ?? "Not available";
  const industry = companyProfile?.industry ?? "Not available";
  const description = companyProfile?.description ?? "Please update this information with your actual company details.";
  const address = companyProfile?.address ?? "Not available";

  const socialProfiles = useMemo(() => normalizeSocialProfiles(companyProfile?.social_profiles ?? {}), [companyProfile]);

  const fields = [
    { label: "Company name", value: companyName, icon: Building2 },
    { label: "Founded", value: foundedYear, icon: CalendarDays },
    { label: "Website", value: website, icon: Globe },
    { label: "Company size", value: companySize, icon: Users },
    { label: "Type of company", value: companyType, icon: BriefcaseBusiness },
    { label: "Industry", value: industry, icon: Building2 },
    { label: "Address", value: address, icon: MapPin },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setFormData((prev) => ({ ...prev, logo_url: result }));
    };
    reader.readAsDataURL(selectedFile);
    setLogoFileName(selectedFile.name);
  };

  const handleCancel = () => {
    if (companyProfile || employer) {
      const profile = companyProfile ?? {};
      const socials = normalizeSocialProfiles(profile.social_profiles ?? {});
      setFormData({
        company_name: profile.company_name ?? employer?.company_name ?? "",
        logo_url: profile.logo_url ?? "",
        founded_year: profile.founded_year ?? "",
        website: profile.website ?? "",
        company_size: profile.company_size ?? "",
        company_type: profile.company_type ?? "",
        industry: profile.industry ?? "",
        address: profile.address ?? "",
        description: profile.description ?? "",
        facebook: socials.facebook,
        instagram: socials.instagram,
        linkedin: socials.linkedin,
        telegram: socials.telegram,
      });
      setLogoFileName("");
    }
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const companyAddress = formData.address || null;

      await updateEmployerProfile({
        company_name: formData.company_name || null,
        logo_url: formData.logo_url || null,
        founded_year: formData.founded_year || null,
        website: formData.website || null,
        company_size: formData.company_size || null,
        company_type: formData.company_type || null,
        industry: formData.industry || null,
        address: companyAddress,
        company_address: companyAddress,
        description: formData.description || null,
        social_profiles: {
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          linkedin: formData.linkedin || null,
          telegram: formData.telegram || null,
        },
      });
      await getEmployerCompanyProfile();
      await getDashboard();
      setEditing(false);
      setLogoFileName("");
    } catch (error) {
      console.error("Failed to update company profile", error);
    }
  };

  if (isLoading && !companyProfile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Employer dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Company profile</h1>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          <span>Please share company information to improve job seekers trust.</span>
          <button type="button" className="font-semibold underline">
            Update 8 information
          </button>
        </div>

        {editing ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <ImageUp className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Basic details</h2>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      {formData.logo_url ? (
                        <img src={formData.logo_url} alt={formData.company_name || "Company logo"} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-soft">
                        <ImageUp className="h-4 w-4" />
                        Upload logo
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                      <p className="mt-2 text-xs text-slate-500">{logoFileName || "Choose an image from your device"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Founded</label>
                    <input
                      type="text"
                      name="founded_year"
                      value={formData.founded_year}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company size</label>
                    <input
                      type="text"
                      name="company_size"
                      value={formData.company_size}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Type of company</label>
                    <input
                      type="text"
                      name="company_type"
                      value={formData.company_type}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">About company</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    rows={4}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Social profiles</h2>
              </div>

              <div className="grid gap-4">
                {SOCIAL_KEYS.map((key) => {
                  const Icon = socialIconMap[key];
                  return (
                    <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <div className="rounded-lg bg-white p-2 shadow-sm">
                          <Icon className="h-4 w-4" />
                        </div>
                        {socialLinkLabel[key]}
                      </div>
                      <input
                        type="url"
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400"
                        placeholder={`https://${key}.com/your-page`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-gradient-primary text-xl font-bold text-white shadow-soft">
                    {companyLogo ? (
                      <img src={companyLogo} alt={companyName} className="h-full w-full object-cover" />
                    ) : (
                      companyName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Company logo</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">{companyName}</h2>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {fields.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <p className={`text-sm ${value && value !== "Not available" ? "text-slate-900" : "text-slate-400"}`}>
                      {value || "Not available"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">About company</p>
                <p className="text-sm leading-6 text-slate-700">{description}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Social profiles</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {SOCIAL_KEYS.map((key) => {
                  const value = socialProfiles[key];
                  const Icon = socialIconMap[key];
                  if (!value) return null;

                  return (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm transition hover:border-sky-200 hover:bg-sky-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-2 shadow-sm">
                          <Icon className="h-4 w-4 text-slate-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{socialLinkLabel[key]}</p>
                          <p className="max-w-[220px] truncate text-xs text-slate-500">{value}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-sky-600" />
                    </a>
                  );
                })}

                {SOCIAL_KEYS.every((key) => !socialProfiles[key]) && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-400">
                    No social profiles added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
