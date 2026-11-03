// Apunte de estudio: Aquí espero antes de actualizar el valor de búsqueda; limpio el temporizador cuando cambia la entrada.
import { useEffect, useState } from "react";
export function useDebounce<T>(valor: T, delay: number = 350): T {
  const [debounced, setDebounced] = useState(valor);
  // Aquí programo la espera y la limpio para no conservar un temporizador anterior.
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timeout);
  }, [valor, delay]);
  return debounced;
}
