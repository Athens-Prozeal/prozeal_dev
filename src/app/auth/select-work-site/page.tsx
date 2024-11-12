import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { Layout } from '@/components/auth/layout';
import { SelectWorkSiteForm } from '@/components/auth/select-work-site-form';
import { AuthGuard } from '@/components/auth/auth-guard';

export const metadata = { title: `Select Work Site | Auth | ${config.site.name}` } as Metadata;

export default function Page(): React.JSX.Element {
  return (
    <AuthGuard>
    <Layout>
        <SelectWorkSiteForm />
    </Layout>
    </AuthGuard>
  );
}
