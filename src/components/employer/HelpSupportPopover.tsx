import { Calendar, Download, HelpCircle, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

export function HelpSupportPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
      >
        <HelpCircle className="h-4 w-4" />
        Help & Support
      </button>

      {open && (
        <div className="absolute bottom-0 left-full z-50 ml-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <HelpCircle className="h-4 w-4 text-slate-500" />
            FAQ
          </button>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="px-2 text-sm font-semibold text-slate-900">Contact us</p>
            <p className="px-2 text-xs text-slate-500">( Mon to Sun | 9:00 AM - 7:00 PM )</p>
            <button type="button" className="mt-2 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <MessageCircle className="h-4 w-4 text-slate-500" />
              Chat with us
            </button>
            <button type="button" className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <span className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-green-600" />
                Chat on Whatsapp
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Recommended
              </span>
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Calendar className="h-4 w-4 text-slate-500" />
              Schedule Training
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4 text-slate-500" />
              HR Best practices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
