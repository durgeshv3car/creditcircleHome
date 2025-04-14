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
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [
            {
              href: "/dashboard/leads",
              label: "leads",
              active: pathname === "/dashboard/leads",
              icon: "heroicons-outline:user-group", // leads icon
              children: [],
            },
            {
              href: "/dashboard/offerleads",
              label: "offerleads",
              active: pathname === "/dashboard/offerleads",
              icon: "heroicons-outline:gift", // offers icon
              children: [],
            },
            {
              href: "/dashboard/loanapplications",
              label: "loanapplications",
              active: pathname === "/dashboard/loanapplications",
              icon: "heroicons-outline:user-group", // leads icon
              children: [],
            },
            {
              href: "/dashboard/loanstatus",
              label: "loanstatus",
              active: pathname === "/dashboard/loanstatus",
              icon: "heroicons-outline:gift", // offers icon
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "layout",
      menus: [
        {
          id: "layout",
          href: "",
          label: "layout",
          active: pathname.includes("/layout"),
          icon: "heroicons-outline:rectangle-stack",
          submenus: [
            {
              href: "/layout/home-section/slider",
              label: "Sliders",
              active: pathname === "/layout/home-section/slider",
              icon: "heroicons-outline:arrows-right-left",
              children: [],
            },
            {
              href: "/layout/home-section/logo",
              label: "Logos",
              active: pathname === "/layout/home-section/logo",
              icon: "heroicons-outline:bookmark",
              children: [],
            },
            {
              href: "/layout/home-section/offer",
              label: "Offers",
              active: pathname === "/layout/home-section/offer",
              icon: "heroicons-outline:tag",
              children: [],
            },
            {
              href: "/layout/home-section/refer-earn",
              label: "Refer&Earns",
              active: pathname === "/layout/home-section/refer-earn",
              icon: "heroicons-outline:hand-raised",
              children: [],
            },
            {
              href: "/layout/home-section/money-smart",
              label: "MoneySmarts",
              active: pathname === "/layout/home-section/money-smart",
              icon: "heroicons-outline:banknotes",
              children: [],
            },
            {
              href: "/layout/home-section/category",
              label: "Category",
              active: pathname === "/layout/home-section/category",
              icon: "heroicons-outline:folder",
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "messageCenter",
      menus: [
        {
          id: "messageCenter",
          href: "",
          label: "messageCenter",
          active: pathname.includes("/messageCenter"),
          icon: "heroicons-outline:envelope-open",
          submenus: [
            {
              href: "/messageCenter/application",
              label: "Application",
              active: pathname === "/messageCenter/application",
              icon: "heroicons-outline:document-text",
              children: [],
            },
            {
              href: "/messageCenter/whatsapp",
              label: "Whatsapp",
              active: pathname === "/messageCenter/whatsapp",
              icon: "heroicons-outline:chat-bubble-bottom-center-text",
              children: [],
            },
            {
              href: "/messageCenter/sms",
              label: "Sms",
              active: pathname === "/messageCenter/sms",
              icon: "heroicons-outline:chat-bubble-left",
              children: [],
            },
            {
              href: "/messageCenter/email",
              label: "Email",
              active: pathname === "/messageCenter/email",
              icon: "heroicons-outline:envelope",
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "pages",
      menus: [
        {
          id: "pages",
          href: "",
          label: "pages",
          active: pathname.includes("/pages"),
          icon: "heroicons-outline:document",
          submenus: [
            {
              href: "/pages/faq",
              label: "Faq",
              active: pathname === "/pages/faq",
              icon: "heroicons-outline:question-mark-circle",
              children: [],
            },
            {
              href: "/pages/policy",
              label: "Policy",
              active: pathname === "/pages/policy",
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
