import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  export type FC<P = {}> = React.FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
}

declare module 'react-router-dom' {
  export function Link(props: any): JSX.Element;
  export function useNavigate(): (path: string) => void;
  export function useParams<T extends Record<string, string>>(): T;
}

declare module 'react-i18next' {
  export function useTranslation(namespace?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: any;
  };
}

declare module 'framer-motion' {
  export const motion: {
    [key: string]: any;
  };
}

declare module 'lucide-react' {
  export function Calendar(props: any): JSX.Element;
  export function BarChart2(props: any): JSX.Element;
  export function Star(props: any): JSX.Element;
  export function Users(props: any): JSX.Element;
  export function Check(props: any): JSX.Element;
  export function ArrowRight(props: any): JSX.Element;
  export function User(props: any): JSX.Element;
  export function Mail(props: any): JSX.Element;
  export function Lock(props: any): JSX.Element;
  export function AlertCircle(props: any): JSX.Element;
  export function Loader(props: any): JSX.Element;
  export function UserPlus(props: any): JSX.Element;
  export function Home(props: any): JSX.Element;
  export function ArrowLeft(props: any): JSX.Element;
  // Add other icons as needed
}
