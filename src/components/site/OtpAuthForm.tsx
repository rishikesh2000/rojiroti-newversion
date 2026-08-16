import { useEffect, useState } from "react";
import { Phone, ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import useAuthStore from "../../store/authStore";

const RESEND_OTP_SECONDS = 60;

interface OtpAuthFormProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  accent?: "primary" | "white";
  onSuccess?: (data?: any) => void;
  showNameField?: boolean;
  isSignup?: boolean;
  appRole?: "employee" | "employer";
}

export function OtpAuthForm({ title, subtitle, ctaLabel, accent = "primary", onSuccess, showNameField = true, isSignup = false, appRole = "employee" }: OtpAuthFormProps) {
  const { reqOtp, verifyOtp, reqSignupOtp, verifySignupOtp, error, isLoading } = useAuthStore();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const countdown = window.setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(countdown);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(countdown);
  }, [resendCooldown]);

  const valid = (showNameField ? fullName.trim().length > 1 : true) && /^\d{10}$/.test(mobile);

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 3) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  };

  const extractErrorMessage = (err: any): string => {
    // Check for API error response formats
    if (err.response?.data) {
      const data = err.response.data;
      
      // Format 1: {error: "message"}
      if (data.error) return data.error;
      
      // Format 2: {message: "message"}
      if (data.message) return data.message;
      
      // Format 3: {error_type: "HTTPException", detail: "message"}
      if (data.detail) return data.detail;
      
      // Format 4: Validation errors {detail: [{msg: "message"}]}
      if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg;
      
      // Format 5: Just show error_type if available
      if (data.error_type) return data.error_type;
    }
    
    // Fallback to error message or status text
    return err.response?.statusText || "An error occurred";
  };

  const startResendCooldown = () => setResendCooldown(RESEND_OTP_SECONDS);

  const sendOtp = async () => {
    if (!valid || resendCooldown > 0 || isLoading) return;
    setLocalError("");
    try {
      const res = isSignup
        ? await reqSignupOtp(mobile, appRole, fullName)
        : await reqOtp(mobile, appRole);
      if (res?.status === 200) {
        setOtp(["", "", "", ""]);
        setStep("otp");
        startResendCooldown();
      }
    } catch (err: any) {
      const errorMsg = extractErrorMessage(err);
      setLocalError(errorMsg || "Failed to send OTP");
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading || !valid) return;
    await sendOtp();
  };

  const verify = async () => {
    if (otp.join("").length !== 4) return;
    setLocalError("");
    try {
      const res = isSignup
        ? await verifySignupOtp(mobile, otp.join(""), appRole,fullName)
        : await verifyOtp(mobile, otp.join(""), appRole);
      if (res?.status === 200) {
        onSuccess?.(res?.data);
      }
    } catch (err: any) {
      const errorMsg = extractErrorMessage(err);
      setLocalError(errorMsg || "Failed to verify OTP");
    }
  };

  const btnClass =
    accent === "white"
      ? "w-full rounded-full bg-white py-3 text-sm font-semibold text-foreground shadow-soft hover:shadow-glow disabled:opacity-50"
      : "w-full rounded-full bg-gradient-primary py-3 text-sm font-semibold text-white shadow-soft hover:shadow-glow disabled:opacity-50";

  return (
    <div>
      <h1 className={`text-2xl font-bold ${accent === "white" ? "text-white" : ""}`}>{title}</h1>
      <p className={`mt-1 text-sm ${accent === "white" ? "text-white/75" : "text-muted-foreground"}`}>{subtitle}</p>

      {step === "mobile" ? (
        <div className="mt-6 space-y-4">
          {showNameField && (
            <label className="block">
              <span className={`text-xs font-semibold ${accent === "white" ? "text-white/80" : "text-muted-foreground"}`}>
                Full name
              </span>
              <input
                type="text"
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
          )}
          <label className="block">
            <span className={`text-xs font-semibold ${accent === "white" ? "text-white/80" : "text-muted-foreground"}`}>
              Mobile number
            </span>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 shadow-card border border-slate-200">
              <Phone className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </label>
          {(localError || error) && (
            <div className="rounded-2xl bg-red-50 p-3 flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{localError || error}</p>
            </div>
          )}
          <button onClick={sendOtp} disabled={!valid || isLoading} className={btnClass}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Sending...
              </span>
            ) : (
              ctaLabel
            )}
          </button>
          <p className={`text-center text-[11px] ${accent === "white" ? "text-white/60" : "text-muted-foreground"}`}>
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <button
            onClick={() => setStep("mobile")}
            className={`inline-flex items-center gap-1 text-xs font-semibold ${accent === "white" ? "text-white/80" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ArrowLeft className="h-3 w-3" /> Change number
          </button>
          <div>
            <p className={`text-xs font-semibold ${accent === "white" ? "text-white/80" : "text-muted-foreground"}`}>
              Verify OTP
            </p>
            <p className={`text-xs ${accent === "white" ? "text-white/80" : "text-muted-foreground"}`}>
              Enter the OTP sent to +91 {mobile}
            </p>
            {showNameField && <p className="mt-2 text-xs text-slate-500">Full name: {fullName}</p>}
            <div className="mt-3 flex gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="h-12 w-full rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 text-center text-lg font-bold shadow-card outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              ))}
            </div>
          </div>
          {(localError || error) && (
            <div className="rounded-2xl bg-red-50 p-3 flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{localError || error}</p>
            </div>
          )}
          <button onClick={verify} disabled={otp.join("").length !== 4 || isLoading} className={btnClass}>
            <span className="inline-flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Verify OTP
                </>
              )}
            </span>
          </button>
          <p className={`text-center text-xs ${accent === "white" ? "text-white/70" : "text-muted-foreground"}`}>
            Didn't receive?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isLoading}
              className={`${accent === "white" ? "font-semibold text-white" : "font-semibold text-gradient"} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
