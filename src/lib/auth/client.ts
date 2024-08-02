'use client';

import axios from 'axios';

import type { User } from '@/types/user';
import { config } from '@/config';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('access-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { username, password } = params;

    try {
      const response = await axios.post(`${config.site.serverURL}/api/auth/token/`, {
        username: username,
        password: password,
      });

      if (response.status !== 200) {
        return { error: 'Sign In failed with status code' + response.status };
      }
      localStorage.setItem('access-token', response.data.access);
      localStorage.setItem('refresh-token', response.data.refresh);
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Something went wrong!' };
    }

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Check if we have a token in localStorage.
    const token = localStorage.getItem('access-token');

    if (!token) {
      return { data: null };
    }

    // Get user data from backend
    let user: User | null = null;
    try {
      const response = await axios.get(`${config.site.serverURL}/api/auth/my-user-detail/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (response.status === 200) {
        user = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          company: response.data.company,
          workSiteRoles: response.data.work_site_roles,
          avatar: '/assets/avatar.png',
        } as User;
      }
    } catch (error: any) {
      console.log(error);
    }

    return { data: user };
  }


  async signOut(): Promise<{ error?: string }> {
    // Expire token from server
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('work-site-id');
    localStorage.removeItem('role');
    return {};
  }
}

export const authClient = new AuthClient();
