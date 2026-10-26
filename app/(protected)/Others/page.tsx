import Link from "next/link";
import {
  Gift,
  Banknote,
  HelpCircle,
  ShieldCheck,
  Globe,
  Coins,
  Award,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function OthersHubPage() {
  const sections = [
    {
      title: "Refer & Earns",
      description: "Manage referral reward schemes, promotional graphics, and customer invite programs.",
      href: "/Others/home-section/refer-earn",
      icon: Gift,
      iconBg: "bg-[#0B1740] text-white",
      badge: "Promotions",
      badgeColor: "bg-[#101E4E]/10 text-[#101E4E]",
    },
    {
      title: "Money Smarts",
      description: "Financial advice content, instructional banners, and educational insights.",
      href: "/Others/home-section/money-smart",
      icon: Banknote,
      iconBg: "bg-emerald-50 text-emerald-700",
      badge: "Financial Guides",
      badgeColor: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Frequently Asked Questions",
      description: "Customer service knowledge base, loan queries, and self-help articles.",
      href: "/Others/page-section/faq",
      icon: HelpCircle,
      iconBg: "bg-[#0B1740] text-white",
      badge: "Knowledge Base",
      badgeColor: "bg-[#101E4E]/10 text-[#101E4E]",
    },
    {
      title: "Terms & Policies",
      description: "Platform legal terms, compliance documentation, and privacy agreements.",
      href: "/Others/page-section/policy",
      icon: ShieldCheck,
      iconBg: "bg-[#0B1740] text-white",
      badge: "Legal & Compliance",
      badgeColor: "bg-[#101E4E]/10 text-[#101E4E]",
    },
    {
      title: "Credit Score URLs",
      description: "Partner bureau integration endpoints and score check redirect destinations.",
      href: "/Others/page-section/credit-score",
      icon: Globe,
      iconBg: "bg-amber-50 text-amber-700",
      badge: "Endpoints",
      badgeColor: "bg-amber-50 text-amber-700",
    },
    {
      title: "Wallet Points",
      description: "Reward point allocations, user bonus tiers, and loyalty configurations.",
      href: "/Others/page-section/wallet-points",
      icon: Coins,
      iconBg: "bg-purple-50 text-purple-700",
      badge: "Loyalty Points",
      badgeColor: "bg-purple-50 text-purple-700",
    },
    {
      title: "Redeem List",
      description: "Gift cards, discount vouchers, and catalog items redeemable with reward coins.",
      href: "/Others/home-section/redeem-list",
      icon: Award,
      iconBg: "bg-rose-50 text-rose-700",
      badge: "Rewards Catalog",
      badgeColor: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Card matching LMS Leads */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Others Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#101E4E]/10 text-[#101E4E] border border-[#101E4E]/20">
                  Content & Config
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Configure content portals, policies, reward programs, and credit partner endpoints
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Section Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

              <h2 className="text-sm font-bold text-slate-900 group-hover:text-[#FF6B4A] transition-colors mb-1.5 flex items-center justify-between">
                <span>{sec.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF6B4A] group-hover:translate-x-1 transition-all" />
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
