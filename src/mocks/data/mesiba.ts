import type { IMesibaIcon } from "../../hooks/useMesiba";

function svgIcon(color: string) {
	return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="${color}"/></svg>`;
}

export const mockMesibaIcons: IMesibaIcon[] = [
	{ id: 1, iconName: svgIcon("royalblue"), heb_name: "פיקוד צפון" },
	{ id: 2, iconName: svgIcon("mediumseagreen"), heb_name: "פיקוד מרכז" },
	{ id: 3, iconName: svgIcon("goldenrod"), heb_name: "פיקוד דרום" },
	{ id: 4, iconName: svgIcon("tomato"), heb_name: "פיקוד העורף" },
	{ id: 5, iconName: svgIcon("mediumpurple"), heb_name: "מטכ״ל" },
	{ id: 6, iconName: svgIcon("deepskyblue"), heb_name: "חיל האוויר" },
	{ id: 7, iconName: svgIcon("midnightblue"), heb_name: "חיל הים" },
	{ id: 8, iconName: svgIcon("chocolate"), heb_name: "חיל השריון" },
	{ id: 9, iconName: svgIcon("slategray"), heb_name: "חיל הרגלים" },
	{ id: 10, iconName: svgIcon("darkorange"), heb_name: "חיל ההנדסה" },
	{ id: 11, iconName: svgIcon("hotpink"), heb_name: "חיל הקשר" },
	{ id: 12, iconName: svgIcon("indigo"), heb_name: "חיל המודיעין" },
];
