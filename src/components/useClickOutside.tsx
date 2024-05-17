import { RefObject, useEffect, useRef } from "react";

export default function useClickOutside(elementRef: RefObject<Element>, callback: () => void) {
  const callbackRef = useRef<() => void>();
  callbackRef.current = callback;

  const handleClickOutside = (e: MouseEvent) => {
    if (elementRef.current && !elementRef.current.contains(e.target as Node) && callbackRef.current) {
      callbackRef.current();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [elementRef]);
}
