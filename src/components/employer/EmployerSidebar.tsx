import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Database,
  CreditCard,
  Receipt,
  Gift,
  Phone,
  ChevronDown,
  ChevronRight,
  Search,
  Bookmark,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import useEmployerStore from "@/store/employerStore";
import { HelpSupportPopover } from "./HelpSupportPopover";

type EmployerSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const mainNav = [
  { to: "/employer-dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/employer-dashboard/jobs", label: "Jobs", icon: Briefcase },
  { to: "/employer-dashboard/database", label: "Database", icon: Database, hasSub: true },
  { to: "/employer-dashboard/credits", label: "Credits & usage", icon: CreditCard },
  { to: "/employer-dashboard/billing", label: "Billing", icon: Receipt },
  { to: "/employer-dashboard/refer", label: "Refer & Earn", icon: Gift },
];

const databaseSub = [
  { to: "/employer-dashboard/database", label: "Search Candidates", icon: Search },
  { to: "/employer-dashboard/database/saved", label: "Saved Searches", icon: Bookmark },
  { to: "/employer-dashboard/database/unlocked", label: "Unlocked Candidates", icon: Unlock },
];

export function EmployerSidebar({ open, onClose }: EmployerSidebarProps) {
  const { dashboard} = useEmployerStore();
  const [dbOpen, setDbOpen] = useState(false);
  const companyName = dashboard?.company_name ?? "Guest Employer";
  const companyInitial = companyName.charAt(0).toUpperCase();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-primary"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <aside
      className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-40 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 lg:h-full lg:top-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="shrink-0 border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {companyInitial}
          </div>
          <p className="truncate text-sm font-semibold text-slate-900">{companyName}</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-hidden px-3 py-4">
        {mainNav.map((item) => {
          const Icon = item.icon;
          if (item.hasSub) {
            return (
              <div key={item.to}>
                <button
                  type="button"
                  onClick={() => setDbOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {dbOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dbOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {databaseSub.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          end={sub.to === "/employer-dashboard/database"}
                          onClick={onClose}
                          className={navClass}
                        >
                          <SubIcon className="h-4 w-4" />
                          {sub.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose} className={navClass}>
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-slate-100 px-3 py-4">
        <HelpSupportPopover />
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          <Phone className="h-4 w-4" />
          Contact Sales
          <span className="ml-auto rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
            Offers
          </span>
        </button>
        <Link
          to="/employer-dashboard/credits"
          onClick={onClose}
          className="mt-2 block rounded-lg border-2 border-primary px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary/5"
        >
          Buy credits
        </Link>
      </div>
    </aside>
  );
}
