// Type declarations for modules without TypeScript definitions

declare module 'react-icons/fa' {
  export const FaUser: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaThumbsUp: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaThumbsDown: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaReply: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaTrash: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaMapMarkerAlt: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaCalendarAlt: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaEdit: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaImage: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaFilter: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaHome: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export const FaSignOutAlt: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

declare module 'react-toastify' {
  export const toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
  };
  export const ToastContainer: React.ComponentType<any>;
}

// Add module augmentation for Next.js
declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
  };
  
  export function useParams<T = Record<string, string>>(): T;
}

// Add module augmentation for date-fns
declare module 'date-fns' {
  export function formatDistanceToNow(date: Date | number, options?: { addSuffix?: boolean }): string;
}
