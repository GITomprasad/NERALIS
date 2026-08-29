/**
 * Google Identity Services (GIS) ID-Token Authentication Client.
 * Implements genuine OpenID Connect (OIDC) ID-token flow via `google.accounts.id`.
 * Obtains cryptographically signed Google ID tokens (JWT) for FastAPI backend verification.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: 'signin' | 'signup' | 'use';
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: string | number;
              locale?: string;
            }
          ) => void;
          prompt: (notification?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export interface GoogleCredentialResponse {
  credential: string; // The genuine Google ID token (JWT)
  select_by?: string;
  clientId?: string;
}

export interface GoogleIdTokenPayload {
  iss?: string;
  sub?: string;
  azp?: string;
  aud?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat?: number;
  exp?: number;
}

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

/**
 * Loads the official Google Identity Services SDK.
 */
export const loadGoogleIdentityScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.google?.accounts?.id) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${GIS_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

/**
 * Retrieves the configured Google OAuth 2.0 Client ID.
 */
export const getGoogleClientId = (): string | undefined => {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envId && envId.trim() !== '' && !envId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    return envId.trim();
  }
  return undefined;
};

/**
 * Safely parses the payload of a JWT ID token on the client side.
 * (Note: The FastAPI backend will cryptographically verify signature against Google's public keys).
 */
export const parseGoogleIdToken = (credential: string): GoogleIdTokenPayload | null => {
  try {
    const parts = credential.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Initializes Google Identity Services and renders the official Google ID-token button into a DOM container.
 */
export const mountGoogleIdSignIn = async (
  container: HTMLElement,
  onCredentialReceived: (credential: string, payload: GoogleIdTokenPayload | null) => void,
  options?: {
    text?: 'continue_with' | 'signin_with' | 'signup_with';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    width?: number;
  }
): Promise<boolean> => {
  const isLoaded = await loadGoogleIdentityScript();
  if (!isLoaded || !window.google?.accounts?.id) {
    console.warn('Google Identity Services SDK could not be loaded.');
    return false;
  }

  const clientId = getGoogleClientId();
  if (!clientId) {
    return false;
  }

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: GoogleCredentialResponse) => {
        if (response.credential) {
          const payload = parseGoogleIdToken(response.credential);
          onCredentialReceived(response.credential, payload);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
    });

    // Clear previous button content before rendering
    container.innerHTML = '';

    window.google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: options?.theme || 'outline',
      size: 'large',
      text: options?.text || 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: options?.width || (container.clientWidth > 0 ? container.clientWidth : 340),
    });

    return true;
  } catch (err) {
    console.error('Failed to initialize Google ID-token sign-in:', err);
    return false;
  }
};
