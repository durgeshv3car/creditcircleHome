import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Link from "next/link";
import {
  Bell,
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  Radio,
} from "lucide-react";

export default async function MainPage() {
  const allowed = await checkRoute("messageCenter");
  if (!allowed) notFound();

  const channels = [
    {
      title: "Application Notifications",
      description: "Send push alerts, updates and offer banners directly into the user mobile application.",
      href: "/Tools/messageCenter/application",
      icon: Bell,
      iconBg: "bg-[#0B1740] text-white",
      badge: "In-App Push",
      badgeColor: "bg-[#101E4E]/10 text-[#101E4E]",
      status: "Active",
    },
    {
      title: "WhatsApp Messaging",
      description: "Direct WhatsApp business messages, template broadcasts, and customer engagement.",
      href: "/Tools/messageCenter/whatsapp",
      icon: MessageSquare,
      iconBg: "bg-emerald-50 text-emerald-700",
      badge: "WhatsApp Business",
      badgeColor: "bg-emerald-50 text-emerald-700",
      status: "Active",
    },
    {
      title: "SMS Campaigns",
      description: "High-deliverability transactional and promotional SMS notifications to verified leads.",
      href: "/Tools/messageCenter/sms",
      icon: Smartphone,
      iconBg: "bg-[#0B1740] text-white",
      badge: "Direct SMS",
      badgeColor: "bg-[#101E4E]/10 text-[#101E4E]",
      status: "Active",
    },
    {
      title: "Email Dispatch",
      description: "Rich HTML emails for loan approvals, document verifications, and partner offers.",
      href: "/Tools/messageCenter/email",
      icon: Mail,
      iconBg: "bg-amber-50 text-amber-700",
      badge: "Email Gateway",
      badgeColor: "bg-amber-50 text-amber-700",
      status: "Active",
    },
    {
      title: "RCS Messaging",
      description: "Next-gen rich interactive messaging with carousels, action buttons and branding.",
      href: "/Tools/messageCenter/rcs",
      icon: Send,
      iconBg: "bg-purple-50 text-purple-700",
      badge: "Rich RCS",
      badgeColor: "bg-purple-50 text-purple-700",
      status: "Active",
    },
    {
      title: "Analytics & Reports",
      description: "Detailed performance logs, delivery tracking, open rates and failure telemetry.",
      href: "/Tools/Analytics",
      icon: BarChart2,
      iconBg: "bg-[#0B1740] text-white",
      badge: "Telemetry",
      badgeColor: "bg-[#101E4E]/10 text-[#101E4E]",
      status: "Insights",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Card matching LMS Leads */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Message Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#101E4E]/10 text-[#101E4E] border border-[#101E4E]/20">
                  Omnichannel Tools
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Centralized multi-channel broadcast management, notifications, and customer engagement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200/60 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            All 5 Gateways Operational
          </div>
        </div>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {channels.map((channel) => {
          const IconComponent = channel.icon;
          return (
            <Link
              key={channel.title}
              href={channel.href}
              className="group p-5 bg-white rounded-sm border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-sm flex items-center justify-center ${channel.iconBg} shadow-2xs group-hover:scale-105 transition-transform duration-200`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-sm text-[11px] font-semibold ${channel.badgeColor}`}
                  >
                    {channel.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors tracking-tight">
                  {channel.title}
                </h3>
                <p className="text-xs text-slate-400 font-normal mt-1.5 leading-relaxed">
                  {channel.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#EA580C]">
                <span>Manage channel</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

