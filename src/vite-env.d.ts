/// <reference types="vite/client" />
// Apunte de estudio: Aquí declaro las variables de entorno que TypeScript reconoce al compilar el frontend.

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
