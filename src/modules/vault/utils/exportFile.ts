// src/modules/vault/utils/exportFile.ts
import AppConfig from '@/app.config';
import UnsupportedExportFormatError from '@/modules/vault/errors/UnsupportedExportFormatError';
import ExportFile from '@/modules/vault/types/ExportFile';

export function downloadExportFile(file: ExportFile): void {
  const json = JSON.stringify(file, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date(file.exportedAt)
    .toISOString()
    .replace(/[:.]/g, '-');

  const a = document.createElement('a');
  a.href = url;
  a.download = `${AppConfig.APP_NAME.toLowerCase()}-export-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseExportFile(file: File): Promise<ExportFile> {
  try {
    const text = await file.text();
    return JSON.parse(text) as ExportFile;
  } catch {
    throw new UnsupportedExportFormatError();
  }
}
