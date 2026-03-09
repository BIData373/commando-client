# תוכנית: שינוי ניסוח צבאי + עיצוב מחדש של דיאלוג יצירת מערך

## חלק א': טבלת מונחים צבאיים

| מונח אזרחי | מונח צבאי |
|---|---|
| הנחיות / הנחיה | פקודות / פקודה |
| סביבה / סביבת עבודה | מערך |
| מנהל | מפקד |
| אחראי / אחראים | ממונה / ממונים |
| חבר / חברים | לוחם / לוחמים |
| צוות | סגל |
| תגובות / הערות | דיווחים |
| סטטוס | מצב |
| עדיפות | דחיפות |
| רגילה (priority) | שגרתית |
| דחוף (priority) | מבצעי |
| פתוח (status) | ממתין לביצוע |
| בטיפול | בביצוע |
| הושלם | בוצע |
| בארכיון / ארכיון | בגניזה / גניזה |
| תיאור | פירוט |
| מקור | גורם מפקד |
| תגיות | סימוני זיהוי |
| היסטוריה | יומן פעילות |
| הגדרות | פרמטרים |
| הרשאות | סיווגים |
| דשבורד | לוח מצב |
| כרטיסיות | כרטסת |
| ייצוא | הפקת דו"ח |
| התראות | דגלים |
| הוסף | שבץ |
| שלח | הפץ |
| שמור | אשר |
| עריכה | עדכון |
| יצירה / יצירת | הקמת / הפקת |
| מחיקה | ביטול |
| בעלים (role) | מפקד |
| מנהל (role) | סגן מפקד |
| חבר (role) | לוחם |
| צופה (role) | תצפיתן |
| משאבי אנוש | כ"א |
| טכנולוגיה | תקשו"ב |
| שיווק | מבצעים |
| רגולציה | פקש"ש |
| בדיקות | בקרה |

### שמות משתמשים (mock data)
| אזרחי | צבאי |
|---|---|
| יעל כהן | סא"ל כהן |
| אבי לוי | רס"ן לוי |
| דנה מזרחי | סרן מזרחי |
| משה ישראלי | רב"ט ישראלי |
| נועה ברק | סמ"ר ברק |

### שמות מערכים (mock data)
| אזרחי | צבאי |
|---|---|
| הנהלה ראשית | מפקדת חטיבה |
| צוות פיתוח | מערך תקשו"ב |
| שיווק ומכירות | מערך לוגיסטי |

---

## חלק ב': עיצוב מחדש של CreateEnvironmentDialog

בהתאם לעיצוב מ-Figma שסופק:

### שלב 1 - "פרטי המערך":
- כותרת: "בקשה לפתיחת מערך חדש"
- Steps: 1. "פרטי המערך" → 2. "בעלי תפקידים"
- שדות:
  - "שם המערך" - input עם placeholder "חתמ"צ מטה ומאוג"ם"
  - "סמל" - dropdown עם placeholder "חפש יחידה"
  - אזור תצוגה מקדימה בגבול dashed: "כאן יופיע הסמל שנבחר" / "כלל הסמלים נמשכים ממאגר מסיב"ה"
- כפתורים: "המשך" (primary) | "נקה טופס" (outline)
- **הסרת**: שדה צבע, שדה תיאור (אין בעיצוב)
- רוחב: 417px (size="sm" or custom)

### שלב 2 - "בעלי תפקידים":
- כותרת: "בקשה לפתיחת מערך חדש"
- Steps: 1. "פרטי המערך" (completed ✓) → 2. "בעלי תפקידים" (active)
- שדות:
  - "מפקדי מערך" - search input "חפש משתמש (מס אישי/ שם)" עם כפתור user-plus כחול
  - כיתוב: "מפקדי התוכן והסיווגים של המערך"
  - אזור Tags עם שמות שנבחרו (removable)
- כפתורים: "הפץ בקשה" (primary) | "נקה טופס" (outline)
- **הסרת**: section ב' (אחראים/ממונים + כינויים), preview card, info boxes

---

## חלק ג': סדר ביצוע (קבצים)

### שכבה 1 - טיפוסים ומונחי בסיס
1. `src/types/common.ts` — STATUS_LABELS, PRIORITY_LABELS, ROLE_LABELS

### שכבה 2 - Mock Data
2. `src/mocks/data/users.ts` — שמות עם דרגות
3. `src/mocks/data/environments.ts` — שמות מערכים + תגיות
4. `src/mocks/data/activity.ts` — פעילויות
5. `src/mocks/data/comments.ts` — דיווחים בסגנון צבאי

### שכבה 3 - רכיבים משותפים
6. `src/components/common/LoadingState.tsx`
7. `src/components/common/ErrorState.tsx`
8. `src/components/ui/toast.tsx`

### שכבה 4 - רכיבי מערך (environment)
9. `src/components/environment/ColumnFilterDropdown.tsx`
10. `src/components/environment/ColumnHeaderCell.tsx`
11. `src/components/environment/InstructionFilters.tsx`
12. `src/components/environment/InstructionsTable.tsx`
13. `src/components/environment/InstructionViewModal.tsx`
14. `src/components/environment/ConfirmDeleteDialog.tsx`
15. `src/components/environment/AssigneeSubTable.tsx`
16. `src/components/environment/CardsView.tsx`
17. `src/components/environment/DashboardView.tsx`
18. `src/components/environment/EnvironmentSidebar.tsx`

### שכבה 5 - רכיבי הנחיה/פקודה
19. `src/components/instruction/InstructionDetails.tsx`
20. `src/components/instruction/InstructionHeader.tsx`
21. `src/components/instruction/ActivityTimeline.tsx`
22. `src/components/instruction/CommentsSection.tsx`

### שכבה 6 - רכיבי בית / אישי
23. `src/components/home/EnvironmentCard.tsx`
24. `src/components/home/CreateEnvironmentDialog.tsx` — **שכתוב מלא** לפי עיצוב Figma
25. `src/components/personal/PersonalTopbar.tsx`

### שכבה 7 - דפים
26. `src/pages/HomePage.tsx`
27. `src/pages/EnvironmentPage.tsx`
28. `src/pages/InstructionPage.tsx`
29. `src/pages/PersonalAreaPage.tsx`
30. `src/pages/EnvironmentSettingsPage.tsx`

### שכבה 8 - בדיקת בנייה
31. `npx tsc --noEmit` — וידוא אפס שגיאות חדשות
