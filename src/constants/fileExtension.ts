export enum FileExtension {
    CSS = 'css',
    CSV = 'csv',
    DASH = 'dash',
    ECDATA = 'ecdata',
    IMG = 'img',
    JAQL = 'jaql',
    JSON = 'json',
    PDF = 'pdf',
    PEM = 'pem',
    PFX = 'pfx',
    PNG = 'png',
    SDATA = 'sdata',
    SMODEL = 'smodel',
    TS = 'ts',
    TXT = 'txt',
    XLS = 'xls',
    XLSX = 'xlsx',
    YAML = 'yaml',
    ZIP = 'zip',
}

export const fileExtensions: string[] = Object.values(FileExtension);
