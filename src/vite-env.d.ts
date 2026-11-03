/// <reference types="vite/client" />

// Evita que un nombre de variable mal escrito se acepte por un índice genérico.
interface ViteTypeOptions {
  readonly strictImportMetaEnv: unknown;
}
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
