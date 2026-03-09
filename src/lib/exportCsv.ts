/** Export data as a CSV file with BOM for proper Hebrew display in Excel */
export function exportToCsv(
  headers: string[],
  rows: string[][],
  filename = 'export.csv'
): void {
  const BOM = '\uFEFF';
  const escape = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csv =
    BOM +
    [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join(
      '\r\n'
    );

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
