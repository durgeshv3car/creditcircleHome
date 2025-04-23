export function getMenuList(pathname: string, role: string): Group[] {
  return [
    {
      groupLabel: "",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard",
          label: "dashboard",
          icon: "heroicons-outline:home",
          submenus: [  
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "admin",
      menus: [
        {
          id: "admin",
          href: "",
          label: "admin",
          active: pathname.includes("/admin"),
          icon: "heroicons-outline:academic-cap",
          submenus: [
            {
              href: "/Admin/admin-section/user-management",
              label: "User Management",
              active: pathname === "/Admin/admin-section/user-management",
              icon: "heroicons-outline:user-group", // leads icon
              children: [],
            },
            {
              href: "/Admin/admin-section/api-management",
              label: "Api Management",
              active: pathname === "/Admin/admin-section/api-management",
              icon: "heroicons-outline:gift", // offers icon
              children: [],
            },
            {
              href: "/Admin/admin-section/user-logs",
              label: "User Logs",
              active: pathname === "/Admin/admin-section/user-logs",
              icon: "heroicons-outline:user-group", // leads icon
              children: [],
            },
            
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "lms",
      menus: [
        {
          id: "lms",
          href: "",
          label: "Lms",
          active: pathname.includes("/lms"),
          icon: "heroicons-outline:user-group",
          submenus: [
            {
              href: "/Lms/lms-section/leads",
              label: "leads",
              active: pathname === "/Lms/lms-section/leads",
              icon: "heroicons-outline:user-group", // leads icon
              children: [],
            },
            {
              href: "/Lms/lms-section/offerleads",
              label: "offerleads",
              active: pathname === "/Lms/lms-section/offerleads",
              icon: "heroicons-outline:gift", // offers icon
              children: [],
            },
            {
              href: "/Lms/lms-section/loanapplications",
              label: "loanapplications",
              active: pathname === "/Lms/lms-section/loanapplications",
              icon: "heroicons-outline:user-group", // leads icon
              children: [],
            },
            {
              href: "/Lms/lms-section/loanstatus",
              label: "loanstatus",
              active: pathname === "/Lms/lms-section/loanstatus",
              icon: "heroicons-outline:gift", // offers icon
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "advertisment",
      menus: [
        {
          id: "advertisment",
          href: "",
          label: "Advertisment",
          active: pathname.includes("/Advertisment"),
          icon: "heroicons-outline:megaphone",
          submenus: [
            {
              href: "/Advertisement/home-section/slider",
              label: "Top Banner",
              active: pathname === "/Advertisement/home-section/slider",
              icon: "heroicons-outline:photo",
              children: [],
            },
            {
              href: "/Advertisement/home-section/logo",
              label: "Lending Partner Logo",
              active: pathname === "/Advertisement/home-section/logo",
              icon: "heroicons-outline:bookmark",
              children: [],
            },
            {
              href: "/Advertisement/home-section/offer",
              label: "Offers",
              active: pathname === "/Advertisement/home-section/offer",
              icon: "heroicons-outline:tag",
              children: [],
            },
           
            {
              href: "/Advertisement/home-section/category",
              label: "Category",
              active: pathname === "/Advertisement/home-section/category",
              icon: "heroicons-outline:folder",
              children: [],
            },
            {
              href: "/Advertisement/loan-section/creditCard",
              label: "Credit Card Offers",
              active: pathname === "/Advertisement/loan-section/creditCard",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/Advertisement/loan-section/carInsurance",
              label: "Car Insurance",
              active: pathname === "/Advertisement/loan-section/carInsurance",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/Advertisement/loan-section/healthInsurance",
              label: "Health Insurance",
              active: pathname === "/Advertisement/loan-section/healthInsurance",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/Advertisement/loan-section/lifeInsurance",
              label: "Life Insurance",
              active: pathname === "/Advertisement/loan-section/lifeInsurance",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/Advertisement/loan-section/mutualFunds",
              label: "Mutual Funds",
              active: pathname === "/Advertisement/loan-section/mutualFunds",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/Advertisement/loan-section/stockMarket",
              label: "Stock Market",
              active: pathname === "/Advertisement/loan-section/stockMarket",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/Advertisement/loan-section/incomePlan",
              label: "Income Plans",
              active: pathname === "/Advertisement/loan-section/incomePlan",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
           
          ],
        },
      ],
    },

    {
      groupLabel: "",
      id: "tools",
      menus: [
        {
          id: "tools",
          href: "",
          label: "tools",
          active: pathname.includes("/tools"),
          icon: "heroicons-outline:wrench",
          submenus: [
             {
              href: "/Tools/messageCenter",
              label: "messageCenter",
              active: pathname === "/Tools/messageCenter",
              icon: "heroicons-outline:hand-raised",
              children: [
                {
                  href: "/Tools/messageCenter/application",
                  label: "Application",
                  active: pathname === "/Tools/messageCenter/application",
                  icon: "heroicons-outline:document-text",
                  children: [],
                },
                {
                  href: "/Tools/messageCenter/whatsapp",
                  label: "Whatsapp",
                  active: pathname === "/Tools/messageCenter/whatsapp",
                  icon: "heroicons-outline:chat-bubble-bottom-center-text",
                  children: [],
                },
                {
                  href: "/Tools/messageCenter/sms",
                  label: "Sms",
                  active: pathname === "/Tools/messageCenter/sms",
                  icon: "heroicons-outline:chat-bubble-left",
                  children: [],
                },
                {
                  href: "/Tools/messageCenter/email",
                  label: "Email",
                  active: pathname === "/Tools/messageCenter/email",
                  icon: "heroicons-outline:envelope",
                  children: [],
                },
                {
                  href: "/Tools/messageCenter/rcs",
                  label: "Rcs",
                  active: pathname === "/Tools/messageCenter/rcs",
                  icon: "heroicons-outline:envelope",
                  children: [],
                },
              ],
            },
            {
              href: "/Tools/Analytics",
              label: "Analytics",
              active: pathname === "/Tools/Analytics",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
         
          ],
        },
      ],
    },
    

    
    
 
    
    {
      groupLabel: "",
      id: "others",
      menus: [
        {
          id: "others",
          href: "",
          label: "others",
          active: pathname.includes("/others"),
          icon: "heroicons-outline:exclamation-circle",
          submenus: [
             {
              href: "/Others/home-section/refer-earn",
              label: "Refer&Earns",
              active: pathname === "/Others/home-section/refer-earn",
              icon: "heroicons-outline:hand-raised",
              children: [],
            },
            {
              href: "/Others/home-section/money-smart",
              label: "MoneySmarts",
              active: pathname === "/Others/home-section/money-smart",
              icon: "heroicons-outline:banknotes",
              children: [],
            },
            {
              href: "/Others/page-section/faq",
              label: "Faq",
              active: pathname === "/Others/page-section/faq",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/Others/page-section/policy",
              label: "Policy",
              active: pathname === "/Others/page-section/policy",
              icon: "heroicons-outline:shield-check",
              children: [],
            },
          ],
        },
      ],
    },
    ...(role === "Super Admin" || role === "Admin"
      ? [
          {
            groupLabel: "",
            id: "account",
            menus: [
              {
                id: "createAccount",
                href: "",
                label: "Account",
                active: pathname.includes("/auth"),
                icon: "heroicons-outline:user",
                submenus: [
                  {
                    href: "/auth/register",
                    label: "Create Account",
                    active: pathname === "/auth/register",
                    icon: "heroicons-outline:user-plus",
                    children: [],
                  },
                ],
              },
            ],
          },
        ]
      : []),
  ];
}
