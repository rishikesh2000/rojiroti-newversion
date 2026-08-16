import { useEffect, useState } from "react";
import useEmployerStore from "@/store/employerStore";
import { useSession } from "@/lib/session";

export default function EmployerProfile() {
  const { employer, getEmployer, updateEmployerProfile, isLoading } = useEmployerStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
  });

  useEffect(() => {
    getEmployer().catch(() => {});
  }, [getEmployer]);

  // Initialize form data when employer data loads
  useEffect(() => {
    if (employer) {
      setFormData({
        name: employer.name ?? "",
        email: employer.email ?? "",
        phone: employer.phone ?? "",
        gstin: employer.gstin ?? "",
      });
    }
  }, [employer]);

  const fullName = employer?.name ?? "NA";
  const email = employer?.email ?? "NA";
  const mobile = employer?.phone ?? "NA";
  const emailVerified = employer?.email_verified ?? false;
  const gstin = employer?.gstin ?? "NA";

  const handleSave = async () => {
    try {
      await updateEmployerProfile({
        name: formData.name,
        email: formData.email,
        gstin: formData.gstin || null,
        employer_type: employer?.employer_type ?? "company",
      });
      await getEmployer();
      setEditing(false);
    } catch (error) {
      console.error("Failed to update employer profile", error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: employer?.name ?? "",
      email: employer?.email ?? "",
      phone: employer?.phone ?? "",
      gstin: employer?.gstin ?? "",
    });
    setEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h1 className="text-xl font-bold text-slate-900">Profile</h1>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Basic details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Full name</label>
                <input
                  type="text"
                  name="name"
                  readOnly={!editing}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none read-only:bg-slate-50"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500">Official email ID</label>
                  {!emailVerified && (
                    <span className="text-xs font-semibold text-amber-600">Not Verified</span>
                  )}
                </div>
                <div className="mt-1 flex gap-2">
                  <input
                    type="email"
                    name="email"
                    readOnly={!editing}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
                  />
                  {!emailVerified && (
                    <button
                      type="button"
                      disabled
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Mobile</label>
                <input
                  type="tel"
                  name="phone"
                  readOnly={!editing}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-slate-700">GST / ISD-GST Details</h2>
            <div className="flex gap-2">
              <input
                type="text"
                name="gstin"
                readOnly={!editing}
                placeholder="Enter GST / ISD-GST No."
                value={formData.gstin}
                onChange={handleInputChange}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="button"
                disabled={!editing}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400 disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
