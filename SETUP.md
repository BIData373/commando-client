# הוראות התקנה - Setup Instructions

## Step 1: Install Dependencies

אם Node.js ו-npm מותקנים במערכת:

```bash
cd instructions-system
npm install
```

## Step 2: Initialize MSW (Mock Service Worker)

נדרש בפעם הראשונה בלבד:

```bash
npx msw init public/ --save
```

פקודה זו תיצור את הקובץ `public/mockServiceWorker.js` הנדרש עבור MSW.

## Step 3: Run Development Server

```bash
npm run dev
```

השרת יעלה על: http://localhost:3000

## Step 4: Verify RTL & Routing

בדוק את הדפים הבאים:

1. **Home Page**: http://localhost:3000/
2. **Environment Page**: http://localhost:3000/env/1
3. **Instruction Page**: http://localhost:3000/env/1/i/123
4. **Personal Area** (stub): http://localhost:3000/personal
5. **Environment Settings** (stub): http://localhost:3000/env/1/settings

## Expected Result

אמורים לראות:
- ✅ ממשק בעברית (RTL)
- ✅ נתיבים עובדים
- ✅ עמודי placeholder עם טקסטים בעברית
- ✅ MUI theme מוחל (כפתורים, טיפוגרפיה)
- ✅ Console נקי מ-errors

## Troubleshooting

### אם Node.js לא מותקן:

1. הורד והתקן Node.js מ: https://nodejs.org/ (גרסה LTS)
2. אמת התקנה: `node --version` ו-`npm --version`
3. הרץ שוב את הפקודות למעלה

### אם יש שגיאות בהתקנה:

```bash
# נקה cache ונסה שוב
npm cache clean --force
npm install
```

### אם MSW לא עובד:

ודא שהקובץ `public/mockServiceWorker.js` קיים.
אם לא, הרץ:

```bash
npx msw init public/ --save
```

## Next Steps

אחרי שכל הבדיקות עברו בהצלחה, תשלח **APPROVE** כדי להמשיך ל-Step 2.
