import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Brightwork` : 'Brightwork — Find work worth showing up for';
  }, [title]);
}
