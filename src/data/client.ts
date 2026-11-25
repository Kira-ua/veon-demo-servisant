// Facts and contacts of the client: only from veon/client.json (company.contacts, products_services, S-F001…S-F004).
export const phones = {
  service: { label: "098-498-85-08", big: "098 498 85 08", href: "tel:+380984988508" },
  service2: { label: "099-498-85-08", href: "tel:+380994988508" },
  sales: { label: "098-204-84-88", href: "tel:+380982048488" },
  office: { label: "0 (32) 242-80-42", href: "tel:+380322428042" },
} as const;

export const email = { label: "servisant-ok@ukr.net", href: "mailto:servisant-ok@ukr.net" };
export const viber = { label: "Viber сервісу", href: "viber://chat?number=%2B380984988508" };
export const telegram = { label: "Telegram", handle: "@office_servisant", href: "https://t.me/office_servisant" };
export const instagram = { label: "Instagram", handle: "@servisant_lviv", href: "https://www.instagram.com/servisant_lviv/" };

export const address = {
  street: "вул. Хлібна, 4а",
  city: "Львів",
  note: "вхід з внутрішнього двору",
  map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Львів, вул. Хлібна, 4а"),
};

// S-F001: official list of Buderus service partners (Lviv region).
export const buderusSource =
  "https://www.buderus.com/ua/uk/%D0%BF%D1%96%D0%B4%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0/%D1%81%D0%B5%D1%80%D0%B2%D1%96%D1%81/";

// products_services[6]: by the company's own site; only Buderus is confirmed externally (S-F001).
export const authorisedBrands = ["Bosch", "Buderus", "Viessmann", "Airfel", "Immergas", "Wolf"] as const;
export const otherAuthorised = ["Bosch", "Viessmann", "Airfel", "Immergas", "Wolf"] as const;

export const officeHours = { days: "Пн–Пт", open: 10, close: 17, text: "Пн–Пт 10:00–17:00" };
