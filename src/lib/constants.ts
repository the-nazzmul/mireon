import {
  BotIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  PresentationIcon,
} from "lucide-react";

export const APPLICATION_NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Q&A", url: "/qa", icon: BotIcon },
  { title: "Meetings", url: "/meetings", icon: PresentationIcon },
  { title: "Billing", url: "/billing", icon: CreditCardIcon },
];
