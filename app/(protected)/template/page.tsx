import Link from "next/link";
import {
  Mail,
  MessageSquare,
  MessageCircle,
  UserPlus,
  ArrowRight,
  LayoutTemplate,
} from "lucide-react";

export default function TemplateHubPage() {
  const sections = [
    {
      title: "Email Templates",
      description: "Manage system notifications, customer loan updates, and marketing email templates.",
      href: "/template/template-section/email",
      icon: Mail,
      iconBg: "bg-[#0B1740] text-white",
      badge: "Messaging",
      badgeColor: "bg-[#FFF1ED] text-[#EA580C]",
    },
    {
      title: "Watti Templates",
      description: "Configure automated WhatsApp business notifications, greetings, and transactional alerts.",
      href: "/template/template-section/watti",
      icon: MessageSquare,
      iconBg: "bg-emerald-50 text-emerald-700",
      badge: "WhatsApp Business",
      badgeColor: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "SMS Templates",
      description: "Craft DLT-approved OTP verification messages, reminders, and operational SMS alerts.",
      href: "/template/template-section/sms",
      icon: MessageCircle,
      iconBg: "bg-[#0B1740] text-white",
      badge: "SMS / OTP",
      badgeColor: "bg-[#101E4E]/10 text-[#101E4E]",
    },
    {
      title: "Create Account",
      description: "Onboard new team members, assign operational roles, and configure system permissions.",
      href: "/auth/register",
      icon: UserPlus,
      iconBg: "bg-purple-50 text-purple-700",
      badge: "Access Control",
      badgeColor: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Card matching LMS Leads */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <LayoutTemplate className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Account & Template Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#101E4E]/10 text-[#101E4E] border border-[#101E4E]/20">
                  Communications & Staff
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Configure multichannel notification templates and onboard authorized enterprise team members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Section Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {sections.map((sec) => {
          const IconComponent = sec.icon;
          return (
            <Link
              key={sec.href}
              href={sec.href}
              className="group block p-5 bg-white rounded-sm border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-11 h-11 rounded-sm flex items-center justify-center shrink-0 shadow-2xs ${sec.iconBg}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm ${sec.badgeColor}`}
                >
                  {sec.badge}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors mb-1.5 flex items-center justify-between">
                <span>{sec.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#EA580C] group-hover:translate-x-1 transition-all" />
              </h2>

              <p className="text-xs text-slate-500 leading-relaxed">
                {sec.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
